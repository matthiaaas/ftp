import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 42px;
  height: 22px;
`

const Switch = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`

const Slider = styled.div`
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  border: 1px solid ${props => props.toggled ? `var(--color-blue)` : `var(--color-grey-dark)`};
  background: ${props => props.toggled ? `var(--color-blue)` : `var(--color-dark-grey-blur)`};

  &:hover {
    background: ${props => props.toggled || `var(--color-dark-grey)`};
  }

  &:active {
    background: ${props => props.toggled || `var(--color-dark-grey-blur)`};
  }

  &::before {
    content: "";
    transition: all ease 0.2s;
    position: absolute;
    top: 3px;
    left: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    transform: ${props => props.toggled && `translateX(18px)`};
    box-shadow: 2px 2px 8px var(--color-dark-blur);
    background: ${props => props.toggled ? `white` : `var(--color-blue)`};
  }
`

export default class Toggle extends Component {
  render() {
    return (
      <Wrapper {...this.props}>
        <Switch type="checkbox" />
        <Slider toggled={this.props.toggled} />
      </Wrapper>
    )
  }
}
