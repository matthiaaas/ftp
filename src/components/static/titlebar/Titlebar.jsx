import React, { Component } from "react";
import styled from "styled-components";

const Title = styled.div`
  z-index: 6;
  position: fixed;
  -webkit-app-region: drag;
  width: 100%;
  height: 36px;
  background: var(--color-dark);
`

class Titlebar extends Component {
  render() {
    return (
      <Title />
    )
  }
}

export default Titlebar;
