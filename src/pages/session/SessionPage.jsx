import React, { Component, createRef } from "react";

import { ArrowLeft } from "react-feather";

import File from "./components/File";
import Folder from "./components/Folder";

import ContextMenu, { ContextMenuItem } from "./components/ContextMenu";

import { toAccurateFileSize, getExactFileType } from "../../assets/utils/utils.js";
import Popup from "./components/Popup";

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
      },
      popups: {
        createFolder: {
          isOpen: false
        }
      }
    }

    this.ftp = this.props.ftp;
    this.fs = window.require("fs");

    this.uploadLocalFilesToExternFolder = this.uploadLocalFilesToExternFolder.bind(this);
    this.enterExternFolder = this.enterExternFolder.bind(this);
    this.updateExternFiles = this.updateExternFiles.bind(this);
    this.deleteExternFile = this.deleteExternFile.bind(this);
    this.deleteExternFolder = this.deleteExternFolder.bind(this);
    this.deleteExternFolderRecursively = this.deleteExternFolderRecursively.bind(this);
    this.createExternFolder = this.createExternFolder.bind(this);
    this.openCreateFolderPopup = this.openCreateFolderPopup.bind(this);
    this.closeCreateFolderPopup = this.closeCreateFolderPopup.bind(this);
    this.goBackExternFolder = this.goBackExternFolder.bind(this);

    this.openSpaceContextMenu = this.openSpaceContextMenu.bind(this);
    this.closeSpaceContextMenu = this.closeSpaceContextMenu.bind(this);
    this.openFolderContextMenu = this.openFolderContextMenu.bind(this);
    this.closeFolderContextMenu = this.closeFolderContextMenu.bind(this);
    this.openFileContextMenu = this.openFileContextMenu.bind(this);
    this.closeFileContextMenu = this.closeFileContextMenu.bind(this);

    this.spaceContextMenu = createRef();
    this.folderContextMenu = createRef();
    this.fileContextMenu = createRef();

    this.createFolderPopupInput = createRef();
  }

  componentDidMount() {
    if (this.props.ftpStatus !== "offline") {
      this.updateExternFiles();
    }

    this.spaceContextMenu.current.classList.add("hidden");
    this.folderContextMenu.current.classList.add("hidden");
    this.fileContextMenu.current.classList.add("hidden");
  }

  /* FILE INTERACTION */

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
  }

  deleteExternFile(file) {
    if (file === undefined) {
      file = this.state.contextMenu.focus
    }
    this.ftp.raw("dele", this.state.extern.path + file, (err) => {
      if (err) {
        return alert(err);
      }
      this.updateExternFiles();
    });
    if (this.state.contextMenu.isOpen) {
      this.closeFileContextMenu();
    }
  }

  deleteExternFolder(folder) {
    if (folder === undefined) {
      folder = this.state.extern.path + this.state.contextMenu.focus
    }
    this.ftp.raw("rmd", folder + "/", (err) => {
      if (err) {
        alert(err);
      }
      this.updateExternFiles();
    });
    if (this.state.contextMenu.isOpen) {
      this.closeFolderContextMenu();
      this.closeSpaceContextMenu();
    }
  }

  deleteExternFolderRecursively(folder) {
    if (folder === undefined) {
      folder = this.state.contextMenu.focus
    }
    const path = window.require("path");
    folder = this.state.extern.path + folder;
    console.log("folder is " + folder);
    const list = (dir) => {
      return new Promise((resolve, reject) => {
        this.ftp.ls(dir, (err, files) => {
          if (err) { alert(err); return; }
          resolve(files);
        });
      });
    }
    const walk = (dir) => {
      return list(dir).then((files) => {
        if (files.length === 0) {
          return Promise.resolve();
        }
        return Promise.all(files.map((file) => {
          file.filepath = path.join(dir, file.name);
          let promises = [];
          if (file.type === 1) {
            promises.push(walk(path.join(dir, file.name)));
          }
          promises.push(Promise.resolve(file));
          return Promise.all(promises);
        }));
      });
    }
    const deleteDir = (dir) => {
      return new Promise((resolve, reject) => {
        this.ftp.raw("rmd", dir.filepath, (err, result) => {
          if (err) { alert(err); return; }
          return resolve(result);
        });
      });
    }
    const deleteFile = (file) => {
      return new Promise((resolve, reject) => {
        this.ftp.raw("dele", file.filepath, (err, result) => {
          if (err) { alert(err); return; }
          return resolve(result);
        });
      });
    }
    const flatten = list => list.reduce(
      (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
    );
    walk(folder).then((results) => {
      let deletions;
      try {
        let files = flatten(results).filter(Boolean);
        console.log("Trying to delete ", files.map((file) => file.filepath))
        deletions = files.map((file) => {
          if (file.type === 1) {
            return deleteDir(file);
          } else {
            return deleteFile(file);
          }
        });
      } catch {}
      this.deleteExternFolder(folder);
      return deletions !== undefined ? Promise.all(deletions) : {};
    });
  }

  createExternFile(file) {
    console.log(new Buffer(""))
    if (file === undefined) {
      file = this.state.contextMenu.focus;
    }
    this.ftp.put("", this.state.extern.path + file, (err) => {
      if (err) {
        alert(err);
      }
      alert("put file to")
    });
  }

  createExternFolder(folder) {
    if (folder === undefined) {
      folder = this.createFolderPopupInput.current.value;
      this.closeCreateFolderPopup();
    }
    if (folder === "" || folder === undefined) {
      return;
    }
    this.ftp.raw("mkd", this.state.extern.path + folder, (err) => {
      if (err) {
        return alert(err);
      }
      this.updateExternFiles();
    });
  }

  /* POPUPS */

  openCreateFolderPopup() {
    this.closeFolderContextMenu();
    this.closeFileContextMenu();
    this.closeSpaceContextMenu();

    this.setState({
      popups: {
        ...this.state.popups,
        createFolder: {
          ...this.state.popups.createFolder,
          isOpen: true
        }
      }
    })
  }

  closeCreateFolderPopup() {
    this.setState({
      popups: {
        ...this.state.popups,
        createFolder: {
          ...this.state.popups.createFolder,
          isOpen: false
        }
      }
    })
  }

  /* CONTEXT MENUS */

  openSpaceContextMenu(event) {
    this.setState({
      disabled: true,
      contextMenu: {
        ...this.state.contextMenu,
        isOpen: true,
        focus: this.state.extern.path.split("/")[this.state.extern.path.split("/").length - 1]
      }
    });
    this.spaceContextMenu.current.classList.remove("hidden");
    this.spaceContextMenu.current.style.top = event.pageY - this.spaceContextMenu.current.offsetHeight + "px";
    this.spaceContextMenu.current.style.left = event.pageX + "px";

    if (this.spaceContextMenu.current.offsetHeight + parseInt(this.spaceContextMenu.current.style.top.replace("px", "")) > window.innerHeight) {
      this.spaceContextMenu.current.style.top = window.innerHeight - this.spaceContextMenu.current.offsetHeight - 20 + "px";
    }
  }

  closeSpaceContextMenu() {
    this.setState({
      disabled: false,
      contextMenu: {
        ...this.state.contextMenu,
        isOpen: false
      }
    });
    this.spaceContextMenu.current.classList.add("hidden");
  }

  openFolderContextMenu(event, folder) {
    this.setState({
      disabled: true,
      contextMenu: {
        ...this.state.contextMenu,
        isOpen: true,
        focus: folder
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
        isOpen: true,
        focus: file
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
            this.closeSpaceContextMenu();
          }}} style={{"display": this.state.disabled ? "block" : "none"}}></div>

        {/* CONTEXT MENUS */}

        <ContextMenu cref={this.spaceContextMenu}>
          <ContextMenuItem name="New Folder" shortcut="⌘⇧N" onExecute={this.openCreateFolderPopup} />
          <ContextMenuItem name="New File" shortcut="⌘⇧F" disabled />
        </ContextMenu>

        <ContextMenu cref={this.folderContextMenu}>
          <ContextMenuItem name="Info" shortcut="⌘I" disabled />
          <hr/>
          <ContextMenuItem name="Copy" shortcut="⌘C" disabled />
          <ContextMenuItem name="Paste" shortcut="⌘V" disabled />
          <ContextMenuItem name="Duplicate" shortcut="⌘J" disabled />
          <hr/>
          <ContextMenuItem name="Download" shortcut="⌘D" disabled />
          <hr/>
          <ContextMenuItem name="Delete" shortcut="⌘⌫" onExecute={this.deleteExternFolderRecursively} />
          <hr/>
          <ContextMenuItem name="New Folder" shortcut="⌘⇧N" onExecute={this.openCreateFolderPopup} />
          <ContextMenuItem name="New File" shortcut="⌘⇧F" disabled />
        </ContextMenu>

        <ContextMenu cref={this.fileContextMenu}>
          <ContextMenuItem name="Open" shortcut="⌘O" disabled />
          <ContextMenuItem name="Info" shortcut="⌘I" disabled />
          <hr/>
          <ContextMenuItem name="Copy" shortcut="⌘C" disabled />
          <ContextMenuItem name="Paste" shortcut="⌘V" disabled />
          <ContextMenuItem name="Duplicate" shortcut="⌘J" disabled />
          <hr/>
          <ContextMenuItem name="Download" shortcut="⌘D" disabled />
          <hr/>
          <ContextMenuItem name="Delete" shortcut="⌘⌫" onExecute={this.deleteExternFile} />
          <hr/>
          <ContextMenuItem name="New Folder" shortcut="⌘⇧N" onExecute={this.openCreateFolderPopup} />
          <ContextMenuItem name="New File" shortcut="⌘⇧F" disabled />
        </ContextMenu>

        {/* POPUPS */}

        <Popup name="create-folder"
          title="New folder"
          hidden={!this.state.popups.createFolder.isOpen}
          onClose={this.closeCreateFolderPopup}
          onEnter={this.createExternFolder}
        >
          <input ref={this.createFolderPopupInput} placeholder="Name" type="text" />
        </Popup>

        <div className="container">
          <div className="content">
            <div className="system extern" onDragEnter={(event) => {
              event.preventDefault();
              event.target.classList.add("dropping");
            }} onDragLeave={(event) => {
              event.target.classList.remove("dropping");
            }}>
              <div className="space" onContextMenu={(event) => {
                event.preventDefault();
                this.openSpaceContextMenu(event);
              }} >

              </div>
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
                          folderSize={Math.round(toAccurateFileSize(file.size).size * 10) / 10 + " " + toAccurateFileSize(file.size).unit}
                          folderTimestamp={file.time}
                          onUpload={this.uploadLocalFilesToExternFolder}
                          onEnter={this.enterExternFolder}
                          onContext={this.openFolderContextMenu}
                        />
                      );
                    } else {
                      return (
                        <File key={index}
                          fileName={file.name}
                          fileSize={Math.round(toAccurateFileSize(file.size).size * 10) / 10 + " " + toAccurateFileSize(file.size).unit}
                          fileType={getExactFileType(file.name)}
                          fileTimestamp={file.time}
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
