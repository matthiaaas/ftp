import React, { Component } from "react";
import styled from "styled-components";

const Title = styled.h1`
  font-family: "Karla";
  font-weight: bold;
  font-size: 24px;
  color: var(--color-white);
`

export default class Headline extends Component {
  render() {
    return (
      <Title>{this.props.children}</Title>
    )
  }
}
