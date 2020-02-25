import React, { Component, createRef } from "react";

class Process extends Component {
  constructor(props) {
    super(props);

    this.output = createRef();

    this.state = {
      isRunning: false,
      output: "\n"
    }

    this.ftp = this.props.ftp;

    this.execute = this.execute.bind(this);
  }

  execute(cmd) {
    this.ftp.raw(cmd, (err, data) => {
      if (err) {
        this.setState({output: err + "\n"});
      } else {
        this.setState({output: data.text});
      }
      this.props.onFinished.call(this);
    });
  }

  render() {
    return (
      <div className="process">
        <div onKeyPress={(event) => {
          if (event.which === 13) {
            if (event.target.value === "" || event.target.value === " ") {
              return;
            }
            if (!this.state.isRunning) {
              this.setState({isRunning: true});
              this.execute(event.target.value);
            }
          }
        }} className="input">
          <span className="host">{this.props.host}:</span>
          <span className="dir">~{this.props.dir ? this.props.dir : "$"}</span>
          <input ref={this.input} className="in" type="text" autoFocus />
        </div>
        <div className="output">
          {this.state.output.split("\n").map((line, index) => {
            return (
              <div className={"line" + (line.includes("Error:") ? " error" : "")} key={index}>{line}</div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Process;
