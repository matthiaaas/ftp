export default class FTP {
  constructor(ftp) {
    this.ftp = ftp;
    this.fs = window.require("fs");
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
      else callback();
    })
  }

  createExternFile = (path, file, callback) => {
    
  }

  uploadLocalFile = (file, path, callback) => {
    this.fs.readFile(file.path, (err, buffer) => {
      if (err) alert(err)
      else {
        this.ftp.put(buffer, path + file.name, (err) => {
          if (err) alert(err);
          else callback();
        })
      }
    })
  }

  uploadLocalFiles = (files, path, callback) => {
    let i = 0;
    
    let loopFiles = (files) => {
      this.uploadLocalFile(files[i], path, () => {
        i++;
        if (i < Object.keys(files).length) {
          loopFiles(files);
        } else {
          return;
        }
      })
    }

    loopFiles(files);

    callback();
  }

  deleteExternFolder = (folder, callback) => {
    this.ftp.raw("rmd", folder, (err) => {
      if (err) alert(err);
      else callback();
    })
  }

  deleteExternFolderRecursively = (folder, callback) => {
    const path = window.require("path");
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
      callback();
      return deletions !== undefined ? Promise.all(deletions) : {};
    });
  }
}
