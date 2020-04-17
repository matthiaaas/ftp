import React, { Component } from "react";
import styled from "styled-components";
import { X } from "react-feather";
import Button from "./Button";

const Wrapper = styled.div`
  z-index: 100;
  transition: transform 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  justify-content: center;
  transform: translateY(-100%);
  color: var(--color-white);
  display: flex;
`

const Body = styled.div`
  z-index: 100;
  pointer-events: all;
  padding: 16px 24px;
  border-radius: 0 0 8px 8px;
  border: 1px solid var(--color-dark-grey);
  box-sizing: border-box;
  width: 324px;
  overflow: hidden;
  position: relative;
  background: var(--color-black);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Dismiss = styled.div`
  color: var(--color-grey);

  &:hover {
    color: var(--color-grey-light);
  }

  &:active {
    color: var(--color-grey);
  }

  svg {
    margin-left: 12px;
    width: 20px;
    height: 20px;
  }
`

const Text = styled.span`
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  user-select: text;
  color: inherit;
`

const Actions = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
`

const Action = styled.div`
  &:not(:last-child) {
    margin-right: 4px;
  }
`

const Time = styled.div`
  bottom: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 1px;
  animation: ${props => props.hidden || `progress 9s linear 0.1s 1`};
  background: ${props => props.isError ? `var(--color-red)` : `var(--color-blue)`};

  @keyframes progress {
    from {
      transform: translateX(0);
    } to {
      transform: translateX(-100%);
    }
  }
`

const Disable = styled.div`
  z-index: 9;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition-delay: 2s;
  opacity: ${props => props.hidden ? `0` : `0`};
  background: var(--color-dark-blur);
`

export default class Alert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      isError: false,
      hidden: true
    }

    this.delay = 9000;

    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
  }

  show(text, isError) {
    let timestamp = new Date().getTime();
    isError = isError === undefined || isError === true ? true : false;

    this.setState({ hidden: true })

    setTimeout(() => {
      this.setState({
        text: text.toString(),
        isError: isError,
        timestamp: timestamp,
        hidden: false
      })
  
      setTimeout(() => {
        if (this.state.timestamp === timestamp) {
          this.close();
        }
      }, this.delay);
    }, 200)
  }

  close() {
    this.setState({
      hidden: true
    })
  }

  render() {
    return (
      <Wrapper
        hidden={this.state.hidden}
        style={{transform: this.state.hidden || "translateY(0)"}}
      >
        <Body>
          <Header>
            <Text>{this.state.text}</Text>
            <Dismiss onClick={this.close}><X /></Dismiss>
          </Header>
          <Time hidden={this.state.hidden} isError={this.state.isError} />
        </Body>
      </Wrapper>
    )
  }
}


export class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      hidden: true,
      callback: undefined
    }

    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
  }

  show(text, callback) {
    this.setState({
      text: text.toString(),
      callback: callback,
      hidden: false
    })
  }

  submit(confirmed) {
    this.state.callback.call(this, confirmed)
    this.close()
  }

  close() {
    this.setState({
      hidden: true
    })
  }

  render() {
    return (
      <Wrapper
        hidden={this.state.hidden}
        style={{transform: this.state.hidden || "translateY(0)"}}
      >
        <Body>
          <Header>
            <Text>{this.state.text}</Text>
          </Header>
          <Actions>
            <Action>
              <Button variant="button" onClick={() => {this.submit(false)}}>Cancel</Button>
            </Action>
            <Action>
              <Button variant="button" onClick={() => {this.submit(true)}} primary>Ok</Button>
            </Action>
          </Actions>
        </Body>
        <Disable hidden={this.state.hidden} />
      </Wrapper>
    )
  }
}
