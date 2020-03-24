import React, { Component, Fragment } from "react";

import Process from "./RawProcess";

export default class RawTerminal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      processes: [],
      cmds: []
    }
    
    this.newProcess = this.newProcess.bind(this);
    this.setInput = this.setInput.bind(this);
    this.logCmd = this.logCmd.bind(this);
  }

  componentDidMount() {
    this.newProcess();
  }

  newProcess() {
    if (this.props.socketStatus !== "online") {
      this.setState({
        processes: [
          ...this.state.processes,
          {
            host: this.props.socketData.host,
            user: this.props.socketData.user,
            path: undefined,
            input: undefined,
            onFinished: this.newProcess
          }
        ]
      })
    } else {
      this.props.socket.raw("pwd", (err, data) => {
        if (data) {
          let path;
          if (data.text.includes('"')) {
            path = data.text.match(/"([^"]+)"/)[1];
          } else path = data.text.split("\n")[0];
          this.setState({
            processes: [
              ...this.state.processes,
              {
                host: this.props.socketData.host,
                user: this.props.socketData.user,
                path: path,
                input: undefined,
                onFinished: this.newProcess
              }
            ]
          })
        }
      })
    }
  }

  logCmd(cmd) {
    let cmds = this.state.cmds;
    cmds.push(cmd)
    this.setState({
      cmds: cmds
    })
  }

  getNextCmd(i) {
    let cmds = this.state.cmds;
    let index = Math.max(i - 1, 0);
    let cmd = cmds[index];
    return {cmd: cmd, index: index};
  }

  getPreviousCmd(i) {
    let cmds = this.state.cmds;
    let index = Math.min(i + 1, this.state.processes.length - 1);
    let cmd = cmds[index];
    return {cmd: cmd, index: index};
  }

  setInput(process, input) {
    let processes = this.state.processes;
    processes[process].input = input.cmd;
    processes[process].cmdSelected = input.index;
    this.setState({
      processes: processes
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
              input={item.input}
              protocol={this.props.socketData.protocol}
              cmdSelected={item.cmdSelected === undefined ? index : item.cmdSelected}
              onSubmit={this.logCmd}
              onNextCmd={(i) => {
                this.setInput(index, this.getNextCmd(i))
              }}
              onPreviousCmd={(i) => {
                this.setInput(index, this.getPreviousCmd(i))
              }}
              onFinished={item.onFinished}
            />
          )
        })}
      </Fragment>
    )
  }
}
