import { getPlatformStartCmd } from "../../assets/utils/utils";

export default class FTP {
  constructor(ftp) {
    this.ftp = ftp;
    this.fs = window.require("fs");
    this.path = window.require("path");
    this.tmp = window.require("tmp");
    this.dlDir = window.require("downloads-folder");
    this.exec = window.require("child_process").exec;
    this.spawn = window.require("child_process").spawn;
  }

  updateExternFiles = (path, callback) => {
    this.ftp.ls(path, (err, data) => {
      if (err) alert(err);
      callback(data);
    })
  }

  openExternFile = (file, callback) => {
    file.extension = "." + file.name.split(".")[file.name.split(".").length - 1];
    let tmpfile = this.tmp.fileSync({
      prefix: file.name + "-",
      postfix: file.extension
    });
    if (file.size > 10 ** 6) {
      alert("You're opening a file > 1 MB. Downloading might take a while.", false)
    }
    console.debug("downloading file as temporary file for editing...")
    this.downloadExternFile(file, tmpfile.name, () => {
      console.debug("opening file from temp directory...")
      let start = this.spawn(getPlatformStartCmd(), [tmpfile.name]);
      start.stderr.on("data", () => {
        console.debug("no default app found: opening in default text editor instead...")
        start = this.spawn(getPlatformStartCmd(), [tmpfile.name, "-t"]);
      })
      let oldTime = this.fs.statSync(tmpfile.name).mtimeMs;
      console.debug("listening for changes to " + tmpfile.name + "...")
      const checkForChanges = () => {
        let newTime = this.fs.statSync(tmpfile.name).mtimeMs;
        if (newTime > oldTime) {
          console.debug("there had been changes to", tmpfile.name);
          oldTime = newTime;
          this.uploadLocalFile(tmpfile, file.path + file.name, (err) => {
            if (err) alert(err);
            else {
              console.debug("applied changes to remote", file.name);
              callback();
            }
          })
          callback(tmpfile, file.path + file.name);
        }
        setTimeout(checkForChanges, 3000);
      }
      checkForChanges();
    })
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
      this.ftp.put(window.Buffer.from("", "utf-8"), path + name, (err) => {
        if (err) alert(err);
        else if (typeof callback === "function") callback();
      })
    }
  }

  renameExternFile = (file, newName, callback) => {
    this.ftp.rename(file.path + file.name, file.path + newName, (err) => {
      if (err) alert(err);
      else if (typeof callback === "function") callback();
    })
  }

  moveExternFiles = (files, to, callback) => {
    const move = (file) => {
      console.debug("moving", file.name);
      return new Promise((resolve, reject) => {
        this.ftp.rename(file.path + file.name, to + file.name, (err) => {
          if (err) alert(err);
          else resolve();
        })
      })
    }

    let runTasks = () => {
      let p = Promise.resolve()
      files.forEach((file, index) => {
        p = p.then(() => move(file))
      });
      return p;
    }
    runTasks().then(() => {
      console.log("moved all files")
      return typeof callback === "function" ? callback() : {};
    })
  }

  downloadExternFile = (file, to, callback) => {
    let destination = to || this.dlDir() + "/" + file.name;
    if (this.ftp.sftp) {
      this.ftp.get(file.path + file.name, destination, (err) => {
        if (err) alert(err);
        else if (typeof callback === "function") callback();
      })
    } else {
      let content = "";
      this.ftp.get(file.path + file.name, (err, socket) => {
        if (err) alert(err);
        socket.on("data", (data) => {
          content += data.toString();
        })
        socket.on("close", (err) => {
          if (err) alert(err);
          this.fs.writeFile(destination, content, (err) => {
            if (err) alert(err);
            else if (typeof callback === "function") callback();
          })
        })
        socket.resume();
      })
    }
  }

  downloadExternFiles = (files, to, callback, progress) => {
    let destination = to || this.dlDir() + "/";

    const getBasePath = () => {
      let i = files.findIndex(file => file.type === 0);
      return files[i < 0 ? 0 : i].path
    }

    let basePath = getBasePath();

    const downloadFile = (file, to, prog) => {
      console.debug("downloading", file.name)
      to = to + file.name;
      return new Promise((resolve, reject) => {
        if (this.ftp.sftp) {
          this.ftp.get(file.path + file.name, to, (err) => {
            if (err) alert(err);
            else resolve();
          }, (transferred, total) => {
            progress(prog.index, prog.max, transferred / total)
          })
        } else {
          progress(prog.index, prog.max);
          let content = "";
          console.debug("reading", file.name)
          this.ftp.get(file.path + file.name, (err, socket) => {
            if (err) alert(err);
            if (socket) {
              socket.on("data", (data) => {
                content += data.toString();
              })
              socket.on("close", (err) => {
                if (err) alert(err);
                console.debug("downloading", file.name)
                this.fs.writeFile(to, content, (err) => {
                  if (err) alert(err);
                  else resolve();
                })
              })
              socket.resume();
            }
          })
        }
      })
    }

    const createDir = (file, to, prog) => {
      console.debug("creating")
      to = to + file.path.replace(basePath, "") + file.name;
      return new Promise((resolve, reject) => {
        !this.fs.existsSync(to) && this.fs.mkdirSync(to);
        resolve()
      })
    }

    let runTasks = () => {
      let p = Promise.resolve()
      let max = files.length;
      files.forEach((file, index) => {
        if (file.type === 0) {
          p = p.then(() => downloadFile(file, destination, {index: index, max: max}));
        // } else if (file.type === 1) {
        //   p = p.then(() => createDir(file, destination, {index: index, max: max}))
        }
      });
      return p;
    }

    runTasks().then(() => {
      console.log("downloaded all files")
      alert("Downloaded all files to your downloads folder", false)
      progress(files.length, files.length);
      callback();
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
      console.debug("uploading", file.name, "...");
      this.ftp.put(file.name, path, (err) => {
        if (err) { alert(err)}
        else callback();
      })
    } else {
      this.fs.readFile(file.name, (err, buffer) => {
        if (err) alert(err);
        else {
          console.debug("uploading", file.name, "...");
          this.ftp.put(buffer, path, (err) => {
            if (err) alert(err);
            else callback();
          })
        }
      })
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
            if (err) { console.error(err) }
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

  deleteExternFiles = (files, callback) => {
    const _delete = (obj) => {
      return new Promise((resolve, reject) => {
        if (obj.type === 0) {
          this.deleteExternFile(obj, () => {
            callback();
            return resolve();
          });
        } else if (obj.type === 1) {
          this.deleteExternFolderRecursively(obj, () => {
            callback();
            return resolve();
          });
        }
      })
    }
    let deletions = files.map((obj) => {
      return _delete(obj);
    })
    Promise.all(deletions);
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
