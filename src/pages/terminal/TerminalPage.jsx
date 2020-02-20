import React, { Component, createRef } from "react";

import Process from "./components/Process";

class TerminalPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processes: 1
    }

    this.cli = createRef();
  }

  render() {
    return (
      <main id="terminal">
        <div className="container">
          <div className="content">
            <div ref={this.cli} className="cli">
              {/* {this.state.processes.map((index) => {
                return (
                  
                );
              })} */}
              <Process host={this.props.ftpData.host} onFinished={() => {
                this.setState({processes: this.state.processes + 1})
              }} />
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default TerminalPage;
