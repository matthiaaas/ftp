import React, { Component } from "react";
import styled from "styled-components";

import { MoreVertical, GitCommit, Shield, Lock, ShieldOff, Unlock, Key } from "react-feather";

const Wrapper = styled.div`
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  border: 1px solid ${props => props.connected ? `var(--color-grey-dark)`: `transparent`};
  border-radius: 8px;
  min-width: 280px;
  margin: 12px;
  flex: 0 1 310px;
  width: 100%;
  background: ${props => props.connected ? `var(--color-dark-grey-blur)` : `var(--color-dark)`};

  &:hover {
    border: 1px solid ${props => props.connected || `var(--color-blue)`};
    background: ${props => props.connected ? `var(--color-dark-grey-blur)` : `var(--color-black)`};
  }

  &:active {
    background: ${props => props.connected || `var(--color-dark)`};
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-grey-dark);
`

const Group = styled.div`
  display: flex;
  align-items: center;
`

const Name = styled.span`
  max-width: 200px;
  height: 17px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden visible;
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
  position: relative;
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

const Dropdown = styled.ul`
  display: ${props => props.toggled ? `block` : `none`};
  position: absolute;
  top: 0;
  right: 28px;
  border-radius: 8px;
  border: 1px solid var(--color-dark-light);
  overflow: hidden;
  width: 148px;
  background: var(--color-black);
`

const DropdownItem = styled.li`
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  padding: 8px 24px;
  color: ${props => props.delete ? `var(--color-red)` : `var(--color-grey)`};

  &:hover {
    color: ${props => props.delete ? `var(--color-red)` : `var(--color-grey-light)`};
    background: ${props => props.delete ? `var(--color-red-blur)` : `var(--color-dark-light)`};
  }
`

const Separator = styled.hr`
  margin: 0;
  border: none;
  height: 1px;
  background: var(--color-dark-grey);
`

export default class Connection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    }

    this.connect = this.connect.bind(this);
    this.delete = this.delete.bind(this);
  }

  connect() {
    if (!this.props.connected) {
      this.props.onConnect.call(this, {
        host: this.props.name,
        port: this.props.port,
        user: this.props.user,
        pass: this.props.pass,
        key: this.props.keyData,
        protocol: this.props.protocol
      });
    }
  }

  delete() {
    let connections = JSON.parse(window.localStorage.getItem("registered_connections"));

    connections.splice(this.props.id, 1);

    window.localStorage.setItem("registered_connections", JSON.stringify(connections));

    this.props.onDelete.call(this)
  }

  render() {
    return (
      <Wrapper
        connected={this.props.connected}
        onClick={this.connect}
      >
        <Header>
          <Group>
            <Name>{this.props.user && this.props.user + "@" + this.props.name}</Name>
            <ServerStatus connected={this.props.connected} />
          </Group>
          <Menu
            onClick={(event) => {
              event.stopPropagation();
              this.setState({ editing: !this.state.editing });
            }}
          >
            <MoreVertical />
            <Dropdown toggled={this.state.editing}>
              <DropdownItem onClick={this.connect}>Connect</DropdownItem>
              <Separator />
              <DropdownItem onClick={this.delete} delete>Delete</DropdownItem>
            </Dropdown>
          </Menu>
        </Header>
        <Body>
          <Group>
            <Item>
              <GitCommit />
              <span>{this.props.port}</span>
            </Item>
            <Item>
              {this.props.protocol === "ftp" ? <ShieldOff /> : <Shield />}
              <span>{this.props.protocol.toUpperCase()}</span>
            </Item>
          </Group>
          <Item>
            {this.props.keyData ? <Key /> : this.props.password ? <Unlock /> : <Lock /> }
          </Item>
        </Body>
      </Wrapper>
    )
  }
}
