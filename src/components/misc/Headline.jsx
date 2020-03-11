import React, { Component } from "react";
import styled from "styled-components";

const Title = styled.h1`
  font-family: var(--font-main);
  font-weight: bold;
  font-size: 24px;
  line-height: 1.4;
  color: var(--color-white);
`

export default class Headline extends Component {
  render() {
    return (
      <Title>{this.props.children}</Title>
    )
  }
}
