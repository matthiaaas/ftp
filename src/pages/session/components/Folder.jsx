import React, { Component } from "react";
import styled from "styled-components";

import { Folder as FolderIcon } from "react-feather";

import { toAccurateDate } from "../../../assets/utils/utils.js";

const Wrapper = styled.div`
  user-select: none;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 7px 20px;
  border: 1px solid ${props => props.dropping ? `var(--color-blue) !important` : `transparent`};
  border-radius: 12px;
  outline: none;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.dropping ? `var(--color-white) !important` : `var(--color-grey)`};
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

export default class Folder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropping: false
    }
  }

  onDropEnter() {

  }

  render() {
    const timestamp = toAccurateDate(this.props.folder.time);

    return (
      <Wrapper
        dropping={this.state.dropping}
        onDragEnter={(event) => {
          event.preventDefault();
          this.setState({ dropping: true });
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          this.props.onUpload.call(this, event.dataTransfer.files, this.props.folder.path + this.props.folder.name + "/", () => {});
          this.setState({ dropping: false });
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          this.setState({ dropping: false });
        }}
        onClick={(event) => {
          this.props.onEnter.call(this, this.props.folder.name);
        }} onContextMenu={(event) => {
          event.preventDefault();
          this.props.onContext.call(this, event, this.props.folder);
        }}
      >
        <FolderIcon />
        <Info priority={3}>{this.props.folder.name}</Info>
        <Info right></Info>
        <Info right>{timestamp.day + "/" + timestamp.month + "/" + timestamp.year}</Info>
      </Wrapper>
    )
  }
}
