import React, { Component } from "react";
import styled from "styled-components";

import { ArrowLeft } from "react-feather";

const Wrapper = styled.div`
  transition: all ease 0.1s;
  border-radius: 50%;
  padding: 6px 6px 3px 6px;
  background: ${props => props.bg ? props.bg : `var(--color-dark)`};

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: var(--color-grey-light);
    background: ${props => props.bgHover ? props.bgHover : `var(--color-black)`};
  }
`

export default class GoBack extends Component {
  render() {
    return (
      <Wrapper
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
