import React, { Component, Fragment, createRef } from "react";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import RouteChange from "./components/RouteChange";
import { GlobalStyles } from "./components/GlobalStyles";

import Titlebar from "./components/static/titlebar/Titlebar";
import Sidebar from "./components/static/sidebar/Sidebar";
import Taskbar from "./components/static/taskbar/Taskbar";

import LoginPage from "./pages/login/LoginPage";
import SessionPage from "./pages/session/Sessionpage";
import TerminalPage from "./pages/terminal/TerminalPage";
import StatsPage from "./pages/stats/StatsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import QuickConnectPage from "./pages/quickconnect/QuickConnectPage";

import "./assets/css/reset.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: window.location.pathname,

      ftp: {
        host: "",
        port: 0,
        user: "",
        pass: ""
      },
      status: "offline"
    }

    const jsftp = window.require("jsftp");

    this.ftp = new jsftp({
      host: this.state.ftp.host,
      port: this.state.ftp.port,
      user: this.state.ftp.user,
      pass: this.state.ftp.pass
    });

    this.loginToFTP = this.loginToFTP.bind(this);
    this.logoutFromFTP = this.logoutFromFTP.bind(this);

    this.sidebar = createRef();
    this.ftpClient = createRef();
  }

  logoutFromFTP() {
    this.setState({
      ftp: {
        host: "",
        port: 0,
        user: "",
        pass: ""
      }
    });
    this.ftp.raw("quit", (err, data) => {
      if (err) {
        return alert(err);
      }
    });
    this.setState({
      status: "offline"
    });
  }

  loginToFTP(data) {
    this.logoutFromFTP();

    this.setState({
      status: "afk",
      ftp: {
        host: data.host,
        port: data.port,
        user: data.user,
        pass: data.pass
      }
    });

    const jsftp = window.require("jsftp");

    this.ftp = new jsftp({
      host: data.host,
      port: data.port
    });

    this.ftp.auth(data.user, data.pass, (err, success) => {
      if (err) {
        alert(err);
        this.setState({ status: "offline" });
      }
      if (success) {
        console.log(success);
        this.setState({ status: "online" });
      }
    })

    // this.ftp.raw("noop", (err, data) => {
    //   if (err) alert(err);
    //   else {
    //     console.log(data)
    //     this.setState({ status: "online" });
    //   }
    // });
  }

  render() {
    return (
      <Fragment>
        <GlobalStyles />
        <BrowserRouter>
          <RouteChange onChange={(location, action) => {
            this.setState({location: location})
            this.sidebar.current.changeActive(location);
          }}>
            <Titlebar />
            <Sidebar ref={this.sidebar} />
            <Taskbar
              ftpData={this.state.ftp}
              ftpStatus={this.state.status}
            />
            <Switch>
              <Route exact path="/" component={(props) => {
                return (
                  <LoginPage
                    ftpData={this.state.ftp}
                    ftpStatus={this.state.status}
                    onLogin={this.loginToFTP}
                    onLogout={this.logoutFromFTP}
                  />
                );
              }} />
              <Route exact path="/session" component={(props) => {
                return (
                  <SessionPage
                    ftp={this.ftp}
                    ftpData={this.state.ftp}
                    ftpStatus={this.state.status}
                  />
                );
              }} />
              <Route exact path="/terminal" component={(props) => {
                return (
                  <TerminalPage
                    ftp={this.ftp}
                    ftpData={this.state.ftp}
                    ftpStatus={this.state.status}
                  />
                )
              }} />
              <Route exact path="/stats" component={StatsPage} />
              <Route exact path="/settings" component={SettingsPage} />
              <Route exact path="/quickconnect" component={(props) => {
                return (
                  <QuickConnectPage
                    ftpData={this.state.ftp}
                    ftpStatus={this.state.status}
                    onLogin={this.loginToFTP}
                  />
                )
              }} />
            </Switch>
            <Redirect to="/" />
          </RouteChange>
        </BrowserRouter>
      </Fragment>
    )
  }
}

export default App;
