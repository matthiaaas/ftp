import React, { Component } from "react";

import KeyEvents from "../../../components/misc/KeyEvents";

import { Wrapper, Prompt, Connection, Tree, Input, Output, Line } from "./Process";

export default class Process extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRunning: false,
      keys: {}
    }

    this.handleShortcut = this.handleShortcut.bind(this);
  }

  handleShortcut(key) {
    if (this.state.keys.cmd) {
      switch (key) {
        case "c":
          this.props.onSubmit.call(this, "\x03")
          break;
        default:
          break;
      }
    }
  }

  render() {
    return (
      <Wrapper>
        {this.state.isRunning &&
          <KeyEvents
            onModifierKeys={(keys) => {
              this.setState({
                keys: keys
              })
            }}
            onKeys={this.handleShortcut}
          />
        }
        <Prompt>
          <Connection>{this.props.user}{this.props.host && "@"}{this.props.host || "terminal"}</Connection>
          <Tree>{this.props.path ? this.props.path : "~$"}</Tree>
          <Input
            defaultValue={this.props.input || ""}
            type="text"
            onKeyDown={(event) => {
              if (event.keyCode === 13) {
                let cmd = event.target.value;
                this.props.onSubmit.call(this, cmd);
                this.setState({ isRunning: true});
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
          {this.props.output.map((item, index) => {
            return (
              <Line key={index} isError={item.isError}>{item.text}</Line>
            )
          })}
        </Output>
      </Wrapper>
    )
  }
}
