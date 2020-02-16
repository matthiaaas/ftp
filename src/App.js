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
      location: window.location.pathname
    }

    this.sidebar = createRef();
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
              <Route exact path="/session" component={SessionPage} />
              <Route exact path="/terminal" component={TerminalPage} />
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
