import React, { Component, createRef } from "react";

import Container from "../../components/misc/Container";
import GoBack from "../../components/misc/GoBack";

import { Page, Content, System, Path, Url, Files } from "./styles";

import FTP from "./ftp";

import Folder from "./components/Folder";
import File from "./components/File";
import Space from "./components/Space";
import ContextMenus from "./components/ContextMenus";

class SessionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      local: {
        path: "/"
      },
      extern: {
        path: "/",
        files: {}
      }
    }

    this.ftp = new FTP(this.props.ftp);

    this.contextMenus = createRef();

    this.updateExternFiles = this.updateExternFiles.bind(this);
    this.enterExternFolder = this.enterExternFolder.bind(this);
    this.goBackExternFolder = this.goBackExternFolder.bind(this);
  }

  componentDidMount() {
    if (this.props.ftpStatus !== "offline") {
      let path = this.state.extern.path;
      if (window.localStorage.getItem(`extern_path-${this.props.ftpData.host}`) !== null) {
        path = window.localStorage.getItem(`extern_path-${this.props.ftpData.host}`);
        this.setState({
          extern: {
            ...this.state.extern,
            path: path
          }
        });
      }
      this.updateExternFiles(path);
    }
  }

  updateExternFiles(path) {
    this.ftp.updateExternFiles(path || this.state.extern.path, (data) => {
      this.setState({
        extern: {
          ...this.state.extern,
          files: data
        }
      });
    })
  }

  enterExternFolder(folder) {
    let newPath = this.state.extern.path + folder + "/";
    this.ftp.updateExternFiles(newPath, (data) => {
      this.setState({
        extern: {
          ...this.state.extern,
          path: newPath,
          files: data
        }
      });
    })
    window.localStorage.setItem(`extern_path-${this.props.ftpData.host}`, newPath);
  }

  goBackExternFolder() {
    if (this.state.extern.path.split("/").length - 1 > 1) {
      let newPath = this.state.extern.path.replace(this.state.extern.path.split("/")[this.state.extern.path.split("/").length - 2] + "/", "");
      this.ftp.updateExternFiles(newPath, (data) => {
        this.setState({
          extern: {
            ...this.state.extern,
            path: newPath,
            files: data
          }
        });
      })
      window.localStorage.setItem(`extern_path-${this.props.ftpData.host}`, newPath);
    }
  }

  render() {
    return (
      <Page>
        <ContextMenus ref={this.contextMenus} onReturn={this.updateExternFiles} ftp={this.ftp} />
        <Container>
          <Content>
            <System>
              <Space
                path={this.state.extern.path}
                onUpload={this.ftp.uploadLocalFiles}
                onReturn={this.updateExternFiles}
                onProgress={this.updateExternFiles}
                onContext={(event) => {
                  this.contextMenus.current.openForSpace(event, this.state.extern.path)
                }}
              />
              <Path>
                <GoBack onTrigger={this.goBackExternFolder} />
                <Url>{this.state.extern.path}</Url>
              </Path>
              <Files>
                {Object.keys(this.state.extern.files).map((key, index) => {
                  const file = this.state.extern.files[key];
                  file.path = this.state.extern.path;

                  if (file.type === 1) {
                    return (
                      <Folder
                        key={index}
                        folder={file}
                        onEnter={this.enterExternFolder}
                        onUpload={this.ftp.uploadLocalFiles}
                        onContext={this.contextMenus.current.openForFolder}
                      />
                    )
                  } else {
                    return (
                      <File
                        key={index}
                        file={file}
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
