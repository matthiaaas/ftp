import React, { Component, Fragment, createRef } from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import RouteChange from "./componens/RouteChange";

import Sidebar from "./componens/static/Sidebar";
import Taskbar from "./componens/static/Taskbar";

import SessionPage from "./pages/session/SessionPage";
import TerminalPage from "./pages/terminal/TerminalPage";
import StatsPage from "./pages/stats/StatsPage";
import SettingsPage from "./pages/settings/SettingsPage";

import "./assets/css/style.scss";


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: window.location.pathname,

      ftp: {
        host: "",
        port: 21,
        user: "",
        pass: ""
      }
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

    this.sidebar = createRef();

    this.ftpClient = createRef();
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
            <Taskbar />
            <Switch>
              <Route exact path="/session" component={(props) => {
                return (
                  <SessionPage ftp={this.ftp} />
                );
              }} />
              <Route exact path="/terminal" component={(props) => {
                return (
                  <TerminalPage ftp={this.ftp} />
                )
              }} />
              <Route exact path="/stats" component={StatsPage} />
              <Route exact path="/settings" component={SettingsPage} />
            </Switch>
          </RouteChange>
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default App;
