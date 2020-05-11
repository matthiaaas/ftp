import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import SocketContext from "./states/socket";

import Titlebar from "./components/static/titlebar";
import Menubar from "./components/static/menubar";

import LoginView from "./views/login";

import "./assets/css/reset.css";
 
function App() {
  const socket: any = useState({});

  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Titlebar />
        <Menubar />
        <Switch>
          <Route exact path="/login" component={(props: any) => {
            return <LoginView {...props} />
          }} />
        </Switch>
        <Redirect to="/login" />
      </BrowserRouter>
    </SocketContext.Provider>
  )
}

export default App;
