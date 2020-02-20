import React, { Component, createRef } from "react";

import { ArrowLeft } from "react-feather";

import File from "./components/File";
import Folder from "./components/Folder";

import { toAccurateFileSize } from "../../assets/utils/utils.js";
import ContextMenu, { ContextMenuItem } from "./components/ContextMenu";

class SessionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      contextMenu: {
        isOpen: false
      },
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

    this.openFolderContextMenu = this.openFolderContextMenu.bind(this);
    this.closeFolderContextMenu = this.closeFolderContextMenu.bind(this);
    this.openFileContextMenu = this.openFileContextMenu.bind(this);
    this.closeFileContextMenu = this.closeFileContextMenu.bind(this);

    this.folderContextMenu = createRef();
    this.fileContextMenu = createRef();
  }

  componentDidMount() {
    // load extern files
    this.updateExternFiles();

    this.folderContextMenu.current.classList.add("hidden");
    this.fileContextMenu.current.classList.add("hidden");
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

  uploadLocalFileToExternFolder(file, folder, callback) {
    this.fs.readFile(file.path, (err, buffer) => {
      if (err) {
        alert(err);
        callback();
      } else {
        this.ftp.put(buffer, folder + file.name, (err) => {
          if (err) {
            alert(err);
            callback();
          }
          callback();
        })
      }
    });
  }

  uploadLocalFilesToExternFolder(files, toFolder) {
    let index = 0;

    let loopFiles = (files) => {
      this.uploadLocalFileToExternFolder(files[index], this.state.extern.path + toFolder + "/", () => {
        index++;
        if (index < Object.keys(files).length) {
          loopFiles(files);
        }
      });
    }

    loopFiles(files);

    // Object.keys(files).map((index) => {
    //   alert(index);
    //   this.uploadLocalFileToExternFolder(files[index], this.state.extern.path + toFolder + "/");
    //   this.fs.readFile(files[index].path, (err, buffer) => {
    //     if (err) {
    //       alert(err);
    //     } else {
    //       alert(this.state.extern.path + toFolder + "/" + files[index].name)
    //       this.ftp.put(buffer, this.state.extern.path + toFolder + "/" + files[index].name, (err) => {
    //         if (err) {
              
    //         }
    //         alert("transferred successfully!")
    //       })
    //     }
    //   })
    // });
  }

  openFolderContextMenu(event, folder) {
    this.setState({
      disabled: true,
      contextMenu: {
        ...this.state.contextMenu,
        isOpen: true
      }
    });
    this.folderContextMenu.current.classList.remove("hidden");
    this.folderContextMenu.current.style.top = event.pageY - this.folderContextMenu.current.offsetHeight / 1.5 + "px";
    this.folderContextMenu.current.style.left = event.pageX + "px";

    if (this.folderContextMenu.current.offsetHeight + parseInt(this.folderContextMenu.current.style.top.replace("px", "")) > window.innerHeight) {
      this.folderContextMenu.current.style.top = window.innerHeight - this.folderContextMenu.current.offsetHeight - 20 + "px";
    }
  }

  closeFolderContextMenu() {
    this.setState({
      disabled: false,
      contextMenu: {
        ...this.state.contextMenu,
        isOpen: false
      }
    });
    this.folderContextMenu.current.classList.add("hidden");
  }

  openFileContextMenu(event, file) {
    this.setState({
      disabled: true,
      contextMenu: {
        ...this.state.contextMenu,
        isOpen: true
      }
    });
    this.fileContextMenu.current.classList.remove("hidden");
    this.fileContextMenu.current.style.top = event.pageY - this.fileContextMenu.current.offsetHeight / 1.5 + "px";
    this.fileContextMenu.current.style.left = event.pageX + "px";

    if (this.folderContextMenu.current.offsetHeight + parseInt(this.fileContextMenu.current.style.top.replace("px", "")) > window.innerHeight) {
      this.fileContextMenu.current.style.top = window.innerHeight - this.fileContextMenu.current.offsetHeight - 20 + "px";
    }
  }

  closeFileContextMenu() {
    this.setState({
      disabled: false,
      contextMenu: {
        ...this.state.contextMenu,
        isOpen: false
      }
    });
    this.fileContextMenu.current.classList.add("hidden");
  }

  render() {
    return (
      <main id="session">
        <div className="disable" onClick={(event) => {
          if (this.state.contextMenu.isOpen) {
            this.closeFolderContextMenu();
            this.closeFileContextMenu();
          }}} style={{"display": this.state.disabled ? "block" : "none"}}></div>

        <ContextMenu cref={this.folderContextMenu}>
          <ContextMenuItem name="Info" shortcut="⌘I" />
          <hr/>
          <ContextMenuItem name="Copy" shortcut="⌘C" />
          <ContextMenuItem name="Paste" shortcut="⌘V" />
          <ContextMenuItem name="Duplicate" shortcut="⌘J" />
          <hr/>
          <ContextMenuItem name="Download" shortcut="⌘D" />
          <hr/>
          <ContextMenuItem name="Delete" shortcut="⌘⌫" />
          <hr/>
          <ContextMenuItem name="New Folder" shortcut="⌘⇧N" />
          <ContextMenuItem name="New File" shortcut="⌘⇧F" />
        </ContextMenu>

        <ContextMenu cref={this.fileContextMenu}>
          <ContextMenuItem name="Open" shortcut="⌘O" />
          <ContextMenuItem name="Info" shortcut="⌘I" />
          <hr/>
          <ContextMenuItem name="Copy" shortcut="⌘C" />
          <ContextMenuItem name="Paste" shortcut="⌘V" />
          <ContextMenuItem name="Duplicate" shortcut="⌘J" />
          <hr/>
          <ContextMenuItem name="Download" shortcut="⌘D" />
          <hr/>
          <ContextMenuItem name="Delete" shortcut="⌘⌫" />
          <hr/>
          <ContextMenuItem name="New Folder" shortcut="⌘⇧N" />
          <ContextMenuItem name="New File" shortcut="⌘⇧F" />
        </ContextMenu>

        <div className="container">
          <div className="content">
            {/* <div className="system local">
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
            </div> */}
            <div className="system extern" onDragEnter={(event) => {
              event.preventDefault();
              event.target.classList.add("dropping");
            }} onDragLeave={(event) => {
              event.target.classList.remove("dropping");
            }}>
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
                        <Folder key={index}
                          folderName={file.name}
                          folderSize={Math.round(toAccurateFileSize(file.size).size * 10) / 10 + toAccurateFileSize(file.size).unit}
                          onUpload={this.uploadLocalFilesToExternFolder}
                          onEnter={this.enterExternFolder}
                          onContext={this.openFolderContextMenu}
                        />
                      );
                    } else {
                      return (
                        <File key={index}
                          fileName={file.name}
                          fileSize={Math.round(toAccurateFileSize(file.size).size * 10) / 10 + toAccurateFileSize(file.size).unit}
                          onContext={this.openFileContextMenu}
                        />
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
