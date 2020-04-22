import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { Upload } from "react-feather";

const WrappedLink = styled(Link)`
  transition: all ease 0.1s;
  padding: 13px 24px;
  border: 1px solid transparent;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  text-decoration: none;
  color: var(--color-white);
  background: ${props => props.bg ? this.props.bg : `var(--color-dark-light)`};

  &:hover {
    border-color: var(--color-dark-grey);
    color: var(--color-grey-light);
    background: var(--color-dark);
  }

  &:active {
    background: var(--color-dark-grey-blur);
  }
`

const WrappedButton = styled.button`
  transition: all ease 0.1s;
  appearance: none;
  outline: none;
  padding: 7px 20px;
  border: 1px solid ${props => props.primary ? `var(--color-blue)` : `var(--color-dark-grey)`};
  border-radius: 4px;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  text-decoration: none;
  color: ${props => props.primary ? `var(--color-white)` : `var(--color-grey)`};
  display: inline-block;
  background: ${props => props.primary ? `var(--color-blue)` : `transparent`};

  &:hover {
    color: ${props => props.primary ? `var(--color-white)` : `var(--color-grey-light)`};
    background: ${props => props.primary ? `var(--color-blue-blur)` : `var(--color-dark-grey-blur)`};
  }

  &:active {
    background: ${props => props.primary ? `var(--color-blue)` : `transparent`};
  }
`

const WrappedInput = styled.input`
  appearance: none;
  outline: none;
  user-select: all;
  padding: 12px 24px;
  border: 1px solid ${props => props.bg ? this.props.bg : `var(--color-black)`};
  border-radius: 24px;
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
    border-color: var(--color-dark-grey);
  }

  &:invalid {
    border-color: var(--color-red);
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`

const WrappedBrowse = styled.div`
  appearance: none;
  outline: none;
  user-select: all;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  text-decoration: none;
  color: var(--color-grey);
  width: 200px;
  height: 44px;
  padding-left: 60px;
  box-sizing: border-box;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  position: relative;
  background: transparent;

  &:hover {
    color: var(--color-grey-light);
  }

  &:focus {
    >button {
      border-color: var(--color-dark-grey);
    }
  }
`

const BrowseIcon = styled.button`
  appearance: none;
  outline: none;
  user-select: all;
  pointer-events: none;
  height: 100%;
  width: 44px;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 24px;
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  color: inherit;
  background: var(--color-black);

  svg {
    width: 20px;
    height: 20px;
  }
`

const BrowseInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`

const BrowseText = styled.span`
  pointer-events: none;
  color: ${props => props.invalid ? `var(--color-red)` : props.highlighted ? `var(--color-white)` : `inherit`};
`

export default class Button extends Component {
  render() {
    if (this.props.variant === "button") {
      return (
        <WrappedButton {...this.props}>
          {this.props.children}
        </WrappedButton>
      )
    } else if (this.props.variant === "input") {
      return (
        <WrappedInput bg={this.props.bg} {...this.props} />
      )
    } else if (this.props.variant === "browse") {
      return (
        <WrappedBrowse
          tabIndex={1}
          onChange={this.props.onChange}
          onKeyDown={(event) => {
            if (event.keyCode === 40) {
              let input = event.target.querySelector("input");
              if (input) input.click();
            }
          }}
          onClick={(event) => {
            let input = event.target.querySelector("input");
            if (input) input.click();
          }}
        >
          <BrowseIcon tabIndex={-1}>
            <Upload />
          </BrowseIcon>
          <BrowseInput tabIndex={-1} type="file" />
          <BrowseText invalid={this.props.invalid} highlighted={this.props.defaultValue ? true : false}>{this.props.defaultValue || "Browse..."}</BrowseText>
        </WrappedBrowse>
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
