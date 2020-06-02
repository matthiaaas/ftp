import React, { useContext, useState, useEffect } from "react";

import ClientContext from "../../providers/client";

function SessionView() {
  const [client] = useContext(ClientContext);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    console.log(client.type)
    client.socket.ls("/").then((data: any) => {
      setFiles(data);
    })
  }, []);

  return (
    <div>
      {files.map((file: any, index) => {
        return (
          <div key={index}>{file.name}</div>
        )
      })}
    </div>
  )
}

export default SessionView;
