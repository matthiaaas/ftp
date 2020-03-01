import React, { Component } from "react";

import { WifiOff } from "react-feather";

import Container from "../../components/misc/Container";
import Headline from "../../components/misc/Headline";
import Button from "../../components/misc/Button";

import { Page, Content, Header, ServerStatus, Login, Row, Input, Label, Tip, QuickActions, QuickAction } from "./styles";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: {
        host: "example.com",
        port: 21,
        user: "root",
        pass: "root"
      }
    }

    this.submitLoginData = this.submitLoginData.bind(this);
  }

  submitLoginData() {
    if (typeof this.props.onLogin === "function") {
      this.props.onLogin.call(this, this.state.login);
    }
  }

  render() {
    return (
      <Page
        onKeyDown={(event) => {
          if (event.keyCode === 13) {
            event.preventDefault();
            this.submitLoginData();
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
                    placeholder={this.state.login.host !== "" ? this.state.login.host : "example.com"}
                    type="text"
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
                    placeholder={this.state.login.port !== "" ? this.state.login.port : "21"}
                    type="number"
                    min="1"
                    style={{
                      textAlign: "right",
                      maxWidth: "23px",
                      padding: "14px 26px 14px 22px"
                    }}
                    onChange={(event) => {
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
                    placeholder={this.state.login.user !== "" ? this.state.login.user : "root"}
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
                  <Label>Port</Label>
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
                onClick={(event) => {
                  if (typeof this.props.onLogout === "function") {
                    this.props.onLogout.call(this);
                  }
                }}
              >
                <WifiOff />
                <span>Disconnect</span>
              </QuickAction>
            </QuickActions>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default LoginPage;
