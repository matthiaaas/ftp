import React, { Component } from "react";

import { ArrowLeft } from "react-feather";

import File from "./components/File";
import Folder from "./components/Folder";

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

    this.ftp = this.props.ftp;
    this.fs = window.require("fs");

    this.uploadLocalFilesToExternFolder = this.uploadLocalFilesToExternFolder.bind(this);
    this.enterExternFolder = this.enterExternFolder.bind(this);
    this.updateExternFiles = this.updateExternFiles.bind(this);
    this.goBackExternFolder = this.goBackExternFolder.bind(this);
  }

  componentDidMount() {
    // load extern files
    this.updateExternFiles();
  }

  updateExternFiles() {
    this.ftp.ls(this.state.extern.path, (err, data) => {
      if (err) {
        alert(err);
      }
      this.setState({
        extern: {
          ...this.state.extern,
          files: data
        }
      });
    });
  }

  enterExternFolder(folder) {
    this.setState({
      extern: {
        ...this.state.extern,
        path: this.state.extern.path + folder + "/"
      }
    });
    this.ftp.ls(this.state.extern.path + folder + "/", (err, data) => {
      if (err) {
        alert(err);
      }
      this.setState({
        extern: {
          ...this.state.extern,
          files: data
        }
      });
    });
  }

  goBackExternFolder() {
    if (this.state.extern.path.split("/").length - 1 > 1) {
      let newPath = this.state.extern.path.replace(this.state.extern.path.split("/")[this.state.extern.path.split("/").length - 2] + "/", "");
      this.setState({
        extern: {
          ...this.state.extern,
          path: newPath
        }
      });
      this.ftp.ls(newPath, (err, data) => {
        if (err) {
          alert(err);
        }
        this.setState({
          extern: {
            ...this.state.extern,
            files: data
          }
        });
      });
    }
  }

  uploadLocalFilesToExternFolder(files) {
    Object.keys(files).map((index) => {
      alert(files[index].path);
      this.fs.readFile(files[index].path, (err, buffer) => {
        if (err) {
          alert(err);
        } else {
          this.ftp.put(buffer, this.state.extern.path + files[index].name, (err) => {
            if (err) {
              alert(err);
            }
            alert("transferred successfully!")
          })
        }
      })
    });
  }

  render() {
    return (
      <main id="session">
        <div className="container">
          <div className="content">
            <div className="system local">
              <div className="path">
                <div className="back">
                  <ArrowLeft />
                </div>
                <span className="url">{this.state.local.path}</span>
              </div>
              <div className="files">
                <Folder onUpload={this.uploadFilesToFolder} folderName="assets" />
                <File fileName="index.html" fileSize="10KB" />
                <File fileName="robots.txt" fileSize="3KB" />
                <File fileName="prototype.xd" fileSize="1.06MB" />
                <File fileName="style.scss" fileSize="34KB" />
                <File fileName="logo.png" fileSize="0.62MB" />
              </div>
            </div>
            <div className="system extern">
              <div className="path">
                <div className="back" onClick={this.goBackExternFolder}>
                  <ArrowLeft />
                </div>
                <span className="url">{this.state.extern.path}</span>
              </div>
              <div className="files">
                {
                  Object.keys(this.state.extern.files).map((key, index) => {
                    const file = this.state.extern.files[key];

                    if (file.type === 1) {
                      return (
                        <Folder key={index} folderName={file.name} onUpload={this.uploadLocalFilesToExternFolder} onEnter={this.enterExternFolder} />
                      );
                    } else {
                      return (
                        <File key={index} fileName={file.name} fileSize={file.size + "B"} />
                      );
                    }
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default SessionPage;
