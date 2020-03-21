import React, { Component } from "react";
import styled from "styled-components";

import { ArrowLeft } from "react-feather";

const Wrapper = styled.div`
  transition: all ease 0.1s;
  border-radius: 50%;
  padding: 6px 6px 3px 6px;
  display: inline-block;
  background: ${props => props.bg ? props.bg : `var(--color-dark)`};

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: var(--color-grey-light);
    background: ${props => props.bgHover ? props.bgHover : `var(--color-black)`};
  }

  &:active {
    color: var(--color-grey);
  }
`

export default class GoBack extends Component {
  render() {
    return (
      <Wrapper
        bg={this.props.bg}
        bgHover={this.props.bgHover}
        onClick={(event) => {
          event.preventDefault();
          if (typeof this.props.onTrigger === "function") {
            this.props.onTrigger.call(this);
          }
        }}
      >
        <ArrowLeft />
      </Wrapper>
    )
  }
}
