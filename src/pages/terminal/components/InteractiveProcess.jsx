import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  font-family: var(--font-main);
  font-size: 16px;

  &:not(:first-child) {
    margin-top: 12px;
  }

  &:last-child {
    margin-bottom: 24px;
  }
`

const Prompt = styled.div`
  display: flex;
  align-items: center;
`

const Connection = styled.span`
  white-space: nowrap;
  color: var(--color-white);
`

const Tree = styled.span`
  margin-left: 4px;
  color: var(--color-blue);
`

const Input = styled.input`
  appearance: none;
  outline: none;
  user-select: all;
  border: none;
  margin-left: 8px;
  font-family: var(--font-code);
  font-size: 15px;
  color: var(--color-grey);
  width: 100%;
  background: none;

  &:read-only {
    cursor: default;
  }
`

const Output = styled.div`
  font-family: var(--font-code);
  font-size: 15px;
  margin-top: 4px;
`

const Line = styled.div`
  white-space: pre-wrap;
  user-select: text;
  line-height: 1.1;
  color: ${props => props.isError ? `var(--color-red)` : `var(--color-grey)`};
`


export default class Process extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRunning: false
    }
  }

  render() {
    return (
      <Wrapper>
        <Prompt>
          <Connection>{this.props.user}{this.props.host && "@"}{this.props.host || "terminal"}</Connection>
          <Tree>{this.props.path ? this.props.path : "~$"}</Tree>
          <Input
            onKeyDown={(event) => {
              if (event.keyCode === 13) {
                let cmd = event.target.value;
                if (cmd === "" || cmd === " ") this.props.onFinished.call(this);
                else this.props.onSubmit.call(this, event.target.value);
                this.state.isRunning = true;
                event.target.readOnly = true;
              }
            }}
            style={{pointerEvents: this.state.isRunning && `none`}}
            tabIndex={(!this.state.isRunning).toString()}
            autoFocus
          />
        </Prompt>
        <Output>
          {this.props.output.map((item, index) => {
            return (
              <Line key={index} isError={item.isError}>{item.text}</Line>
            )
          })}
        </Output>
      </Wrapper>
    )
  }
}
