import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.li`
  cursor: default;
  display: flex;
  align-items: center;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  white-space: nowrap;
  color: ${props => props.disabled ? `var(--color-grey-dark) !important` : `var(--color-grey)`};

  &:not(:last-child) {
    margin-right: 8px;
  }

  svg {
    width: 20px;
    height: 20px;
    color: inherit;
  }
  
  &:hover {
    color: var(--color-grey-light);
  }

  &:active {
    color: var(--color-grey);
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
