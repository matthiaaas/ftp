import { IKey } from "../../providers/socket/types";

import { SFTPWrapper } from "ssh2";

const ssh2Client = window.require("ssh2").Client;

interface ISFTPCfg {
  address: string,
  port: number
}

export default class SFTP {
  client: any;
  socket: any;
  address: ISFTPCfg["address"];
  port: ISFTPCfg["port"];

  constructor(cfg?: ISFTPCfg) {
    this.address = cfg?.address || "";
    this.port = cfg?.port || 22;
    this.client = new ssh2Client();
  }
  
  auth(user: string, pass: string | IKey, callback: (err: object | null, success?: object) => void) {
    return new Promise((resolve, reject) => {
      this.client.once("ready", () => {
        this.client.sftp((err: Error, sftp: SFTPWrapper) => {
          this.socket = sftp;
          this.socket.realpath(".", (err: Error, absPath: string) => {
            const isUnix = absPath.startsWith("/");
            resolve({err: null, success: {text: `Login successful; path is ${absPath} on platform ${isUnix ? "Unix" : "Windows"}`}});
          })
        })
      }).connect({
        host: this.address,
        port: this.port,
        username: user,
        password: pass
      })
  
      this.client.on("error", (err: Error) => {
        // callback(err);
        resolve({err})
      })
    })
  }
}
