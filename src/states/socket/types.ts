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
  address: string,
  port: number | null,
  user: string,
  pass: string,
  protocol: ProtocolTypes,
  status: StatusTypes,
  key?: boolean | {
    raw: string,
    valid: boolean,
    file?: {
      path: string,
      name: string
    }
    passPhrase?: string,
  },
  meta?: {
    timestamp?: number,
    ip?: string,
    family?: number
  },
  system?: {
    os?: string,
    absPath?: string,
    isWindows?: boolean
  }
}
