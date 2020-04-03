import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`

const CircleSvg = styled.svg`
  display: inline-block;
  position: absolute;
  top: ${props => props.inner ? `10px` : `0`};
  left: ${props => props.inner ? `10px` : `0`};
  width: ${props => props.inner ? `100px` : `120px`};
  height: ${props => props.inner ? `100px` : `120px`};
`

const Circle = styled.path.attrs(props => ({
  style: {
    strokeDasharray: props.percentage * 100 + `, 100`
  }
}))`
  transition: all ease-out 0.4s;
  stroke: ${props => props.color || `var(--color-blue)`};
  fill: none;
  stroke-width: 0.75;
  stroke-linecap: round;
`

const Placeholder = styled.path`
  stroke: var(--color-dark-light);
  top: 0;
  left: 0;
  fill: none;
  stroke-width: 0.75;
  stroke-linecap: round;
`

const Icon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -22px 0 0 -22px;
  color: var(--color-blue);
  padding: 12px;
  box-sizing: border-box;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-blue-blur);

  svg {
    width: 20px;
    height: 20px;
  }
`

export default class CircularChart extends Component {
  render() {
    return (
      <Wrapper>
        <CircleSvg viewBox="0 0 36 36">
          <Placeholder
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <Circle 
            percentage={this.props.outer.percentage}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </CircleSvg>
        <CircleSvg inner viewBox="0 0 36 36">
          <Placeholder
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <Circle
            color="var(--color-white)"
            percentage={this.props.inner.percentage}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </CircleSvg>
        <Icon>
          {this.props.icon}
        </Icon>
      </Wrapper>
    )
  }
}
