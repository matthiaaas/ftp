import React, { Component, createRef } from "react";
import styled from "styled-components";

import { Folder as FolderIcon } from "react-feather";

import DragIcon from "./DragIcon.jsx";

import { toAccurateDate } from "../../../assets/utils/utils.js";

const Wrapper = styled.div`
  user-select: none;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 7px 20px;
  border: 1px solid ${props => props.dropping || props.selected ? `var(--color-blue) !important` : `transparent`};
  border-radius: 12px;
  outline: none;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.dropping || props.selected ? `var(--color-white) !important` : `var(--color-grey)`};
  background: ${props => props.selected ? `var(--color-blue-blur) !important` : `var(--color-dark)`};

  * {
    pointer-events: none;
  }
  
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
  flex: ${props => props.priority || `1`};  
  display: inline-block;
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

    this.dragIcon = createRef();

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(event) {
    this.setState({ dropping: false });
    let transfer = event.dataTransfer;
    const isNative = Boolean(transfer.getData("native"));
    if (isNative) {
      let files = JSON.parse(transfer.getData("nativeFiles"));
      this.props.onMove.call(this, files, this.props.folder.path + this.props.folder.name + "/", this.props.onReload)
    } else {
      this.props.onUpload.call(
        this, transfer,
        this.props.folder.path + this.props.folder.name + "/",
        () => {},
        this.props.onProgress
      );
    }
  }

  render() {
    const timestamp = toAccurateDate(this.props.folder.time);

    return (
      <Wrapper
        draggable
        dropping={this.state.dropping}
        selected={this.props.selected}
        onDragStart={(event) => {
          event.dataTransfer.setData("native", "true")
          let files = [this.props.folder]
          if (this.props.selection.includes(this.props.folder)) {
            files = this.props.selection;
            if (this.props.selection.length > 1) {
              event.dataTransfer.setDragImage(this.dragIcon.current, 16, 16)
            }
          }
          event.dataTransfer.setData("nativeFiles", JSON.stringify(files))
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          this.setState({ dropping: true });
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={this.onDrop}
        onDragLeave={(event) => {
          event.preventDefault();
          this.setState({ dropping: false });
        }}
        onClick={this.props.onClick}
        onContextMenu={(event) => {
          event.preventDefault();
          this.props.onContext.call(this, event, this.props.folder);
        }}
      >
        <FolderIcon />
        <Info priority={3}>{this.props.folder.name}</Info>
        <Info right></Info>
        <Info right>{timestamp.day + "/" + timestamp.month + "/" + timestamp.year}</Info>
        <DragIcon
          _ref={this.dragIcon}
          count={this.props.selection.length}
        />
      </Wrapper>
    )
  }
}
