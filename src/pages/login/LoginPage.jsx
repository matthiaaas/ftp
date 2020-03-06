import React, { Component } from "react";

import { WifiOff, Bookmark } from "react-feather";

import Container from "../../components/misc/Container";
import Headline from "../../components/misc/Headline";
import Button from "../../components/misc/Button";

import { Page, Content, Header, ServerStatus, Login, Row, Input, Label, Tip, QuickActions } from "./styles";

import QuickAction from "./components/QuickAction";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: {
        host: "",
        port: 21,
        user: "",
        pass: "",

        default: this.props.default
      }
    }

    this.submitLoginData = this.submitLoginData.bind(this);
  }

  submitLoginData() {
    if (typeof this.props.onLogin === "function") {
      let login = this.state.login;
      if(!(typeof login.port === "number")) {
        login.port = 21
      } if (login.user === "") {
        login.user = "anonymous"
      } if (login.pass === "anonymous") {
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
              <ServerStatus status={this.props.ftpStatus} />
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
                    placeholder="21"
                    type="number"
                    min="1"
                    max="9999"
                    style={{
                      textAlign: "right",
                      minWidth: "24px",
                      width: "24px",
                      maxWidth: "36px",
                      padding: "14px 26px 14px 22px"
                    }}
                    onChange={(event) => {
                      event.target.style.width = (event.target.value.length + 1) * 8 + "px";
                      this.setState({
                        login: {
                          ...this.state.login,
                          port: event.target.value
                        }
                      });
                    }}
                  />
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
                    style={{
                      letterSpacing: "3px"
                    }}    
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
                disabled={!(this.props.ftpStatus === "online")}
                onAction={(event) => {
                  let connections = JSON.parse(window.localStorage.getItem("registered_connections"));
                  connections.push({
                    name: this.props.ftpData.host,
                    user: this.props.ftpData.user,
                    port: this.props.ftpData.port,
                    protocol: "ftp"
                  });
                  window.localStorage.setItem("registered_connections", JSON.stringify(connections));
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
