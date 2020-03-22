import React, { Component, Fragment } from "react";

import Process from "./RawProcess";

export default class RawTerminal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      processes: []
    }
    
    this.newProcess = this.newProcess.bind(this);
  }

  componentDidMount() {
    if (this.props.socketStatus === "online") {
      this.newProcess();
    } else {
      this.setState({
        processes: [
          ...this.state.processes,
          {
            host: this.props.socketData.host,
            user: this.props.socketData.user,
            path: undefined,
            onFinished: this.newProcess
          }
        ]
      })
    }
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
                onFinished: this.newProcess
              }
            ]
          })
        }
      })
    }
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
              onFinished={item.onFinished}
            />
          )
        })}
      </Fragment>
    )
  }
}
