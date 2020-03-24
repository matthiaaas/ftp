import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.li`
  padding: 6px 24px;
  display: flex;
  align-items: center;
  min-width: 200px;
  color: ${props => props.disabled ? `var(--color-grey-dark)` : `inherit`};

  >span:last-child div {
    background: ${props => props.disabled && `var(--color-dark-grey-blur)`};
  }

  &:hover {
    color: ${props => props.disabled ? `none` : `var(--color-grey-light)`};
    background: ${props => props.disabled ? `none` : `var(--color-dark)`};

    >span:last-child div {
      background: ${props => props.disabled || `var(--color-dark-light)`};
    }
  }
`

const Name = styled.span`
  flex: 5;
`

const Shortcut = styled.span`
  text-align: right;
  flex: 3;
`

const Key = styled.div`
  width: 16px;
  height: 16px;
  padding: 2px;
  text-align: center;
  border-radius: 4px;
  display: inline-block;
  background: var(--color-dark);

  &:not(:last-child) {
    margin-right: 4px;
  }
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
        <Shortcut>
          {this.props.shortcut.split("").map((key, index) => {
            return (
              <Key>{key}</Key>
            )
          })}
        </Shortcut>
      </Wrapper>
    )
  }
}

const Hr = styled.hr `
  margin: 4px 25px;
  border: none;
  height: 1px;
  background: var(--color-dark-grey);
`

export class Separator extends Component {
  render() {
    return (
      <Hr />
    )
  }
}
