import { createContext } from "react";

import { ProtocolTypes, ISocket, StatusTypes } from "../socket/types";

import SFTP from "../../components/sockets/sftp";

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
    this.type = cfg?.type || ProtocolTypes.ssh;
    this.socketState = cfg.socket[0];
    this.setSocket = cfg.socket[1];
    // this.socket = this.type ? new SFTP() : {};
  }     

  initSocket(address: string, port: number | null) {
    this.socket = new SFTP({address: address, port: port || 22});
  }
  
  login(socket: ISocket) {
    return new Promise((resolve, reject) => {
      this.setSocket({...this.socketState, ...socket, status: StatusTypes.idle});
      console.debug("logging in to" + `%c${socket.user}@${socket.address}`, "text-decoration: underline;", `on port ${socket.port}...`);
      this.initSocket(socket.address, socket.port);
      console.debug(`authenticating as ${socket.user}...`);
      this.socket.auth(socket.user, socket.pass).then((res: any) => {
        if (res.err) {
          console.debug("authentication failed");
          console.error(res.err);
          reject();
        };
        if (res.success) {
          console.debug("successfully logged in");
          console.info(`%c${socket.user}@${socket.address}:`, "color: #25CC40", res.success);
          this.setSocket({...this.socketState, ...socket, status: StatusTypes.online})
          resolve({success: res.success});
        }
      })
    })
  }

  logout() {

  }

  test() {
    console.log(this.type)
  }
}

const client = null;

const ClientContext = createContext<any>([client, () => {}]);

export default ClientContext;
