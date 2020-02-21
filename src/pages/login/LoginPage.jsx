import React, { Component } from "react";
import { WifiOff } from "react-feather";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: {
        host: "",
        port: 0,
        user: "",
        pass: ""
      }
    }

    this.submitLoginData = this.submitLoginData.bind(this);
  }

  submitLoginData() {
    this.props.onLogin.call(this, this.state.login);
  }

  render() {
    return (
      <main onKeyDown={(event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
          this.submitLoginData();
        }
      }} id="login">
        <div className="container">
          <div className="content">
            <div className="header">
              <div className={"status " + this.props.ftpStatus}></div>
              <h1>Login</h1>
            </div>
            <div className="login">
              <div className="row">
                <div className="input server">
                  <label>Server</label>
                  <input onChange={(event) => {
                    this.setState({
                      login: {
                        ...this.state.login,
                        host: event.target.value
                      }
                    });
                  }} placeholder="root@example.com" type="text" autoFocus />
                </div>
                <div className="input port">
                  <label>Port</label>
                  <input onChange={(event) => {
                    this.setState({
                      login: {
                        ...this.state.login,
                        port: event.target.value
                      }
                    });
                  }} placeholder="21" min="1" type="number" />
                </div>
              </div>
              <div className="row">
                <div className="input user">
                  <label>User</label>
                  <input onChange={(event) => {
                    this.setState({
                      login: {
                        ...this.state.login,
                        user: event.target.value
                      }
                    });
                  }} placeholder="root" type="text" />
                </div>
                <div className="input password">
                  <label>Password</label>
                  <input onChange={(event) => {
                    this.setState({
                      login: {
                        ...this.state.login,
                        pass: event.target.value
                      }
                    });
                  }} onFocus={(event) => {
                    event.target.parentElement.classList.add("focussed")
                  }} placeholder="••••" type="password" />
                  <div className="tip">
                    <span>Hit <span className="highlighted" onClick={this.submitLoginData}>Enter</span> to connect</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="quickactions">
              <ul>
                <li onClick={(event) => {
                  this.props.onLogout.call(this);
                }}>
                  <WifiOff />
                  <span>Disconnect</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  } 
}

export default LoginPage;
