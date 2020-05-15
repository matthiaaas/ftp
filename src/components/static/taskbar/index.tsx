import React, { useContext } from "react";

import SocketContext from "../../../states/socket";

import { Header, Content } from "./styles";

function Taskbar() {
  const [socket, setSocket] = useContext(SocketContext);

  return (
    <Header>
      <Content>
        <h4>{socket.address}</h4>
      </Content>
    </Header>
  )
}

export default Taskbar;
