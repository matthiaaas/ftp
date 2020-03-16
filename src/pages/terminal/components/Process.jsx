import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  font-family: var(--font-main);
  font-size: 16px;

  &:not(:first-child) {
    margin-top: 12px;
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
  color: var(--color-grey);
  width: 100%;
  background: none;

  &:read-only {
    cursor: default;
  }
`

const Output = styled.div`
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
      cmd: "",
      output: [],
      isRunning: false
    }

    this.ftp = this.props.ftp;

    this.execute = this.execute.bind(this);
  }

  execute(cmd) {
    this.ftp.raw(cmd, (err, data) => {
      let output = this.state.output;
      if (err) {
        output.push({ content: err.toString(), isError: true })
        this.setState({ output: output })
      } else {
        output.push({ content: data.text, isError: false })
        this.setState({ output: output })
      }
      this.props.onFinished.call(this);
    })
  }

  render() {
    return (
      <Wrapper>
        <Prompt>
          <Connection>{this.props.user}{this.props.host && "@"}{this.props.host}</Connection>
          <Tree>~{this.props.path === undefined || this.props.path === "/" ? "$" : this.props.path + "/"}</Tree>
          <Input
            onChange={(event) => {
              this.setState({ cmd: event.target.value })
            }}
            onKeyDown={(event) => {
              if (event.keyCode === 13) {
                if (event.target.value === "" || event.target.value === " ") return;
                this.execute(event.target.value);
                this.setState({ isRunning: true });
                event.target.readOnly = true;
              }
            }}
            tabIndex={this.state.isRunning}
            autoFocus
          />
        </Prompt>
        <Output>
          {this.state.output.map((item, index) => {
            return (
              <Line key={index} isError={item.isError}>{item.content}</Line>
            )
          })}
        </Output>
      </Wrapper>
    )
  }
}
