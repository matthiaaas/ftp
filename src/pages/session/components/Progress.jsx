import React, { Component } from "react";
import styled from "styled-components";

import { Abort } from "../../../components/misc/CircleButton";

const Wrapper = styled.div`
  z-index: 3;
  position: fixed;
  overflow: hidden;
  bottom: 36px;
  left: calc(200px + 36px); 
  font-family: var(--font-main);
  font-size: 16px;
  border: 1px solid var(--color-dark-grey);
  border-radius: 8px;
  padding: 16px 24px;
  width: 100%;
  max-width: 186px;
  transition: ${props => props.progress >= 1 && `visibility 0s ease 2.4s, opacity 0.4s ease 2s`};
  visibility: ${props => props.progress >= 1 || props.progress < 0 ? `hidden` : `visible`};
  opacity: ${props => props.progress >= 1 || props.progress < 0 ? `0` : `1`};
  background: var(--color-black);
`

const Title = styled.div`
  z-index: 2;
  position: relative;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Actions = styled.ul`
  transition: all ease 0.3s;
  z-index: 3;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  width: 100%;
  height: 100%;
  background: transparent;

  &:hover {
    background: var(--color-dark-blur);

    >li {
      transition: opacity 0.2s ease 0.1s, transform 0.2s ease-out 0.1s;
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const Action = styled.li`
  visibility: hidden ${props => props.disabled && `!important`};
  opacity: 0;
  transform: translateY(8px);
  margin-right: 16px;
  color: var(--color-grey);

  &:last-child {
    margin-right: 24px;
  }
`

const Label = styled.span`
  color: var(--color-grey);
`

const Number = styled.span`
  color: ${props => props.highlighted && `white`};
  font-family: var(--font-code);
`

const Progress = styled.div`
  z-index: 1;
  position: absolute;
  transition: transform 0.2s ease;
  transform: ${props => `translateX(${props.progress * 100 - 100}%)`};
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: var(--color-dark);

  &::before {
    z-index: inherit;
    content: "";
    position: absolute;
    bottom: 16px;
    left: 0;
    width: 100%;
    height: 1.8px;
    transition: background 0.8s ease 0.6s;
    background: ${props => props.progress >= 1 ? `var(--color-green)` : props.cancelled ? `var(--color-red)` : `var(--color-blue)`};
  }
`

export default class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: -1,
      current: -1,
      max: 0,
      cancelled: false
    }

    this.updateProgress = this.updateProgress.bind(this);
  }

  updateProgress(current, max) {
    let progress = current / max;
    this.setState({
      progress: progress,
      current: current,
      max: max
    })
    if (progress >= 1) {
      setTimeout(() => {
        this.setState({
          progress: -1,
          current: -1,
          max: 0
        })
      }, 2500);
    }
  }

  render() {
    return (
      <Wrapper progress={this.state.progress} cancelled={this.state.cancelled}>
        <Title>
          <Label>Uploading</Label>
          <Label>
            <Number highlighted>{this.state.current === this.state.max ? this.state.current : this.state.current + 1}</Number> of <Number>{this.state.max}</Number>
          </Label>
        </Title>
        <Progress progress={this.state.progress} cancelled={this.state.cancelled} />
        <Actions>
          <Action disabled={this.state.progress >= 1}>
            <Abort
              bg="var(--color-dark-light)"
              bgHover="var(--color-dark-light)"
              onTrigger={(event) => {
                this.props.onAbort.call(this);
                this.setState({
                  cancelled: true,
                  progress: 1
                })
              }}
            />
          </Action>
        </Actions>
      </Wrapper>
    )
  }
}
