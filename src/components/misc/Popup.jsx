import React, { Component } from "react";
import styled from "styled-components";

import { GoBack } from "./CircleButton";
import Headline from "./Headline";
import KeyEvents from "./KeyEvents";

const Wrapper = styled.div`
  z-index: 11;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: ${props => props.hidden ? `none` : `flex`};
  align-items: center;
  justify-content: center;
  background: var(--color-dark-blur);
`

const Space = styled.div`
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const Body = styled.div`
  z-index: 11;
  padding: 36px 48px;
  color: var(--color-grey);
  border: 1px solid var(--color-dark-grey);
  border-radius: 8px;
  background: var(--color-dark);
`

const Back = styled.div`
  display: inline-block;
`

const Header = styled.div`
  margin-top: 16px;
`

const Content = styled.div`

`

export default class Popup extends Component {
  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.handleShortcut = this.handleShortcut.bind(this);
  }

  handleShortcut(key, code) {
    if (code === 27) this.close();
  }

  close() {
    if (typeof this.props.onClose === "function") {
      this.props.onClose.call(this);
    }
  }

  render() {
    return (
      <Wrapper>
        <KeyEvents
          onKeys={this.handleShortcut}
        />
        <Body {...this.props}>
          <Back onClick={this.close}>
            <GoBack bg="var(--color-black)" bgHover="var(--color-dark-light)" />
          </Back>
          <Header>
            <Headline>{this.props.headline}</Headline>
            <Content>
              {this.props.children}
            </Content>
          </Header>
        </Body>
        <Space onClick={this.close} />
      </Wrapper>
    )
  }
}
