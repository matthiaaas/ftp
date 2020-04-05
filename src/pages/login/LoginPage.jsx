import React, { Component } from "react";

import { WifiOff, Bookmark } from "react-feather";

import Container from "../../components/misc/Container";
import Headline from "../../components/misc/Headline";
import Dropdown, { DropdownItem } from "../../components/misc/Dropdown";
import Button from "../../components/misc/Button";
import ServerStatus from "../../components/misc/ServerStatus";

import { Page, Content, Header, Login, Row, Input, Label, Tip, QuickActions } from "./styles";

import QuickAction from "./components/QuickAction";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: {
        host: "",
        port: 22,
        user: "",
        pass: "",
        protocol: "sftp",

        default: this.props.default
      }
    }

    this.submitLoginData = this.submitLoginData.bind(this);
  }

  submitLoginData() {
    if (typeof this.props.onLogin === "function") {
      let login = this.state.login;
      if(typeof login.port !== "number") {
        login.port = 22
      } if (login.user === "") {
        login.user = "anonymous"
      } if (login.pass === "") {
        login.pass = "anonymous"
      }
      this.props.onLogin.call(this, login);
    }
  }

  render() {
    return (
      <Page
        onKeyDown={(event) => {
          if (event.keyCode === 13) {
            event.preventDefault();
            if (this.state.login.host !== "") {
              this.submitLoginData();
            }
          }
        }}
      >
        <Container>
          <Content>
            <Header>
              <ServerStatus status={this.props.socketStatus} />
              <Headline>Login</Headline>
            </Header>
            <Login>
              <Row>
                <Input>
                  <Label>Server</Label>
                  <Button variant="input"
                    placeholder="example.com"
                    type="text"
                    value={this.state.login.host}
                    onChange={(event) => {
                      this.setState({
                        login: {
                          ...this.state.login,
                          host: event.target.value
                        }
                      });
                    }}
                    autoFocus
                  />
                </Input>
                <Input>
                  <Label>Port</Label>
                  <Button variant="input"
                    placeholder="22"
                    type="number"
                    min="1"
                    max="9999"
                    style={{
                      textAlign: "right",
                      width: "24px",
                      minWidth: "24px",
                      maxWidth: "37px",
                      padding: "12px 24px 12px 20px"
                    }}
                    onChange={(event) => {
                      event.target.style.width = (event.target.value.length + 1) * 8 + "px";
                      this.setState({
                        login: {
                          ...this.state.login,
                          port: parseInt(event.target.value)
                        }
                      });
                    }}
                  />
                </Input>
                <Input>
                  <Label>Protocol</Label>
                  <Dropdown
                    onChange={(event) => {
                      this.setState({
                        login: {
                          ...this.state.login,
                          protocol: event.target.value
                        }
                      })
                    }}
                  >
                    <DropdownItem value="sftp">SFTP</DropdownItem>
                    <DropdownItem value="ftp">FTP</DropdownItem>
                  </Dropdown>
                </Input>
              </Row>
              <Row>
                <Input>
                  <Label>User</Label>
                  <Button variant="input"
                    placeholder="root"
                    type="text"
                    onChange={(event) => {
                      this.setState({
                        login: {
                          ...this.state.login,
                          user: event.target.value
                        }
                      });
                    }}
                  />
                </Input>
                <Input>
                  <Label>Password</Label>
                  <Button variant="input"
                    placeholder="••••"
                    type="password"
                    onChange={(event) => {
                      this.setState({
                        login: {
                          ...this.state.login,
                          pass: event.target.value
                        }
                      });
                    }}
                    onFocus={(event) => { event.target.parentElement.classList.add("show-tip") }}
                  />
                  <Tip className="tip">
                    <span>Hit <span onClick={this.submitLoginData} className="highlighted">Enter</span> to connect</span>
                  </Tip>
                </Input>
              </Row>
            </Login>
            <QuickActions>
              <QuickAction
                onAction={(event) => {
                  if (typeof this.props.onLogout === "function") {
                    this.props.onLogout.call(this);
                  }
                }}
              >
                <WifiOff />
                <span>Disconnect</span>
              </QuickAction>
              <QuickAction
                disabled={!(this.props.socketStatus === "online")}
                onAction={(event) => {
                  let connections = JSON.parse(window.localStorage.getItem("registered_connections"));
                  connections.push({
                    name: this.props.socketData.host,
                    user: this.props.socketData.user,
                    port: this.props.socketData.port,
                    pass: this.props.socketData.pass === "anonymous" && this.props.socketData.pass,
                    protocol: this.props.socketData.protocol
                  });
                  window.localStorage.setItem("registered_connections", JSON.stringify(connections));
                  alert("Saved connection as a bookmark in QuickConnect", false)
                }}
              >
                <Bookmark />
                <span>Save connection</span>
              </QuickAction>
            </QuickActions>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default LoginPage;
