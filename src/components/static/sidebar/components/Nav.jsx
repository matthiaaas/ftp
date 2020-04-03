import React, { Component } from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

const Wrapper = styled.ul`
  list-style: none;
`

export default class Nav extends Component {
  render() {
    return (
      <Wrapper>
        {this.props.children}
      </Wrapper>
    )
  }
}

const Item = styled.li`
  transition: all ease 0.2s;
  color: ${props => props.active ? `var(--color-white)` : `var(--color-grey)`};
  background: ${props => props.active ? `var(--color-black)` : `none`};

  svg {
    color: ${props => props.active ? `var(--color-blue) !important` : `inherit`};
  }

  &:hover:not(.active) {
    color: var(--color-grey-light);
    background: var(--color-dark-light);
  }
`

const Url = styled(Link)`
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 16px 32px;
  color: inherit;
`

const Icon = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 16px;
  color: var(--color-grey);

  svg {
    width: inherit;
    height: inherit;
    color: inherit;
  }
`

const Text = styled.span`
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
`

export class NavItem extends Component {
  render() {
    return (
      <Item active={this.props.active} className={this.props.active && "active"}>
        <Url to={this.props.to} tabIndex="-1">
          <Icon>{this.props.icon}</Icon>
          <Text>{this.props.name}</Text>
        </Url>
      </Item>
    )
  } 
}
