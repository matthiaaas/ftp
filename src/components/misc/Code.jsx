import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.code`
  font-family: var(--font-code);
  font-size: 15px;
  padding: 0px 4px 1px 4px;
  border-radius: 4px;
  border: 1px solid var(--color-dark-grey);
  display: inline-block;
  background: var(--color-dark);
`

export default class Code extends Component {
  render() {
    return (
      <Wrapper>
        {this.props.children}
      </Wrapper>
    )
  }
}
