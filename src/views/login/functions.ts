import { ISocket } from "../../providers/socket/types";

export const isValidSSHKey = (raw: string) => {
  return true;
}

export const areValidCredentials = (credentials: ISocket, fallback?: ISocket) => {
  if (credentials.address && credentials.port !== null && credentials.user) {
    return true;
  } else if (fallback) {
    if (!credentials.address) credentials.address = fallback.address;
    if (!credentials.port) credentials.port = fallback.port;
    if (!credentials.user) credentials.user = fallback.user;
    if (!credentials.pass) credentials.pass = fallback.pass;
    return true;
  }
  return false;
}
