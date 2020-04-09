import React, { Component } from "react";
import styled from "styled-components";

import { File } from "react-feather";

const Drag = styled.div`
  position: absolute;
  left: -300vh;
`

const Icon = styled.div`
  position: relative;

  svg {
    color: var(--color-white);
    width: 36px !important;
    height: 36px !important;
    stroke-width: 1.6px;
  }
`

const Selected = styled.span`
  font-family: var(--font-code);
  font-size: 14px;
  border-radius: 16px;
  padding: 3px 7px 4px 7px;
  background: var(--color-blue);
  position: absolute;
  right: 10px;
  bottom: -4px;
`

export default class DragIcon extends Component {
  render() {
    return (
      <Drag ref={this.props._ref}>
        <Icon>
          <File />
          <Selected>{this.props.count}</Selected>
        </Icon>
      </Drag>
    )
  }
}
