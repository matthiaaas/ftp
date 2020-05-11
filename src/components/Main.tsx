import React, { useContext } from "react";

import socketContext from "../states/socket";

function Example() {
  const [socket, setSocket] = useContext(socketContext);

  return (
    <div>{socket.address}</div>
  )
}

export default Example;
