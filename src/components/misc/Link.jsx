import React, { Component } from "react"

import { Link } from "react-router-dom";

import isExternal from "is-url-external";

export default class CustomLink extends Component {
  render() {
    if (isExternal(this.props.to) || this.props.to.startsWith("mailto:")) {
      return (
        <a href={this.props.to}>
          {this.props.children}
        </a>
      )
    } else {
      return (
        <Link to={this.props.to}>
          {this.props.children}
        </Link>
      )
    }
  }
}
