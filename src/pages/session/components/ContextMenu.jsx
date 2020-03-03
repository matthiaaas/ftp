import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.li`
  padding: 4px 24px;
  display: flex;
  align-items: center;
  min-width: 200px;
  color: ${props => props.disabled ? `var(--color-dark-light)` : `inherit`};

  &:hover {
    color: ${props => props.disabled ? `none` : `var(--color-grey-light)`};
    background: ${props => props.disabled ? `none` : `var(--color-dark)`};
  }
`

const Name = styled.span`
  flex: 3;
`

const Shortcut = styled.span`
  text-align: right;
  flex: 1;
`

export default class ContextMenuItem extends Component {
  render() {
    return (
      <Wrapper disabled={this.props.disabled} onClick={(event) => {
        if (!this.props.disabled) {
          this.props.onExecute.call(this);
        }
      }}>
        <Name>{this.props.children || this.props.name}</Name>
        <Shortcut>{this.props.shortcut}</Shortcut>
      </Wrapper>
    )
  }
}

const Hr = styled.hr `
  margin: 8px 25px;
  border: none;
  height: 1px;
  background: var(--color-grey);
`

export class Separator extends Component {
  render() {
    return (
      <Hr />
    )
  }
}
