import React, { useContext, useState } from "react";

import SocketContext from "../../providers/socket";
import ClientContext, { Client } from "../../providers/client";
import { ISocket, ProtocolTypes, StatusTypes } from "../../providers/socket/types";

import Container from "../../components/misc/Container";
import ServerStatus from "../../components/misc/ServerStatus";
import Headline from "../../components/misc/Headline";
import { IOption, TOptions } from "../../components/misc/Dropdown";

import { View, Content, Header, Login, Row, Field, Label, Input, Port, InputPort, Dropdown, SwitchAuth, AuthMode } from "./styles";

import { isValidSSHKey, areValidCredentials } from "./functions";

enum AuthTypes { pass = "pass", key = "key"};

const protocolItems: TOptions = [
  { name: "SSH/SFTP", value: ProtocolTypes.ssh },
  { name: "FTP", value: ProtocolTypes.ftp}
]

const credentialsDefault: ISocket = {
  address: "",
  port: null,
  user: "",
  pass: "",
  protocol: ProtocolTypes.ssh
}

const fallbackCredentials: ISocket = {
  address: "localhost",
  port: 22,
  user: "root",
  pass: "root",
  protocol: ProtocolTypes.ssh
}

function LoginView() {
  const [socket, setSocket] = useContext(SocketContext);
  const [client, setClient] = useContext(ClientContext);
  const [credentials, setCredentials] = useState(credentialsDefault);
  const [authMode, setAuthMode] = useState<AuthTypes>(socket.key ? AuthTypes.key : AuthTypes.pass);

  const isNotOffline = socket.status !== StatusTypes.offline;

  const submitCredentials = async () => {
    if (!areValidCredentials(credentials, fallbackCredentials)) {
      return console.debug("received non valid credentials");
    }
    credentials.key = authMode === AuthTypes.key ? credentials.key : { valid: false };
    setClient(new Client({
      type: credentials.protocol,
      socket: [socket, setSocket]
    }));
    const login = await client.login(credentials);
  }

  return (
    <View onKeyDown={(event: React.KeyboardEvent<HTMLFormElement>) => {
      if (event.keyCode === 13) {
        submitCredentials()
      }
    }}>
      <Container>
        <Content>
          <Header>
            <ServerStatus status={socket.status || StatusTypes.offline} />
            <Headline>Login</Headline>
          </Header>
          <Login>
            <Row>
              <Field>
                <Label>Server</Label>
                <Input
                  type="text"
                  defaultValue={isNotOffline ? socket.address : credentials.address}
                  placeholder={credentials.address || fallbackCredentials.address}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setCredentials({...credentials,
                      address: event.target.value
                    })
                  }}
                  maxLength="99"
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
                      setCredentials({
                        ...credentials,
                        port: credentials.port ? credentials.port : fallbackCredentials.port,
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
                  placeholder={credentials.user || fallbackCredentials.user}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setCredentials({...credentials,
                      user: event.target.value
                    })
                  }}
                  maxLength="99"
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
                    placeholder={"•".repeat(credentials.pass.length || fallbackCredentials.pass.length)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setCredentials({...credentials,
                        pass: event.target.value
                      })
                    }}
                    maxLength="99"
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
