import React, { Component } from "react";
import styled from "styled-components";

const process = window.require("process");

const isMac = process.platform === "darwin";

const Wrapper = styled.li`
  padding: 6px 24px;
  display: flex;
  align-items: center;
  min-width: 200px;
  height: 20px;
  color: ${props => props.disabled ? `var(--color-grey-dark) !important` : `inherit`};

  >span:last-child div {
    background: ${props => props.disabled && `var(--color-dark-grey-blur) !important`};
  }

  &:hover {
    color: ${props => props.disabled || `var(--color-grey-light)`};
    background: ${props => props.disabled || `var(--color-dark)`};

    >span:last-child div {
      background: ${props => props.disabled || `var(--color-dark-light)`};
    }
  }

  &:active {
    background: ${props => props.disabled || `var(--color-dark-grey-blur)`};
  }
`

const Name = styled.span`
  flex: 8;
`

const Shortcut = styled.span`
  text-align: right;
  flex: 6;
`

const Key = styled.div`
  width: ${props => props.long ? "auto" : `16px`};
  height: 16px;
  padding: 2px ${props => props.long && "4px"};
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
        {this.props.shortcut &&
          <Shortcut>
            {this.props.shortcut.split("").map((key, index) => {
              key = key.replace("⌘", isMac ? "⌘" : "ctrl");
              return (
                <Key key={index} long={key.length > 1}>{key}</Key>
              )
            })}
          </Shortcut>
        }
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
