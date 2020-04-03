import React, { Component } from "react";
import styled from "styled-components";

const Status = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 16px;

  background: ${
    props => props.status === "online" ? `var(--color-green)`
    : props.status === "afk" ? `var(--color-yellow)` : `var(--color-red)`
  };
`

export default class ServerStatus extends Component {
  render() {
    return (
      <Status {...this.props} />
    )
  }
}
