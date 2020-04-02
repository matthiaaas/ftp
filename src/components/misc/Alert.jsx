import React, { Component } from "react";
import styled from "styled-components";
import { X } from "react-feather";

const Wrapper = styled.div`
  z-index: 100;
  transition: transform 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  justify-content: center;
  transform: translateY(-100%);
  color: var(--color-white);
  display: flex;
`

const Body = styled.div`
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
  color: inherit;
`

const Time = styled.div`
  bottom: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 1px;
  animation: ${props => props.hidden || `progress 9s linear 0.1s 1`};
  background: var(--color-red);

  @keyframes progress {
    from {
      transform: translateX(0);
    } to {
      transform: translateX(-100%);
    }
  }
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

    this.setState({ hidden: true })

    setTimeout(() => {
      this.setState({
        text: text.toString(),
        isError: isError || true,
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
        isError={this.state.isError}
        style={{transform: this.state.hidden || "translateY(0)"}}
      >
        <Body>
          <Header>
            <Text>{this.state.text}</Text>
            <Dismiss onClick={this.close}><X /></Dismiss>
          </Header>
          <Time hidden={this.state.hidden} />
        </Body>
      </Wrapper>
    )
  }
}
