import { getPlatformStartCmd } from "../../assets/utils/utils";

export default class FTP {
  constructor(ftp) {
    this.ftp = ftp;
    this.fs = window.require("fs");
    this.path = window.require("path");
    this.tmp = window.require("tmp");
    this.exec = window.require("child_process").exec;
    this.spawn = window.require("child_process").spawn;
  }

  updateExternFiles = (path, callback) => {
    this.ftp.ls(path, (err, data) => {
      if (err) alert(err);
      else callback(data);
    })
  }

  openExternFile = (file, callback) => {
    if (this.ftp.sftp) {
      file.extension = "." + file.name.split(".")[file.name.split(".").length - 1];
      let tmpfile = this.tmp.fileSync({
        prefix: file.name + "-",
        postfix: file.extension
      });
      console.debug("downloading file as temporary file for editing...")
      this.downloadExternFile(file, tmpfile.name, () => {
        console.debug("opening file from temp directory...")
        this.spawn(getPlatformStartCmd(), [tmpfile.name]);
        let oldTime = this.fs.statSync(tmpfile.name).mtimeMs;
        console.debug("listening for changes to " + tmpfile.name + "...")
        const checkForChanges = () => {
          let newTime = this.fs.statSync(tmpfile.name).mtimeMs;
          if (newTime > oldTime) {
            oldTime = newTime;
            callback(tmpfile, file.path + file.name);
          }
          setTimeout(checkForChanges, 3000);
        }
        checkForChanges();
      })
    } else {
      alert("Unfortunately this feature isn't implemented for ftp connections", false);
    }
  }

  createExternFolder = (path, folder, callback) => {
    if (this.ftp.sftp) {
      this.ftp.mkd(path + folder, (err) => {
        if (err) alert(err);
        else if (typeof callback === "function") callback();
      })
    } else {
      this.ftp.raw("mkd", path + folder, (err) => {
        if (err) alert(err);
        else if (typeof callback === "function") callback();
      })
    }
  }

  createExternFile = (path, name, callback) => {
    if (this.ftp.sftp) {
      this.ftp.raw(`touch "${path + name}"`, (err) => {
        if (err) alert(err);
        else if (typeof callback === "function") callback();
      })
    } else {
      alert("Unfortunately this feature isn't implemented for ftp connections", false);
    }
  }

  renameExternFile = (file, newName, callback) => {
    this.ftp.rename(file.path + file.name, file.path + newName, (err) => {
      if (err) alert(err);
      else if (typeof callback === "function") callback();
    })
  }

  downloadExternFile = (file, to, callback) => {
    let dlDir = window.require("downloads-folder");
    let destination = to || dlDir() + "/" + file.name
    this.ftp.get(file.path + file.name, destination, (err) => {
      if (err) alert(err);
      else if (typeof callback === "function") callback();
    })
  }

  stopUpload = () => {
    if (this.ftp.sftp) {
      alert("Cannot stop for sftp connection")
    } else {
      this.ftp.raw("abor", (err) => {
        if (err) alert(err);
        else console.debug("upload stopped")
      })
    }
  }

  uploadLocalFile = (file, path, callback) => {
    if (this.ftp.sftp) {
      console.debug("uploading", file.name, "...")
      this.ftp.put(file.name, path, (err) => {
        if (err) { console.error(err) }
        else callback();
      })
    } else {
      return alert("Not supported")
    }
  }

