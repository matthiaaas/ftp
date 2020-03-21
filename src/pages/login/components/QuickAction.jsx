import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.li`
  cursor: default;
  display: flex;
  align-items: center;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  padding: 5px 12px;
  border: 1px solid transparent;
  border-radius: 16px;
  white-space: nowrap;
  color: ${props => props.disabled ? `var(--color-dark-light) !important` : `var(--color-grey)`};

  svg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    color: inherit;
  }

  &:not(:last-child) {
    margin-right: 16px;
  }

  &:hover {
    border: 1px solid ${props => props.disabled || `var(--color-dark-grey)`};
    color: var(--color-grey-light);
  }

  &:active {
    background: ${props => props.disabled || `var(--color-dark-grey-blur)`};
  }
`

export default class QuickAction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      executed: this.props.disabled
    }
  }

  render() {
    return (
      <Wrapper
        disabled={this.state.executed}
        onClick={(event) => {
          if (!this.props.disabled && !this.state.executed && typeof this.props.onAction === "function") {
            this.props.onAction.call(this, event);
            this.setState({ executed: true });
          }
        }}
      >
        {this.props.children}
      </Wrapper>
    )
  }
}
