import React, { Component, createRef } from "react";

import Container from "../../components/misc/Container";
import KeyEvents from "../../components/misc/KeyEvents";

import Data from "../../components/localstorage/data";
import Settings from "../../components/localstorage/settings";

import { Page, Content, System, Files } from "./styles";

import FTP from "./ftp";

import Path from "./components/Path";
import File from "./components/File";
import Folder from "./components/Folder";
import Space from "./components/Space";
import Progress from "./components/Progress";
import ContextMenus from "./components/ContextMenus";
import { NewFile, NewFolder, Rename } from "./components/PseudoFile";

class SessionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      local: {
        path: "/"
      },
      extern: {
        path: "/",
        files: [],
        selected: [],
        highlighted: undefined,
        loading: true,
        onRename: false,
        onNewFile: false,
        onNewFolder: false
      },
      keys: {}
    }

    this.socket = new FTP(this.props.socket);
    this.dataSocket = new Data(this.props.socketData.host, this.props.socketData.user);

    this.settings = new Settings();

    this.upload = createRef();
    this.download = createRef();
    this.contextMenus = createRef();

    this.updateExternFiles = this.updateExternFiles.bind(this);
    this.enterExternFolder = this.enterExternFolder.bind(this);
    this.goBackExternFolder = this.goBackExternFolder.bind(this);
    this.selectExternFile = this.selectExternFile.bind(this);
    this.handleShortcut = this.handleShortcut.bind(this);
  }

  componentDidMount() {
    if (this.props.socketStatus === "online") {
      let path = this.dataSocket.get("path") || this.props.socket.absPath || "/";
      this.setState({
        extern: {
          ...this.state.extern,
          path: path
        }
      });
      this.updateExternFiles(path);
    }
  }

  updateExternFiles(path) {
    if (this.props.socketStatus === "offline") return console.debug("unable to update extern files");
    this.socket.updateExternFiles(path || this.state.extern.path, (data) => {
      if (this.settings.get("sort_by") === "type") {
        data.sort((a, b) => { return a.type < b.type ? 1 : a.type === b.type ? (a.name < b.name ? -1 : 1) : -1 })
      }
      this.setState({
        extern: {
          ...this.state.extern,
          files: data,
          selected: [],
          loading: false,
          onNewFolder: false
        }
      });
    })
  }

  enterExternFolder(folder) {
    let newPath = this.state.extern.path + folder.name + "/";
    this.setState({
      extern: {
        ...this.state.extern,
        path: newPath
      }
    });
    this.updateExternFiles(newPath)
    this.dataSocket.set("path", newPath);
    window.scrollTo(0, 0)
  }

  goBackExternFolder() {
    let newPath = this.state.extern.path;
    let depth = this.state.extern.path.split("/").length - 1;
    if (depth > 1) {
      newPath = this.state.extern.path.replace(this.state.extern.path.split("/")[depth - 1] + "/", "");
    } else if (depth === 1 && this.state.extern.path.startsWith("./")) {
      newPath = "/";
    }
    this.setState({
      extern: {
        ...this.state.extern,
        path: newPath
      }
    });
    this.updateExternFiles(newPath);
    this.dataSocket.set("path", newPath);
    window.scrollTo(0, 0)
  }

  selectExternFile(file) {
    let selected = this.state.extern.selected;
    if (this.state.keys.cmd) {
      if (selected.includes(file)) {
        let i = selected.findIndex(item => item === file)
        selected.splice(i, 1);
      } else {
        selected.push(file)
      }
    } else if (this.state.keys.shift && selected.length > 0) {
      let files = this.state.extern.files;
      let iStart = files.findIndex(item => item === selected[selected.length - 1]);
      let iEnd = files.findIndex(item => item === file);
      for (
        let i = iStart < iEnd ? iStart : iStart;
        iStart < iEnd ? i <= iEnd : i >= iEnd;
        iStart < iEnd ? i++ : i--
      ) {
        selected.push(files[i])
      }
    } else {
      selected = [file];
    }
    // remove duplicates
    selected = [...new Set(selected)];
    this.setState({
      extern: {
        ...this.state.extern,
        selected: selected
      }
    })
  }

  handleShortcut(key, code) {
    if (this.state.keys.cmd) {
      switch (key) {
        case "n":
          if (this.state.keys.shift) {
            this.setState({ extern: {...this.state.extern, onNewFolder: true} })
          }
          break;
        case "f":
          if (this.state.keys.shift) {
            this.setState({ extern: {...this.state.extern, onNewFile: true} })
          }
          break;
        case "g":
          if (this.state.extern.selected.length > 0) {
            this.socket.downloadExternFiles(
              this.state.extern.selected, undefined,
              this.updateExternFiles, this.download.current.updateProgress
            );
          }
          break;
        case "o":
          if (this.state.extern.selected.length === 1 && this.state.extern.selected[0].type === 0) {
            this.socket.openExternFile(this.state.extern.selected[0], () => {  this.updateExternFiles() });
          }
          break;
        case "a":
          this.setState({ extern: {...this.state.extern, selected: this.state.extern.files} })
          break;
        case "r":
          this.updateExternFiles();
          break;
        default:
          break;
      }

      if (code === 8) {
        let length = this.state.extern.selected.length;
        if (length > 0) {
          window.confirm(
            `${length} file${length > 1 ? "s" : ""} will be deleted`,
            (confirmed) => {
              if (confirmed) {
                this.socket.deleteExternFiles(this.state.extern.selected, this.updateExternFiles);
              }
            }
          )
        }
      }
    }
  }

  render() {
    return (
      <Page>
        <KeyEvents
          onModifierKeys={(keys) => {
            this.setState({
              keys: keys
            })
          }}
          onKeys={this.handleShortcut}
        />
        <Progress
          ref={this.upload}
          onAbort={() => {alert("Aborting an upload is temporary deactivated")}}
        />
        <Progress
          ref={this.download}
          label="Downloading"
          onAbort={() => {alert("Aborting a download is temporary deactivated")}}
        />
        <ContextMenus
          ref={this.contextMenus}
          socket={this.socket}
          selected={this.state.extern.selected}
          onProgress={(current, max, progress) => {
            this.download.current.updateProgress(current, max, progress);
          }}
          onReload={this.updateExternFiles}
          onRename={(target) => {
            setTimeout(() => { this.setState({ extern: { ...this.state.extern, onRename: { target: target } }})}, 0)
          }}
          onNewFile={() => {
            this.setState({ extern: { ...this.state.extern, onNewFile: true }})
          }}
          onNewFolder={() => {
            this.setState({ extern: { ...this.state.extern, onNewFolder: true }})
          }}
          onClose={() => {
            this.setState({ extern: { ...this.state.extern, highlighted: undefined }})
          }}
        />
        <Container>
          <Content>
            <System>
              <Space
                path={this.state.extern.path}
                onUpload={this.socket.uploadLocalFiles}
                onReturn={this.updateExternFiles}
                onClick={() => {
                  this.setState({
                    extern: {
                      ...this.state.extern,
                      selected: []
                    }
                  })
                }}
                onProgress={(current, max, progress) => {
                  this.upload.current.updateProgress(current, max, progress);
                }}
                onContext={(event) => {
                  this.contextMenus.current.openForSpace(event, this.state.extern.path)
                }}
              />
              <Path
                path={this.state.extern.path}
                onGoBack={this.goBackExternFolder}
                onJumpTo={(path) => {
                  this.setState({
                    extern: {
                      ...this.state.extern,
                      path: path
                    }
                  })
                  this.updateExternFiles(path);
                  this.dataSocket.set("path", path);
                }}
                onMove={this.socket.moveExternFiles}
                onUpload={this.socket.uploadLocalFiles}
                onProgress={(current, max, progress) => {
                  this.upload.current.updateProgress(current, max, progress);
                }}
                onReload={this.updateExternFiles}
              />
              <Files>
                {this.state.extern.onNewFile &&
                  <NewFile
                    path={this.state.extern.path}
                    onSubmit={this.socket.createExternFile}
                    onClose={() => {
                      this.setState({
                        extern: {
                          ...this.state.extern,
                          onNewFile: false
                        }
                      });
                      setTimeout(this.updateExternFiles, 100)
                    }}
                  />
                }
                {this.state.extern.onNewFolder &&
                  <NewFolder
                    path={this.state.extern.path}
                    onSubmit={this.socket.createExternFolder}
                    onClose={() => {
                      this.setState({
                        extern: {
                          ...this.state.extern,
                          onNewFolder: false
                        }
                      });
                      this.updateExternFiles();
                    }}
                  />
                }
                {this.state.extern.onRename &&
                  <Rename
                    target={this.state.extern.onRename.target}
                    onSubmit={this.socket.renameExternFile}
                    onClose={() => {
                      this.setState({
                        extern: {
                          ...this.state.extern,
                          onRename: false
                        }
                      });
                      setTimeout(this.updateExternFiles, 100)
                    }}
                  />
                }
                {Object.keys(this.state.extern.files).map((key, index) => {
                  const file = this.state.extern.files[key];
                  file.path = this.state.extern.path;

                  console.log(this.settings.get("hide_hidden_files"))

                  if (this.settings.get("hide_hidden_files") && file.name.startsWith(".")) {
                    return;
                  }

                  if (file.type === 1) {
                    return (
                      <Folder
                        key={index + file.name + file.time}
                        folder={file}
                        selection={this.state.extern.selected}
                        selected={this.state.extern.selected.includes(file)}
                        highlighted={this.state.extern.highlighted === file}
                        onClick={() => {
                          if (!this.state.keys.shift && !this.state.keys.cmd) {
                            this.enterExternFolder(file)
                          } else this.selectExternFile(file);
                        }}
                        onMove={this.socket.moveExternFiles}
                        onUpload={this.socket.uploadLocalFiles}
                        onProgress={this.upload.current.updateProgress}
                        onContext={(event) => {
                          this.contextMenus.current.openForFolder(event, file);
                          this.setState({ extern: { ...this.state.extern, highlighted: file }})
                        }}
                        onReload={this.updateExternFiles}
                      />
                    )
                  } else {
                    return (
                      <File
                        key={index + file.name + file.time}
                        file={file}
                        selection={this.state.extern.selected}
                        selected={this.state.extern.selected.includes(file)}
                        highlighted={this.state.extern.highlighted === file}
                        onClick={this.selectExternFile}
                        onDoubleClick={() => {
                          if (!this.state.keys.cmd && !this.state.keys.shift) {
                            if (this.settings.get("doubleclick_open")) {
                              this.socket.openExternFile(file)
                            }
                          }
                        }}
                        onContext={(event) => {
                          this.contextMenus.current.openForFile(event, file);
                          this.setState({ extern: { ...this.state.extern, highlighted: file }})
                        }}
                      />
                    )
                  }
                })}
              </Files>
            </System>
          </Content>
        </Container>
      </Page>
    )
  }
} 

export default SessionPage;