  uploadLocalFiles = (transfer, path, callback, progress) => {
    let items = transfer.items;
    let files = transfer.files;

    let rootPaths = []

    for (let i = 0; i < items.length; i++) {
      rootPaths.push(this.path.dirname(files[i].path))
    }
    if (!rootPaths.some((val) => val === rootPaths[0])) {
      alert("Uploading files and folder from different root directories is currently not supported. Please move all files and folders in the same root folder e.g. on your Desktop")
      return callback();
    }

    const uploadFile = (item, path, prog) => {
      return new Promise((resolve, reject) => {
        let newPath = path.slice(0, -1);
        if (this.ftp.sftp) {
          console.debug("uploading", item.fullPath)
          this.ftp.put(rootPaths[0] + item.fullPath, newPath + item.fullPath, (err) => {
            if (err) {console.error(err)}
            else resolve();
          }, (transferred, total) => {
            progress(prog.index, prog.max, transferred / total)
          })
        } else {
          if (typeof progress === "function") progress(prog.index, prog.max);
          console.debug("reading", item.fullPath)
          this.fs.readFile(rootPaths[0] + item.fullPath, (err, buffer) => {
            if (err) {
              console.log(err);
              resolve();
            }
            else {
              console.debug("uploading", item.fullPath)
              this.ftp.put(buffer, newPath + item.fullPath, (err) => {
                if (err) {
                  console.error(err);
                }
                else resolve();
              })
            }
          })
        }
      })
    }

    const createDir = (item, path, prog) => {
      return new Promise((resolve, reject) => {
        let newPath = path.slice(0, -1);
        console.debug("creating", item.fullPath)
        if (this.ftp.sftp) {
          this.ftp.mkd(newPath + item.fullPath, (err) => {
            if (err) console.error(err);
            else resolve();
          })
        } else {
          if (typeof progress === "function") progress(prog.index, prog.max);
          this.ftp.raw("mkd", newPath + item.fullPath, (err) => {
            if (err) alert(err);
            else resolve();
          })
        }
        
      })
    }

    const traverse = (item) => {
      return new Promise((resolve, reject) => {
        try {
          let reader = item.createReader();
          reader.readEntries((entries) => {
            resolve(entries)
          })
        } catch {
          resolve(item);
        }
      })
    }

    const walk = (items) => {
      return traverse(items).then((items) => {
        if (items.length === 0) return Promise.resolve();
        return Promise.all(Object.keys(items).map((i) => {
          let item;
          try {
            item = items[i].webkitGetAsEntry();
          } catch {
            item = items[i];
          }
          let promises = [];
          if (item.isDirectory) {
            promises.push(walk(item));
          }
          promises.push(Promise.resolve(item));
          return Promise.all(promises);
        }))
      })
    }

    const flatten = list => list.reduce(
      (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
    );

    walk(items).then((results) => {
      let items = flatten(results).filter(Boolean);
      items = items.sort((a, b) => {
        return (a.fullPath.split("/").length - 1) > (b.fullPath.split("/").length - 1) ? 1 : -1
      })
      items = items.sort((a, b) => {
        return b.isDirectory - a.isDirectory;
      })

      let runTasks = () => {
        let p = Promise.resolve()
        let max = items.length;
        items.forEach((item, index) => {
          if (item.isDirectory) {
            p = p.then(() => createDir(item, path, {index: index, max: max}))
          } else if (item.isFile) {
            p = p.then(() => uploadFile(item, path, {index: index, max: max}))
          }
        });
        return p;
      }
      runTasks().then(() => {
        console.log("uploaded all files")
        if (typeof progress === "function") progress(items.length, items.length);
        return typeof callback === "function" ? callback() : {};
      })
    })
  }

  deleteExternFile = (file, callback) => {
    if (this.ftp.sftp) {
      this.ftp.rm(file.path + file.name, (err) => {
        if (err) alert(err);
        else if (typeof callback === "function") callback();
      })
    } else {
      this.ftp.raw("dele", file.path + file.name, (err) => {
        if (err) alert(err);
        else if (typeof callback === "function") callback();
      })
    }
  }

  deleteExternFolder = (folder, callback) => {
    if (this.ftp.sftp) {
      this.ftp.rmd(folder.path + folder.name, (err) => {
        if (err) alert(err);
        callback();
      })
    } else {
      this.ftp.raw("rmd", folder.path + folder.name, (err) => {
        if (err) alert(err);
        else if (typeof callback === "function") callback();
      })
    }
  }

  deleteExternFolderRecursively = (folder, callback) => {
    if (this.ftp.sftp) {
      this.ftp.raw(`rm "${folder.path + folder.name}" -r`, (err, data, finished) => {
        if (err) alert(err);
        callback();
      }) 
    } else {
      const path = window.require("path");
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
          if (this.ftp.sftp) {
            this.ftp.rmd(dir.filePath, (err) => {
              if (err) { alert(err); return; }
              return resolve();
            })
          } else {
            this.ftp.raw("rmd", dir.filepath, (err, result) => {
              if (err) { alert(err); return; }
              return resolve(result);
            });
          }
        });
      }
      const deleteFile = (file) => {
        return new Promise((resolve, reject) => {
          if (this.ftp.sftp) {
            this.ftp.rm(file.filepath, (err) => {
              if (err) { alert(err); return; }
              return resolve();
            })
          } else {
            this.ftp.raw("dele", file.filepath, (err, result) => {
              if (err) { alert(err); return; }
              return resolve(result);
            });
          }
        });
      }
      const flatten = list => list.reduce(
        (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
      );
      walk(folder.path + folder.name).then((results) => {
        let deletions;
        try {
          let files = flatten(results).filter(Boolean);
          deletions = files.map((file) => {
            if (file.type === 1) {
              return deleteDir(file);
            } else {
              return deleteFile(file);
            }
          });
        } catch {}
        this.deleteExternFolder(folder, () => {
          return callback();
        });
        if (deletions !== undefined) Promise.all(deletions);
      });
    }
  }
}
