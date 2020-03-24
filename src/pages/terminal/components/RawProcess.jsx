import React, { Component } from "react";

import { Wrapper, Prompt, Connection, Tree, Input, Output, Line } from "./Process";

export default class Process extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cmd: "",
      output: [],
      isRunning: false
    }

    this.socket = this.props.socket;

    this.execute = this.execute.bind(this);
  }

  execute(cmd) {
    this.setState({ isRunning: true });
    
    if (this.props.socketStatus !== "online") {
      console.debug("unable to send terminal command");
      return this.props.onFinished.call(this);
    }

    this.socket.raw(cmd, (err, data, finished) => {
      let output = this.state.output;
      
      if (err) {
        output.push({ content: err.toString(), isError: true })
        this.setState({ output: output })
      } else if (data) {
        output.push({ content: data.text, isError: data.isError || false })
        this.setState({ output: output })
      }
      
      if (finished || this.props.protocol === "ftp") this.props.onFinished.call(this);
    })
  }

  render() {
    return (
      <Wrapper>
        <Prompt>
          <Connection>{this.props.user}{this.props.host && "@"}{this.props.host || "terminal"}</Connection>
          <Tree>~{this.props.path === undefined || this.props.path === "/" ? "$" : this.props.path + "/"}</Tree>
          <Input
            defaultValue={this.props.input || ""}
            type="text"
            onChange={(event) => {
              this.setState({ cmd: event.target.value })
            }}
            onKeyDown={(event) => {
              if (event.keyCode === 13) {
                let cmd = event.target.value;
                this.props.onSubmit.call(this, cmd);
                if (cmd === "" || cmd === " ") this.props.onFinished.call(this);
                else this.execute(cmd);
              } else if (event.keyCode === 38) {
                if (typeof this.props.onNextCmd === "function") this.props.onNextCmd.call(this, this.props.cmdSelected);
              } else if (event.keyCode === 40) {
                if (typeof this.props.onPreviousCmd === "function") this.props.onPreviousCmd.call(this, this.props.cmdSelected);
              }
            }}
            style={{pointerEvents: this.state.isRunning && `none`}}
            tabIndex={(!this.state.isRunning).toString()}
            readOnly={this.state.isRunning}
            autoFocus
          />
        </Prompt>
        <Output>
          {this.state.output.map((item, index) => {
            return (
              <Line key={index} isError={item.isError}>{item.content}</Line>
            )
          })}
        </Output>
      </Wrapper>
    )
  }
}
