import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import SocketContext from "./states/socket";
import { ProtocolTypes, StatusTypes, ISocket } from "./states/socket/types";

import { GlobalStyles } from "./components/GlobalStyles";

import RouteChange from "./components/RouteChange";

import Titlebar from "./components/static/titlebar";
import Sidebar from "./components/static/sidebar";
import Taskbar from "./components/static/taskbar";

import LoginView from "./views/login";

import "./assets/css/reset.css";
 
const socketState = {
  address: "lol",
  port: 22,
  user: "",
  pass: "",
  protocol: ProtocolTypes.sftp,
  status: StatusTypes.offline,
  key: false,
  meta: {},
  system: {}
}

function App() {
  const socket = useState<ISocket>(socketState);
  const [location, setLocation] = useState("/");

  return (
    <SocketContext.Provider value={socket}>
      <GlobalStyles />
      <BrowserRouter>
        <RouteChange onChange={(location: string) => setLocation(location)}>
          <Titlebar />
          <Sidebar location={location} />
          <Taskbar />
          <Switch>
            <Route exact path="/login" component={(props: any) => {
              return <LoginView {...props} />
            }} />
          </Switch>
          <Redirect to="/login" />
        </RouteChange>
      </BrowserRouter>
    </SocketContext.Provider>
  )
}

export default App;
