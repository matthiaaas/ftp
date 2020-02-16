import React, { Component, createRef } from "react";

class Process extends Component {
  constructor(props) {
    super(props);

    this.output = createRef();

    this.state = {
      isRunning: false,
      output: ""
    }

    this.execute = this.execute.bind(this);
  }

  execute(cmd) {
    const process = window.require("child_process");

    var child = process.exec(cmd);

    child.on("error", (err) => {
      this.setState({output: this.state.output + "\err" + "\n" + err});
    });

    child.stdout.on("data", (data) => {
      this.setState({output: this.state.output + "\n" + data});
    });

    child.stderr.on("data", (data) => {
      this.setState({output: this.state.output + "\err" + "\n" + data});
    });

    child.on("exit", () => {
      if (typeof this.props.onFinished === 'function') {
        this.props.onFinished.call(this);
      } 
    })
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
        <div ref={this.output} className="output">
          {this.state.output.split("\n").map((line, index) => {
            console.log((line.includes("\err") ? " error" : ""), line);
            return (
              <div className={"line" + (line.includes("\err") ? " error" : "")} key={index}>{line}</div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Process;
