import React, { Component } from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

const WrappedLink = styled(Link)`
  transition: all ease 0.1s;
  padding: 13px 24px;
  border: 1px solid transparent;
  border-radius: 27px;
  display: inline-flex;
  align-items: center;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  text-decoration: none;
  color: var(--color-white);
  background: ${props => props.bg ? this.props.bg : `var(--color-dark-light)`};

  &:hover {
    border: 1px solid var(--color-dark-light);
    color: var(--color-grey-light);
    background: var(--color-dark);
  }
`

const WrappedButton = styled.button`

`

const WrappedInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  user-select: all;
  padding: 14px 24px;
  border: 1px solid transparent;
  border-radius: 27px;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  letter-spacing: ${props => props.type === "password" && "3px"};
  text-decoration: none;
  color: var(--color-white);
  display: inline-block;
  background: ${props => props.bg ? this.props.bg : `var(--color-black)`};

  &::placeholder {
    color: var(--color-grey);
  }

  &:focus {
    border: 1px solid var(--color-dark-grey);
  }

  &:invalid {
    border: 1px solid var(--color-red);
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`

export default class Button extends Component {
  render() {
    if (this.props.variant === "button") {
      return null
    } else if (this.props.variant === "input") {
      return (
        <WrappedInput bg={this.props.bg} {...this.props} />
      )
    } else {
      return (
        <WrappedLink bg={this.props.bg} {...this.props}>
          {this.props.children}
        </WrappedLink>
      )
    }
  } 
}
