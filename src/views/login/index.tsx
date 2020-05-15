import React, { useContext, useState } from "react";

import SocketContext from "../../states/socket";
import { ISocket, ProtocolTypes, StatusTypes } from "../../states/socket/types";

import Container from "../../components/misc/Container";
import ServerStatus from "../../components/misc/ServerStatus";
import Headline from "../../components/misc/Headline";
import { IOption, TOptions } from "../../components/misc/Dropdown";

import { View, Content, Header, Login, Row, Field, Label, Input, Port, InputPort, Dropdown, SwitchAuth, AuthMode } from "./styles";

import { isValidSSHKey } from "../../utils/utils";

enum AuthTypes { pass = "pass", key = "key"};

const protocolItems: TOptions = [
  { name: "SSH", value: ProtocolTypes.ssh },
  { name: "SFTP", value: ProtocolTypes.sftp },
  { name: "FTP", value: ProtocolTypes.ftp}
]

const credentialsDefault: ISocket = {
  address: "",
  port: null,
  user: "",
  pass: "",
  protocol: ProtocolTypes.ssh,
  status: StatusTypes.offline
}

function LoginView() {
  const [socket, setSocket] = useContext(SocketContext);
  const [authMode, setAuthMode] = useState<AuthTypes>(AuthTypes.pass);
  const [credentials, setCredentials] = useState(credentialsDefault);

  const isNotOffline = socket.status !== StatusTypes.offline;

  return (
    <View>
      <Container>
        <Content>
          <Header>
            <ServerStatus status={StatusTypes.offline} />
            <Headline>Login</Headline>
          </Header>
          <Login>
            <Row>
              <Field>
                <Label>Server</Label>
                <Input
                  type="text"
                  defaultValue={isNotOffline ? socket.address : credentials.address}
                  placeholder={credentials.address || "example.com"}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setCredentials({...credentials,
                      address: event.target.value
                    })
                  }}
                  autoFocus
                />
              </Field>
              <Field>
                <Label>Port</Label>
                <Port>
                  <InputPort
                    type="number"
                    min={0}
                    max={65535}
                    defaultValue={isNotOffline ? socket.port : credentials.port}
                    placeholder="22"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setCredentials({...credentials,
                        port: parseInt(event.target.value) || null
                      })
                    }}
                    dynamicResizing
                  />
                  <Dropdown
                    onChange={(options: TOptions, selected: IOption) => {
                      const defaultPort = selected.value === ProtocolTypes.ftp ? 21 : 22;
                      setCredentials({
                        ...credentials,
                        port: credentials.port ? credentials.port : defaultPort,
                        protocol: selected.value
                      })
                    }}
                    options={protocolItems}
                  />
                </Port>
              </Field>
            </Row>
            <Row>
              <Field>
                <Label>User</Label>
                <Input
                  type="text"
                  defaultValue={isNotOffline ? socket.user : credentials.user}
                  placeholder={credentials.user || "root"}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setCredentials({...credentials,
                      user: event.target.value
                    })
                  }}
                />
              </Field>
              <Field>
                {credentials.protocol === ProtocolTypes.ftp ?
                  <Label>Password</Label> :
                  <SwitchAuth>
                    <AuthMode
                      selected={authMode === AuthTypes.pass}
                      onClick={() => setAuthMode(AuthTypes.pass)}
                    >Password</AuthMode>
                    <AuthMode
                      selected={authMode === AuthTypes.key}
                      onClick={() => setAuthMode(AuthTypes.key)}
                    >SSH Key</AuthMode>
                  </SwitchAuth>
                }
                {authMode === AuthTypes.pass ?
                  <Input
                    type="password"
                    defaultValue={isNotOffline ? socket.pass : credentials.pass}
                    placeholder={"•".repeat(credentials.pass.length) || "••••"}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setCredentials({...credentials,
                        pass: event.target.value
                      })
                    }}
                  /> :
                  <Input
                    type="browse"
                    defaultValue={
                      isNotOffline && socket.key ? (socket.key as any).file.name :
                      credentials.key ? (credentials.key as any).file.name : ""
                    }
                    onChange={(event: any) => {
                      const keyFile = event.target.files[0];
                      const rawContent = keyFile ? window.require("fs").readFileSync(keyFile.path).toString() : "";
                      setCredentials({...credentials, key: {
                        raw: rawContent,
                        valid: isValidSSHKey(rawContent),
                        file: {
                          name: keyFile ? keyFile.name : "",
                          path: keyFile ? keyFile.path : ""
                        }
                      }})
                    }}
                  />
                }
              </Field>
            </Row>
          </Login>
        </Content>
      </Container>
    </View>
  )
}

export default LoginView;
