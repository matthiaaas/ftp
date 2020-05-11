import React, { useContext } from "react";

import socketContext from "../states/socket";

function Updater() {
  const [socket, setSocket] = useContext<any>(socketContext);

  const updateAddress = (event: any) => {
    setSocket({...socket, address: event.target.value})
  }

  return (
    <div>
      <input
        type="text"
        placeholder="address"
        onChange={updateAddress}
      />
    </div>
  )
}

export default Updater;
