import React, { Component, Fragment } from "react";

import Process from "./InteractiveProcess";

export default class InteractiveTerminal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      processes: []
    }
    
    this.socket = this.props.socket;

    const { shell } = require("../../../components/sftp");
    this.shell = new shell(this.socket);

    this.newProcess = this.newProcess.bind(this);
  }

  componentDidMount() {
    if (!this.socket.sftp) return;
    this.shell.init((data) => {
      if (data.text.startsWith(
        `${this.props.socketData.user}@${this.props.socketData.host}`
      )) return this.newProcess(data.text);
      let processes = this.state.processes;
      if (processes.length > 0) {
        let process = processes.length - 1;
        processes[process].output.push(data)
        this.setState({
          processes: processes
        })
      }
    })
  }

  newProcess(prompt) {
    console.log(prompt)
    let host = this.props.socketData.host;
    let user = this.props.socketData.user;
    let path = undefined;
    if (prompt) {
      host = prompt.split("@")[1].split(":")[0];
      user = prompt.split("@")[0];
      path = prompt.split(":")[1];
    }
    this.setState({
      processes: [
        ...this.state.processes,
        {
          host: host,
          user: user,
          path: path,
          output: [],
          onFinished: this.newProcess
        }
      ]
    })
  }

  render() {
    return (
      <Fragment>
        {this.state.processes.map((item, index) => {
          return (
            <Process
              key={index}
              socket={this.props.socket}
              socketStatus={this.props.socketStatus}
              user={item.user}
              host={item.host}
              path={item.path}
              protocol={this.props.socketData.protocol}
              output={item.output}
              onSubmit={(cmd) => {this.shell.send(cmd)}}
              onFinished={item.onFinished}
            />
          )
        })}
      </Fragment>
    )
  }
}
