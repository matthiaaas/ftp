import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: calc(36px + 156px) 0 0 200px;
`

export default class Container extends Component {
  render() {
    return (
      <Wrapper>
        {this.props.children}
      </Wrapper>
    )
  }
}
