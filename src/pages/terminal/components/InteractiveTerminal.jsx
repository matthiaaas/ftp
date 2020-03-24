import React, { Component, Fragment } from "react";
import styled from "styled-components";

import Process from "./InteractiveProcess";

const Messages = styled.div`
  font-family: var(--font-code);
  font-weight: 400;
  font-size: 15px;
  color: var(--color-grey);
`

export default class InteractiveTerminal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      cmds: [],
      processes: [],
      welcome: []
    }
    
    this.socket = this.props.socket;

    const { shell } = require("../../../components/sftp");
    this.shell = new shell(this.socket);

    this.newProcess = this.newProcess.bind(this);
  }

  componentDidMount() {
    if (!this.socket.sftp) return;
    this.shell.init((data) => {
      let lines = data.text.split("\n");
      let processes = this.state.processes;
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.startsWith(`${this.props.socketData.user}@`)) {
          this.newProcess(line);
        } else if (processes.length === 0) {
          let welcome = this.state.welcome;
          welcome.push(line)
          this.setState({
            welcome: welcome
          })
        } else if (processes.length > 0) {
          console.log(line)
          let process = processes.length - 1;
          processes[process].output.push({text: line, isError: data.isError});
          this.setState({
            processes: processes
          })
        }
      }
    })
  }

  newProcess(prompt) {
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

  logCmd(cmd) {
    let cmds = this.state.cmds;
    cmds.push(cmd)
    this.setState({
      cmds: cmds
    })
    console.log(cmds);
  }

  render() {
    return (
      <Fragment>
        <Messages>
          {this.state.welcome.map((item, index) => {
            return (
              <span key={index}>{item}</span>
            )
          })}
        </Messages>
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
              onSubmit={(cmd) => {
                this.shell.send(cmd);
                this.logCmd(cmd);
              }}
              onFinished={item.onFinished}
            />
          )
        })}
      </Fragment>
    )
  }
}
