import React, { Component } from "react";
import styled from "styled-components";

import { Image, Volume1, Film, FileText } from "react-feather";

import { toAccurateDate, toAccurateFileSize, getExactFileType } from "../../../assets/utils/utils.js";

const Wrapper = styled.div`
  user-select: none;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 7px 20px;
  border: 1px solid transparent;
  border-radius: 12px;
  outline: none;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  color: var(--color-grey);
  background: var(--color-dark);
  
  &:not(:last-child) {
    margin-bottom: 8px;
  }

  svg {
    width: 16px;
    height: 16px;
    margin-right: 16px;
  }

  &:hover {
    color: var(--color-grey-light);
    background: var(--color-black);
  }
`

const Info = styled.span`
  flex: ${props => props.priority ? props.priority : `1`};
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 17px;
  text-align: ${props => props.right ? "right" : "left"};

  &:not(:last-child) {
    margin-right: 12px;
  }

  &::-webkit-scrollbar {
    width: 0px;
    display: none;
  }
`

export default class File extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropping: false
    }
  }

  onDropEnter() {

  }

  render() {
    const timestamp = toAccurateDate(this.props.file.time);
    const size = Math.round(
      toAccurateFileSize(this.props.file.size).size * 10
    ) / 10 + " " + toAccurateFileSize(this.props.file.size).unit;
    let Icon;

    switch (getExactFileType(this.props.file.name)) {
      case "img":
        Icon = <Image />
        break;
      case "snd":
        Icon = <Volume1 />
        break;
      case "vid":
        Icon = <Film />
        break;
      default:
        Icon = <FileText />
        break;
    }

    return (
      <Wrapper
        onContextMenu={(event) => {
          event.preventDefault();
          this.props.onContext.call(this, event, this.props.file.name);
        }}
      >
        {Icon}
        <Info priority={3}>{this.props.file.name}</Info>
        <Info right>{size}</Info>
        <Info right>{timestamp.day + "/" + timestamp.month + "/" + timestamp.year}</Info>
      </Wrapper>
    )
  }
}
