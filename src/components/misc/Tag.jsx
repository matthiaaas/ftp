import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 14px;
  text-transform: uppercase;
  color: var(--color-blue);
  border: 1px solid var(--color-blue);
  padding: 6px 12px;
  border-radius: 16px;
`

export default class Tag extends Component {
  render() {
    return (
      <Wrapper>
        {this.props.children}
      </Wrapper>
    )
  }
}
