import { createContext } from "react";

export enum ProtocolTypes {
  ftp = "ftp",
  sftp = "sftp",
  ssh = "ssh"
}

export enum StatusTypes {
  offline = "offline",
  idle = "idle",
  online = "online"
}

export interface ISocket {
  address: String,
  port: Number,
  user: String,
  pass: String,
  protocol: ProtocolTypes,
  status: StatusTypes,
  key?: Boolean | {
    raw?: String,
    valid?: Boolean,
    filePath?: String,
  },
  meta?: {
    timestamp?: Number,
    ip?: String,
    family?: Number
  },
  system?: {
    os?: String,
    absPath?: String,
    isWindows?: Boolean
  }
}

const socketState = {
  address: "",
  port: 22,
  user: "",
  pass: "",
  protocol: ProtocolTypes.sftp,
  status: StatusTypes.offline,
  key: false,
  meta: {},
  system: {}
}

const SocketContext = createContext<[ISocket, any]>([socketState, () => {}]);

export default SocketContext;
