import React, { Component } from "react";

import { ArrowLeft } from "react-feather";

class Popup extends Component {
  render() {
    return (
      <div className={"popup" + (this.props.name ? " " + this.props.name : "") + (this.props.hidden ? " hidden" : "")}>
        <div className="wrapper"
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              event.preventDefault();
              this.props.onEnter.call(this)
            }
          }}
          >
          <div className="title">
            <div className="back" onClick={(event) => {
              this.props.onClose.call(this);
            }}>
              <ArrowLeft />
            </div>
            <h1>{this.props.title}</h1>
          </div>
          <div className="input">
            {
              this.props.children
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;
