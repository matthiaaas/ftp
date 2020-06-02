import { IKey } from "../../providers/socket/types";

import { SFTPWrapper } from "ssh2";

const ssh2Client = window.require("ssh2").Client;

interface ISFTPCfg {
  address: string,
  port: number
}

export interface AuthResponse {
  err?: Error,
  success?: {
    text: string,
    system: {
      absPath: string,
      isWindows: boolean
    },
  },
  timestamp: number
}

enum EventTypes {error = "error", close = "close", end = "end"}

export default class SFTP {
  client: any;
  socket: any;
  address: ISFTPCfg["address"];
  port: ISFTPCfg["port"];
  events: {[type: string]: (...args: any) => void};

  constructor(cfg?: ISFTPCfg) {
    this.address = cfg?.address || "";
    this.port = cfg?.port || 22;
    this.client = new ssh2Client();

    this.events = {};
  }
  
  auth(user: string, pass: string | IKey) {
    console.log(pass)
    return new Promise((resolve, reject) => {
      try {
        this.client.once("ready", () => {
          this.client.sftp((err: Error, sftp: SFTPWrapper) => {
            this.socket = sftp;
            this.socket.realpath(".", (err: Error, absPath: string) => {
              const isUnix = absPath.startsWith("/");
              resolve({
                success: {
                  text: `Login successful on ${isUnix ? "Unix" : "Windows"} system, user directory is ${absPath}`,
                  system: {
                    absPath: absPath,
                    isWindows: !isUnix
                  }
                },
                timestamp: Date.now()
              });
            })
          })
        }).connect(typeof pass === "string" ?
          {
            host: this.address,
            port: this.port,
            username: user,
            password: pass
          } : {
            host: this.address,
            port: this.port,
            username: user,
            privateKey: pass.raw,
            passPhrase: pass.passPhrase
          }
        )
      } catch (err) {
        reject(err);
      }

      this.client.on("error", (err: Error) => this._callback(EventTypes.error, err));

      this.client.on("close", () => this._callback(EventTypes.close));

      this.client.on("end", () => this._callback(EventTypes.end));
    })
  }

  _callback(type: EventTypes, res?: any) {
    if (Object.keys(this.events).includes(type)) {
      this.events[type](res);
    }
  }

  on(event: EventTypes) {
    return new Promise((resolve) => {
      this.events[event] = resolve;
    })
  }

  ls(path: string) {
    return new Promise((resolve, reject) => {
      this.socket.readdir(path, (err: Error, list: Array<any>) => {
        let data: any = [];
        if (list) {
          list.forEach(item => data.push({
            name: item.filename,
            type: item.attrs.mode >= 33000 && item.attrs.mode <= 33999 ? 0 : 1,
            time: item.attrs.mtime * 1000,
            size: item.attrs.size
          }))
          data.sort((a: any, b: any) => a.name.localeCompare(b.name));
        }
        resolve(data);
      })
    })
  }

  destroy() {
    this.socket.end();
  }
}
