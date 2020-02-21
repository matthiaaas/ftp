import React, { Component } from "react";

class ContextMenu extends Component {
  render() {
    return (
      <div ref={this.props.cref} style={this.props.style} className="contextmenu">
        <ul>
          {
            this.props.children
          }
        </ul>
      </div>
    );
  } 
}

export default ContextMenu;


export class ContextMenuItem extends Component {
  render() {
    return (
      <li onClick={(event) => {
        if (typeof this.props.onExecute === "function") {
          this.props.onExecute.call(this)
        }
      }} className={this.props.disabled ? "disabled" : {}}>
        <span className="name">{this.props.name}</span>
        <span className="shortcut">{this.props.shortcut}</span>
      </li>
    );
  }
}
