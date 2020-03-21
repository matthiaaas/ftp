import React, { Component } from "react";
import styled from "styled-components";

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
  transition: ${props => props.progress >= 1 && `visibility 0s ease 2s`};
  visibility: ${props => props.progress >= 1 || props.progress === 0 ? `hidden` : `visible`};
  background: var(--color-black);
`

const Title = styled.div`
  z-index: 3;
  position: relative;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Label = styled.span`
  color: var(--color-grey);
`

const Number = styled.span`
  color: ${props => props.highlighted && `white`};
  font-family: var(--font-code);
`

const Progress = styled.div`
  z-index: 2;
  position: absolute;
  transition: transform 0.2s ease;
  transform: ${props => `translateX(${props.progress * 100 - 100}%)`};
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: var(--color-dark);

  &::before {
    content: "";
    position: absolute;
    bottom: 16px;
    left: 0;
    width: 100%;
    height: 1.8px;
    transition: background 0.8s ease 0.6s;
    background: ${props => props.progress >= 1 ? `var(--color-green)` : `var(--color-blue)`};
  }
`

export default class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      current: 0,
      max: 0
    }

    this.updateProgress = this.updateProgress.bind(this);
  }

  updateProgress(current, max) {
    this.setState({
      progress: current / max,
      current: current,
      max: max
    })
  }

  render() {
    return (
      <Wrapper progress={this.state.progress}>
        <Title>
          <Label>Uploading</Label>
          <Label>
            <Number highlighted>{this.state.current}</Number> of <Number>{this.state.max}</Number>
          </Label>
        </Title>
        <Progress progress={this.state.progress} />
      </Wrapper>
    )
  }
}
