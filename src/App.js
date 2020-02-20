import React, { Component, Fragment, createRef } from "react";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import RouteChange from "./components/RouteChange";

import Sidebar from "./components/static/Sidebar";
import Taskbar from "./components/static/Taskbar";

import SessionPage from "./pages/session/SessionPage";
import TerminalPage from "./pages/terminal/TerminalPage";
import StatsPage from "./pages/stats/StatsPage";
import SettingsPage from "./pages/settings/SettingsPage";

import "./assets/css/style.scss";
import LoginPage from "./pages/login/LoginPage";


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

    try {
      const jsftp = window.require("jsftp");

      this.ftp = new jsftp({
        host: this.state.ftp.host,
        port: this.state.ftp.port,
        user: this.state.ftp.user,
        pass: this.state.ftp.pass
      });
    } catch {
      this.ftp = null;
    }

    this.loginToFTP = this.loginToFTP.bind(this);
    this.logoutFromFTP = this.logoutFromFTP.bind(this);

    this.sidebar = createRef();
    this.ftpClient = createRef();

    this.createMenu();
  }

  createMenu() {
    const { remote } = window.require("electron");
    const { Menu, MenuItem } = remote;

    const menu = new Menu({
      label: "awesome"
    });
    menu.append(new MenuItem({
      label: "Connection",
      click() {
        console.log("clicked!")
      }
    }))
  }

  logoutFromFTP() {
    this.ftp.raw("quit", (err, data) => {
      if (err) {
        return alert(err);
      }
      this.setState({
        ftp: {
          host: "",
          port: 0,
          user: "",
          pass: ""
        }
      });
      this.setState({
        status: "offline"
      });
    })
  }

  loginToFTP(data) {
    this.logoutFromFTP();

    this.setState({
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
      port: data.port,
      user: data.user,
      pass: data.pass
    });

    this.ftp.ls(".", (err) => {
      if (err) {
        return;
      }
      this.setState({
        status: "online"
      });
    })
  }

  render() {
    return (
      <Fragment>
        <BrowserRouter>
          <RouteChange onChange={(location, action) => {
            this.setState({location: location})
            this.sidebar.current.changeActive(location);
          }}>
            <div id="titlebar" />
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
              <Redirect to="/" />
            </Switch>
          </RouteChange>
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default App;
