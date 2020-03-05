import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.li`
  cursor: default;
  display: flex;
  align-items: center;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.disabled ? `var(--color-dark-light) !important` : `var(--color-grey)`};

  svg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    color: inherit;
  }

  &:not(:last-child) {
    margin-right: 24px;
  }

  &:hover {
    color: var(--color-grey-light);
  }
`

export default class QuickAction extends Component {
  render() {
    return (
      <Wrapper
        disabled={this.props.disabled}
        onClick={(event) => {
          if (!this.props.disabled && typeof this.props.onAction === "function") {
            this.props.onAction.call(this, event);
          }
        }}
      >
        {this.props.children}
      </Wrapper>
    )
  }
}
