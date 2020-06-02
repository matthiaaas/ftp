import { createContext } from "react";

import { ProtocolTypes, ISocket, StatusTypes } from "../socket/types";

import SFTP, { AuthResponse } from "../../components/sockets/sftp";

type TSocket = [ISocket, React.Dispatch<React.SetStateAction<ISocket>>];

interface IClientCfg {   
  type?: ProtocolTypes,
  socket: TSocket
}

export class Client {
  type: IClientCfg["type"];
  socket: any;
  socketState: TSocket[0];
  setSocket: TSocket[1];
  
  constructor(cfg: IClientCfg) {
    this.type = cfg.type || ProtocolTypes.ssh;
    this.socketState = cfg.socket[0];
    this.setSocket = cfg.socket[1];

    this.initSocket = this.initSocket.bind(this);
    this.login = this.login.bind(this);
  }     

  initSocket(address: string, port: number | null) {
    this.socket = new SFTP({address: address, port: port || 22});
  }
  
  login(socket: ISocket) {
    return new Promise((resolve, reject) => {
      this.setSocket({...this.socketState, ...socket, status: StatusTypes.idle});
      console.debug("logging in to " + `%c${socket.user}@${socket.address}`, "text-decoration: underline;", `on port ${socket.port}...`);
      // init socket with address and password
      this.initSocket(socket.address, socket.port);
      console.debug(`authenticating as ${socket.user}...`);
      // auth with username and password / ssh key
      const authSecret = typeof socket.key === "object" && socket.key !== undefined ? socket.key : socket.pass;
      this.socket.auth(socket.user, authSecret).then((res: AuthResponse) => {
        if (res.err) {
          console.debug("authentication failed");
          console.error(res.err);
          reject();
        }
        if (res.success) {
          console.debug("successfully logged in");
          console.info(`%c${socket.user}@${socket.address}:`, "color: #25CC40", res.success.text);
          // update socket data with timestamp and system meta data
          this.setSocket({...this.socketState, ...socket,
            status: StatusTypes.online,
            meta: {
              timestamp: res.timestamp
            },
            system: {
              absPath: res.success.system.absPath,
              isWindows: res.success.system.isWindows
            }
          })
          resolve({success: res.success, socket: this.socket});
        }
      }).catch((err: Error) => {
        console.debug(err);
      })

      // registering socket event handlers
      this.socket.on("error").then((res: Error) => {
        console.debug("catched error in socket " + `%c${res.toString()}`, "text-decoration: underline;");
        window.alert(res);
      })
      this.socket.on("close").then(() => {
        console.info(`%c${socket.user}@${socket.address}:`, "color: #FF6157", "disconnected");
      })
      this.socket.on("end").then(() => {
        console.info(`%c${socket.user}@${socket.address}:`, "color: #FF6157", "session ended");
      })
    })
  }

  logout() {

  }
}

const client = null;

const ClientContext = createContext<any>([client, () => {}]);

export default ClientContext;
