import React, { Component } from "react";
import styled from "styled-components";

export const ThemeSwitch = styled.div`
  display: flex;
  align-items: center;
`

export const ThemeItem = styled.div`
  cursor: pointer;
  overflow: hidden;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid ${props => props.active ? `var(--color-blue)` : `transparent`};
  background: ${props => props.color2};

  &:not(:last-child) {
    margin-right: 12px;
  }
`

export const ThemeItemHeader = styled.div`
  width: 100%;
  padding: 8px 8px 6px 8px;
  display: flex;
  align-items: center;
  background: ${props => props.color1};
`

export const ThemeItemHeaderClose = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.color};

  &:not(:last-child) {
    margin-right: 4px;
  }
`

export class Theme extends Component {
  render() {
    return (
      <ThemeItem {...this.props}
        onClick={(event) => {
          if (!this.props.active) {
            this.props.onSelect.call(this, this.props.id);
          }
        }}
      >
        <ThemeItemHeader color1={this.props.color1}>
          <ThemeItemHeaderClose color="var(--color-red)" />
          <ThemeItemHeaderClose color="var(--color-yellow)" />
          <ThemeItemHeaderClose color="var(--color-green)" />
        </ThemeItemHeader>
      </ThemeItem>
    )
  }
}
