import React, { Component, Fragment, createRef } from "react";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import RouteChange from "./components/RouteChange";
import { GlobalStyles } from "./components/GlobalStyles";

import Alert from "./components/misc/Alert";

import SFTP from "./components/sftp";

import Titlebar from "./components/static/titlebar/Titlebar";
import Sidebar from "./components/static/sidebar/Sidebar";
import Taskbar from "./components/static/taskbar/Taskbar";

import LoginPage from "./pages/login/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SessionPage from "./pages/session/SessionPage";
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

      socket: {
        host: "",
        port: 0,
        user: "",
        pass: "",
        key: false,
        protocol: "ftp",
        ip: "",
        family: 4
      },
      status: "offline"
    }
    this.dns = window.require("dns");

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.alert = createRef();

    this.sidebar = createRef();
    this.taskbar = createRef();
    this.session = createRef();
  }

  componentDidMount() {
    alert = (text, isError) => {
      this.alert.current.show(text, isError);
    }
  }

  logout() {
    console.info("logging out...");

    if (this.socket !== undefined && this.state.status === "online") {
      this.socket.raw("quit", (err, data) => {
        if (err) {
          return alert(err);
        }
      });
      this.socket.destroy();
    }

    this.setState({
      socket: {
        ...this.state.socket,
        host: "",
        port: 0,
        user: "",
        pass: ""
      },
      status: "offline"
    })
  }

  login(data) {
    this.logout();
    
    console.info(`logging in to ${data.host}...`);

    data.protocol = data.protocol || "ftp";

    this.setState({
      status: "afk",
      socket: {
        host: data.host,
        port: data.port,
        user: data.user,
        pass: data.pass,
        protocol: data.protocol
      }
    });

    this.dns.lookup(data.host, {verbatim: true}, (err, address, family) => {
      if (err) {
        this.setState({ status: "offline" });
        return alert(`Unable to resolve '${data.host}'`)
      } if (address) {
        this.setState({
          socket: {
            ...this.state.socket,
            ip: address,
            family: family
          }
        });
      }
    })

    if (data.protocol === "ftp") {
      console.debug("session protocol is: ftp");
      const jsftp = window.require("jsftp");

      this.socket = new jsftp({
        host: data.host,
        port: data.port
      });

      this.socket.on("error", (err) => {
        console.error(err);
        if (err.toString().includes("ECONNRESET")) {
          alert(err);
        }
        this.setState({ status: "offline" });
      })
    } else {
      console.debug("session protocol is: sftp");

      this.socket = new SFTP({
        host: data.host,
        port: data.port
      })
    }

    this.socket.auth(data.user, data.pass, (err, success, end) => {
      if (err) {
        alert(err);
        console.log(err.toString());
      }
      if (success) {
        console.info(`%c${data.user}@${data.host}:`, "color: #25CC40", success.text);
        this.setState({ status: "online" });
      }
    })
  }

  render() {
    return (
      <Fragment>
        <GlobalStyles />
        <BrowserRouter>
          <RouteChange onChange={(location, action) => {
            this.setState({location: location})
            this.sidebar.current.changeActive(location);
            this.taskbar.current.changeActive(location);
          }}>
            <Titlebar />
            <Sidebar ref={this.sidebar} />
            <Taskbar
              ref={this.taskbar}
              socket={this.socket}
              socketData={this.state.socket}
              socketStatus={this.state.status}
              onRefresh={() => {if (this.state.location.pathname === "/session") this.session.current.updateExternFiles()}}
              onDisconnect={this.logout}
            />
            <Alert ref={this.alert} />
            <Switch>
              <Route exact path="/" component={(props) => {
                return (
                  <LoginPage
                    socketData={this.state.socket}
                    socketStatus={this.state.status}
                    onLogin={this.login}
                    onLogout={this.logout}
                  />
                );
              }} />
              <Route exact path="/dashboard" component={(props) => {
                return (
                  <DashboardPage
                    socket={this.socket}
                    socketData={this.state.socket}
                    socketStatus={this.state.status}
                  />
                );
              }} />
              <Route exact path="/session" component={(props) => {
                return (
                  <SessionPage
                    ref={this.session}
                    socket={this.socket}
                    socketData={this.state.socket}
                    socketStatus={this.state.status}
                  />
                );
              }} />
              <Route exact path="/terminal" component={(props) => {
                return (
                  <TerminalPage
                    socket={this.socket}
                    socketData={this.state.socket}
                    socketStatus={this.state.status}
                  />
                )
              }} />
              <Route exact path="/stats" component={StatsPage} />
              <Route exact path="/settings" component={(props) => {
                return (
                  <SettingsPage />
                )
              }} />
              <Route exact path="/quickconnect" component={(props) => {
                return (
                  <QuickConnectPage
                    socketData={this.state.socket}
                    socketStatus={this.state.status}
                    onLogin={this.login}
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
