import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.li`
  transition: all ease 0.2s;
  color: ${props => props.active ? `var(--color-white)` : `var(--color-grey)`};
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  padding: 15px 32px 16px 32px;
  background: ${props => props.active ? `var(--color-dark-light)` : `none`};

  &:not(:last-child) {
    border-right: 1px solid var(--color-dark-grey);
  }

  /* visual hack */
  &:first-child {
    padding-left: 34px;
  }

  svg {
    color: ${props => props.active ? `var(--color-blue) !important` : `inherit`};
  }

  &:hover {
    color: ${props => props.active || `var(--color-grey-light)`};
    background: ${props => props.active || `var(--color-black)`};
  }
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

export default class TabItem extends Component {
  render() {
    return (
      <Wrapper
        active={this.props.active}
        onClick={(event) => {
          if (!this.props.active) {
            this.props.onNavigate.call(this, this.props.loc);
          }
        }}
      >
        <Icon>{this.props.icon}</Icon>
        <Text>{this.props.name}</Text>
      </Wrapper>
    )
  }
}
