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
  display: inline-block;
  position: relative;
  /* background: var(--color-blue-blur); */

  &:hover >div {
    transition: all 0s;
    transition-delay: 1s;
    transform: scaleY(1);
  }
`

export const TagTooltip = styled.div`
  position: absolute;
  z-index: 9 !important;
  bottom: calc(100% + 12px);
  left: 50%;
  margin-left: -124px;
  width: 224px;
  padding: 8px 12px;
  line-height: 1.2;
  border-radius: 4px;
  font-size: 16px;
  text-transform: initial;
  color: var(--color-grey);
  background: var(--color-black);
  transform: scaleY(0);

  &::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: var(--color-black) transparent transparent transparent;
  }
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
