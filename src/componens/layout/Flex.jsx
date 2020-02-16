import React, { Component } from "react";

class Flex extends Component {
  render() {
    const aligncenter = this.props.aligncenter ? " align-center": "";
    const spacebetween = this.props.spacebetween ? " space-between": "";

    return (
      <div className={"flex" + aligncenter + spacebetween} {...this.props}>
        {this.props.children}
      </div>
    );
  }
}

export default Flex;

export class Con extends Component {
  render() {
    const flex = this.props.flex ? " con" + this.props.flex: "";
    const classNames = this.props.className ? " " + this.props.className: "";

    return (
      <div className={"con" + flex + classNames}>
        {this.props.children}
      </div>
    );
  }
}
