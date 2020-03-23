import React, { Component, createRef } from "react";

import Container from "../../components/misc/Container";
import { GoBack } from "../../components/misc/CircleButton";

import Data from "../../components/data";

import { Page, Content, System, Path, Url, Files } from "./styles";

import FTP from "./ftp";

import Folder from "./components/Folder";
import File from "./components/File";
import Space from "./components/Space";
import ContextMenus from "./components/ContextMenus";
import NewFolder from "./components/NewFolder";
import Upload from "./components/Upload";

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
        selecting: false,
        loading: true,
        newFolder: false
      }
    }

    this.socket = new FTP(this.props.socket);
    this.dataSocket = new Data(this.props.socketData.host);

    this.upload = createRef();
    this.contextMenus = createRef();

    this.updateExternFiles = this.updateExternFiles.bind(this);
    this.enterExternFolder = this.enterExternFolder.bind(this);
    this.goBackExternFolder = this.goBackExternFolder.bind(this);
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
          files: data
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

  render() {
    return (
      <Page>
        <Upload
          ref={this.upload}
          onAbort={this.socket.stopUpload}
        />
        <ContextMenus
          ref={this.contextMenus}
          socket={this.socket}
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
                onProgress={(current, max) => {
                  this.upload.current.updateProgress(current, max);
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
                        onEnter={this.enterExternFolder}
                        onUpload={this.socket.uploadLocalFiles}
                        onProgress={(current, max) => {
                          this.upload.current.updateProgress(current, max);
                        }}
                        onContext={this.contextMenus.current.openForFolder}
                      />
                    )
                  } else {
                    return (
                      <File
                        key={index + file.name + file.time}
                        file={file}
                        onSelect={(event, file) => {
                          let selected = this.state.extern.selected;
                          selected.push(file)
                          this.setState({
                            extern: {
                              ...this.state.extern,
                              selecting: true,
                              selected: selected
                            }
                          })
                        }}
                        onDeselect={(event, file) => {
                          let selected = this.state.extern.selected;
                          let found = selected.findIndex(item => item.name === file.name);
                          selected.splice(found, 1);
                          this.setState({
                            extern: {
                              ...this.state.extern,
                              selecting: !selected.length === 0,
                              selected: selected
                            }
                          })
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
