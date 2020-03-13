export default class FTP {
  constructor(ftp) {
    this.ftp = ftp;
    this.fs = window.require("fs");
    this.path = window.require("path");
  }

  updateExternFiles = (path, callback) => {
    this.ftp.ls(path, (err, data) => {
      if (err) alert(err);
      else callback(data);
    })
  }

  createExternFolder = (path, folder, callback) => {
    this.ftp.raw("mkd", path + folder, (err) => {
      if (err) alert(err);
      else if (typeof callback === "function") callback();
    })
  }

  createExternFile = (path, file, callback) => {
    
  }

  downloadExternFile = (path, file, callback) => {
    let dlDir = window.require("downloads-folder");
    this.ftp.get(path + file, dlDir() + "/" + file, (err) => {
      if (err) alert(err);
      else if (typeof callback === "function") callback();
    })
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

    const uploadFile = (item, path) => {
      return new Promise((resolve, reject) => {
        let newPath = path.slice(0, -1);
        this.fs.readFile(rootPaths[0] + item.fullPath, (err, buffer) => {
          if (err) { alert(err); resolve(); }
          else {
            this.ftp.put(buffer, newPath + item.fullPath, (err) => {
              if (err) alert(err);
              else resolve();
            })
          }
        })
      })
    }

    const createDir = (item, path) => {
      return new Promise((resolve, reject) => {
        let newPath = path.slice(0, -1);
        this.ftp.raw("mkd", newPath + item.fullPath, (err) => {
          if (err) alert(err);
          else resolve();
        })
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
        items.forEach((item) => {
          if (item.isDirectory) {
            // if (typeof progress === "function") progress()
            p = p.then(() => createDir(item, path))
          } else if (item.isFile) {
            // if (typeof progress === "function") progress()
            p = p.then(() => uploadFile(item, path))
          }
        });
        return p;
      }
      runTasks().then(() => {
        console.log("uploaded all files")
        return typeof callback === "function" ? callback() : {};
      })
    })
  }

  deleteExternFile = (file, callback) => {
    this.ftp.raw("dele", file, (err) => {
      if (err) alert(err);
      else if (typeof callback === "function") callback();
    })
  }

  deleteExternFolder = (folder, callback) => {
    this.ftp.raw("rmd", folder, (err) => {
      if (err) alert(err);
      else if (typeof callback === "function") callback();
    })
  }

  deleteExternFolderRecursively = (folder, callback) => {
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
