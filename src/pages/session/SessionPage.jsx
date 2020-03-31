import React, { Component, createRef } from "react";

import Container from "../../components/misc/Container";
import KeyEvents from "../../components/misc/KeyEvents";
import { GoBack } from "../../components/misc/CircleButton";

import Data from "../../components/data";

import { Page, Content, System, Path, Url, Files } from "./styles";

import FTP from "./ftp";

import Folder from "./components/Folder";
import File from "./components/File";
import Space from "./components/Space";
import ContextMenus from "./components/ContextMenus";
import NewFolder from "./components/NewFolder";
import Progress from "./components/Progress";

class SessionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      local: {
        path: "/"
      },
      extern: {
        path: "/",
        files: {},
        selected: [],
        loading: true,
        newFolder: false
      },
      keys: {}
    }

    this.socket = new FTP(this.props.socket);
    this.dataSocket = new Data(this.props.socketData.host);

    this.progress = createRef();
    this.contextMenus = createRef();

    this.updateExternFiles = this.updateExternFiles.bind(this);
    this.enterExternFolder = this.enterExternFolder.bind(this);
    this.goBackExternFolder = this.goBackExternFolder.bind(this);
    this.selectExternFile = this.selectExternFile.bind(this);
    this.handleShortcut = this.handleShortcut.bind(this);
  }

  componentDidMount() {
    if (this.props.socketStatus === "online") {
      let path = this.dataSocket.get("path");
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
      this.setState({
        extern: {
          ...this.state.extern,
          files: data,
          loading: false,
          newFolder: false
        }
      });
    })
  }

  enterExternFolder(folder) {
    let newPath = this.state.extern.path + folder + "/";
    this.socket.updateExternFiles(newPath, (data) => {
      this.setState({
        extern: {
          ...this.state.extern,
          path: newPath,
          files: data,
          selected: []
        }
      });
    })
    this.dataSocket.set("path", newPath);
  }

  goBackExternFolder() {
    if (this.state.extern.path.split("/").length - 1 > 1) {
      let newPath = this.state.extern.path.replace(this.state.extern.path.split("/")[this.state.extern.path.split("/").length - 2] + "/", "");
      this.socket.updateExternFiles(newPath, (data) => {
        this.setState({
          extern: {
            ...this.state.extern,
            path: newPath,
            files: data
          }
        });
      })
      this.dataSocket.set("path", newPath);
    }
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
    } else if (this.state.keys.shift) {
      let files = this.state.extern.files;
      let iStart = files.findIndex(item => item === selected[selected.length - 1]) + 1;
      let iEnd = files.findIndex(item => item === file);
      for (
        let i = iStart < iEnd ? iStart : iStart - 1;
        iStart < iEnd ? i <= iEnd : i >= iEnd;
        iStart < iEnd ? i++ : i--
      ) {
        selected.push(files[i])
      }
    } else {
      if (selected[0] === file && selected.length === 1) {
        selected = [];
      } else {
        selected = [file];
      }
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

  handleShortcut(key) {
    if (this.state.keys.cmd) {
      switch (key) {
        case "n":
          if (this.state.keys.shift) {
            this.setState({
              extern: {
                ...this.state.extern,
                newFolder: true
              }
            })
          }
          break;
        case "r":
          this.updateExternFiles();
          break;
        default:
          break;
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
          ref={this.progress}
          onAbort={this.socket.stopUpload}
        />
        <ContextMenus
          ref={this.contextMenus}
          socket={this.socket}
          selected={this.state.extern.selected}
          onReload={this.updateExternFiles}
          onNewFolder={() => {
            this.setState({
              extern: {
                ...this.state.extern,
                newFolder: true
              }
            })
          }}
        />
        <Container>
          <Content>
            <System>
              <Space
                path={this.state.extern.path}
                onUpload={this.socket.uploadLocalFiles}
                onReturn={this.updateExternFiles}
                onProgress={(current, max, progress) => {
                  this.progress.current.updateProgress(current, max, progress);
                }}
                onContext={(event) => {
                  this.contextMenus.current.openForSpace(event, this.state.extern.path)
                }}
              />
              <Path>
                <GoBack onTrigger={this.goBackExternFolder} />
                <Url>{this.state.extern.path}</Url>
              </Path>
              <Files>
                {this.state.extern.newFolder &&
                  <NewFolder
                    path={this.state.extern.path}
                    onSubmit={this.socket.createExternFolder}
                    onClose={() => {
                      this.setState({
                        extern: {
                          ...this.state.extern,
                          newFolder: false
                        }
                      });
                      this.updateExternFiles();
                    }}
                  />
                }
                {Object.keys(this.state.extern.files).map((key, index) => {
                  const file = this.state.extern.files[key];
                  file.path = this.state.extern.path;

                  if (file.type === 1) {
                    return (
                      <Folder
                        key={index + file.name + file.time}
                        folder={file}
                        selected={this.state.extern.selected.includes(file)}
                        onEnter={this.enterExternFolder}
                        onUpload={this.socket.uploadLocalFiles}
                        onProgress={this.progress.current.updateProgress}
                        onContext={this.contextMenus.current.openForFolder}
                      />
                    )
                  } else {
                    return (
                      <File
                        key={index + file.name + file.time}
                        file={file}
                        selected={this.state.extern.selected.includes(file)}
                        onClick={() => {
                          this.selectExternFile(file)
                        }}
                        onContext={this.contextMenus.current.openForFile}
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
