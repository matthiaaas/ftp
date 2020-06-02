import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import SocketContext from "./providers/socket";
import ClientContext, { Client } from "./providers/client";
import { ProtocolTypes, StatusTypes, ISocket } from "./providers/socket/types";

import { GlobalStyles } from "./components/GlobalStyles";

import RouteChange from "./components/RouteChange";

import Titlebar from "./components/static/titlebar";
import Sidebar from "./components/static/sidebar";
import Taskbar from "./components/static/taskbar";

import LoginView from "./views/login";
import SessionView from "./views/session";

import "./assets/css/reset.css";
 
const socketState = {
  address: "",
  port: 22,
  user: "",
  pass: "",
  protocol: ProtocolTypes.sftp,
  status: StatusTypes.offline,
  key: { valid: false },
  meta: {},
  system: {}
}

function App() {
  const socket = useState<ISocket>(socketState);
  const client = useState(new Client({socket: [socket[0], socket[1]]}));
  const [location, setLocation] = useState("/");

  useEffect(() => {
    client[0].socketState = socket[0];
    client[0].setSocket = socket[1];
  }, [socket[0]]);

  return (
    <ClientContext.Provider value={client}>
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
              <Route exact path="/session" component={(props: any) => {
                return <SessionView {...props} />
              }} />
            </Switch>
            <Redirect to="/login" />
          </RouteChange>
        </BrowserRouter>
      </SocketContext.Provider>
    </ClientContext.Provider>
  )
}

export default App;
