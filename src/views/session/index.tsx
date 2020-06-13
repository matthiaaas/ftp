import React, { useContext, useState, useEffect } from "react";

import ClientContext from "../../providers/client";

function SessionView() {
  const [client] = useContext(ClientContext);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    client.socket.ls("/").then((data: any) => {
      console.log(data)
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
