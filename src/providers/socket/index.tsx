import { createContext } from "react";

import { ISocket, ProtocolTypes, StatusTypes } from "./types";

const socketState: ISocket = {
  address: "",
  port: 22,
  user: "",
  pass: "",
  protocol: ProtocolTypes.sftp,
  status: StatusTypes.offline,
  key: { valid: false },
  meta: {},
  system: {}
}

const SocketContext = createContext<[ISocket, any]>([socketState, () => {}]);

export default SocketContext;
