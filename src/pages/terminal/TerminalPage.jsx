import React, { Component, createRef } from "react";

import Process from "./components/Process";

class TerminalPage extends Component {
  constructor(props) {
    super(props);

    this.ftp = this.props.ftp;

    this.newProcess = this.newProcess.bind(this);

    this.cli = createRef();

    this.state = {
      processes: [
        <Process ftp={this.props.ftp} host={this.props.ftpData.host} onFinished={this.newProcess} />
      ]
    }
  }

  newProcess() {
    this.setState({
      processes: [
        ...this.state.processes,
        <Process ftp={this.props.ftp} host={this.props.ftpData.host} onFinished={this.newProcess} />
      ]
    });
  }

  render() {
    return (
      <main id="terminal">
        <div className="container">
          <div className="content">
            <div ref={this.cli} className="cli">
              {this.state.processes.map((item, index) => {
                return (
                  item
                );
              })}
              {/* <Process ftp={this.ftp} host={this.props.ftpData.host} onFinished={() => {
                this.setState({processes: this.state.processes + 1})
              }} /> */}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default TerminalPage;
