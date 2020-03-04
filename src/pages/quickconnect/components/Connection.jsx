import React, { Component } from "react";
import styled from "styled-components";

import { MoreVertical, GitCommit, Shield, Lock } from "react-feather";

const Wrapper = styled.div`
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  border: 1px solid ${props => props.connected ? `var(--color-dark-grey)`: `transparent`};
  border-radius: 8px;
  min-width: 224px;
  margin: 12px;
  flex: 1;
  background: ${props => props.connected ? `var(--color-dark-grey-blur)` : `var(--color-dark)`};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-dark-grey);
`

const Group = styled.div`
  display: flex;
  align-items: center;
`

const Name = styled.span`
  color: var(--color-white);
`

const ServerStatus = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin: 0 -4px 0 8px;

  background: ${props => props.connected ? `var(--color-green)` : `none`};
`

const Menu = styled.div`
  color: var(--color-grey);

  &:hover {
    color: var(--color-grey-light);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const Body = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-grey);

  &:not(:last-child) {
    margin-right: 24px;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  span {
    margin-left: 8px;
  }
`

export default class Connection extends Component {
  render() {
    return (
      <Wrapper connected={this.props.connected}>
        <Header>
          <Group>
            <Name>{this.props.name}</Name>
            <ServerStatus connected={this.props.connected} />
          </Group>
          <Menu>
            <MoreVertical />
          </Menu>
        </Header>
        <Body>
          <Group>
            <Item>
              <GitCommit />
              <span>{this.props.port}</span>
            </Item>
            <Item>
              <Shield />
              <span>{this.props.protocol}</span>
            </Item>
          </Group>
          <Item>
            <Lock />
          </Item>
        </Body>
      </Wrapper>
    )
  }
}
