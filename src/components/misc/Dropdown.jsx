import React, { Component } from "react";
import styled from "styled-components";

const Select = styled.select`
  appearance: none;
  outline: none;
  user-select: all;
  padding: 12px 24px;
  border: 1px solid ${props => props.bg ? this.props.bg : `var(--color-black)`};
  border-radius: 24px;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
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

export const DropdownItem = styled.option`

`

export default class Dropdown extends Component {
  render() {
    return (
      <Select {...this.props}>
        {this.props.children}
      </Select>
    )
  }
}
