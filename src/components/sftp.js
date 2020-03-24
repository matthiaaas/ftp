const ssh2Client = window.require("ssh2").Client;

class SFTP {
  constructor(cfg) {
    this.host = cfg.host || "localhost";
    this.port = cfg.port || 22;
    this.user = cfg.user || "anonymous";
    this.pass = cfg.pass || "anonymous";
    this.key = cfg.key || false;

    this.sftp = undefined;

    this.authenticated = false;

    this.socket = new ssh2Client();
  }

  /**
   * @param {String} user 
   * @param {String} pass 
   * @param {Function} callback
   */
  auth(user, pass, callback) {
    if (this.sftp !== undefined) {
      return;
    }

    if (user) this.user = user;
    if (pass) this.pass = pass;

    this.socket.once("ready", () => {
      this.socket.sftp((err, sftp) => {
        this.sftp = sftp;
        this.authenticated = true;
        this.sftp.realpath(".", (err, absPath) => {
          let isUnix = absPath.startsWith("/");
          this.platform = isUnix ? "unix" : "windows";
          if (callback) callback(null, {text: `Login successful; path is ${absPath} on platform ${isUnix ? "Unix" : "Windows"}`});
        })
      })
    }).connect({
      host: this.host,
      port: this.port,
      username: this.user,
      password: this.pass
    })
  }

  /**
   * @param {String} filePath 
   * @param {Function} callback 
   */
  ls(filePath, callback) {
    if (!this.authenticated) return;
    this.sftp.readdir(filePath, (err, list) => {
      let data = [];
      list.forEach(item => data.push({
        name: item.filename,
        type: item.attrs.mode >= 33152 && item.attrs.mode <= 33188 ? 0 : 1,
        time: item.attrs.mtime * 1000,
        size: item.attrs.size
      }))
      data.sort((a, b) => a.name.localeCompare(b.name));
      callback(err, data)
    })
  }

  /**
   * @param {String} path 
   * @param {Function} callback 
   */
  cd(path, callback) {
    if (!this.authenticated) return;
    this.sftp.opendir(path, (err, data) => {
      callback(err, data);
    })
  }

  /**
   * @param {String|Buffer} from 
   * @param {String} to 
   * @param {Function} callback 
   */
  put(from, to, callback) {
    if (!this.authenticated) return;
    this.sftp.fastPut(from, to, (err) => {
      callback(err)
    })
  }

  /**
   * @param {String} from 
   * @param {String} to 
   * @param {Function} callback 
   */
  get(from, to, callback) {
    if (!this.authenticated) return;
    this.sftp.fastGet(from, to, (err) => {
      callback(err);
    })
  }

  /**
   * @param {String} filePath 
   * @param {Function} callback 
   */
  rm(filePath, callback) {
    if (!this.authenticated) return;
    this.raw(`rm "${filePath}"`, (err, data) => {
      callback(err, data);
    })
  }

  /**
   * @param {String} folderPath 
   * @param {Function} callback 
   */
  mkd(folderPath, callback) {
    if (!this.authenticated) return;
    this.sftp.mkdir(folderPath, (err) => {
      callback(err);
    })
  }

  /**
   * @param {String} folderPath 
   * @param {Function} callback 
   */
  rmd(folderPath, callback) {
    if (!this.authenticated) return;
    this.sftp.rmdir(folderPath, (err) => {
      callback(err);
    })
  }

  /**
   * @param {String} cmd 
   * @param {Function} callback 
   */
  raw(cmd, callback) {
    if (!this.authenticated) return;
    this.socket.exec(cmd, (err, data) => {
      if (data) {
        data.on("data", (d) => {
          callback(err, {text: d.toString(), isError: false});
        })
        data.stderr.on("data", (d) => {
          callback(err, {text: d.toString(), isError: true});
        })
        data.on("end", () => {
          callback(err, null, true);
        })
      }
    })
  }

  destroy() {
    this.socket.end();
  }
}


class Shell {
  constructor(socket) {
    this.socket = socket.socket;
  }

  init(callback) {
    this.socket.shell((err, stream) => {
      if (err) throw err;
      this.stream = stream;
      this.stream.on("data", (data) => {
        callback({
          text: data.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "").trim(),
          isError: data.toString().startsWith("-bash:") || data.toString().startsWith("-sh:")
        })
      })
      this.stream.stderr.on("data", (data) => {
        callback({text: data.toString().trim(), isError: true})
      });
      this.stream.on("end", () => {
        console.debug("shell stream ended")
      })
      this.stream.on("close", () => {
        console.debug("shell stream closed")
      })
    })
  }

  send(data) {
    this.stream.write(`${data}\r`)
  }
}

module.exports = {sftp: SFTP, shell: Shell};
