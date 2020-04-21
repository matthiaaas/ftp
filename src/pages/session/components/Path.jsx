import React, { Component } from "react";
import styled from "styled-components";

import { GoBack } from "../../../components/misc/CircleButton";

const Wrapper = styled.div`
  z-index: 3;
  position: fixed;
  padding: 28px 0 20px 0;
  color: var(--color-grey);
  display: inline-flex;
  align-items: center;
  width: 100%;
  background: var(--color-dark-light);
`

const Url = styled.div`
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: 8px;
`

const Dir = styled.div`
  border-radius: 4px;
  padding: 4px 4px;
  position: relative;
  white-space: nowrap;
  color: ${props => props.dropping ? `var(--color-white)` : `var(--color-grey)`};
  border: 1px solid ${props => props.dropping ? `var(--color-blue)` : `transparent`};
  background: ${props => props.dropping && `var(--color-blue-blur)`}; 

  &:hover {
    color: var(--color-grey-light);

    &:first-child&::after {
      opacity: 1;
    }
  }

  &:active {
    color: var(--color-grey);

    &:first-child&::after {
      opacity: 0.5;
    }
  }

  &::after {
    content: "/";
    right: -4px;
    position: absolute;
    opacity: 0.5;
    color: var(--color-grey) !important;
  }
`

class Directory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropping: false
    }

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(event) {
    this.setState({ dropping: false });
    let transfer = event.dataTransfer;
    const isNative = Boolean(transfer.getData("native"));
    if (isNative) {
      let files = JSON.parse(transfer.getData("nativeFiles"));
      if (files[0].path !== this.props.path) {
        this.props.onMove.call(this, files, this.props.path, this.props.onReload)
      }
    } else {
      this.props.onUpload.call(
        this, transfer,
        this.props.path,
        () => {},
        this.props.onProgress
      );
    }
  }

  render() {
    return (
      <Dir
        dropping={this.state.dropping}
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
        onClick={() => {
          this.props.onJumpTo.call(this, this.props.path)
        }}
      >
        {this.props.dir || " "}
      </Dir>
    )
  }
}

export default class Path extends Component {
  render() {
    let dirs = this.props.path.split("/").slice(0, -1);

    return (
      <Wrapper>
        <GoBack onTrigger={this.props.onGoBack} />
        <Url>
          {dirs.map((dir, index) => {
            let path = dirs.slice(0, index + 1).join("/") + "/";

            return (
              <Directory
                key={index}
                dir={dir}
                path={path}
                onJumpTo={this.props.onJumpTo}
                onMove={this.props.onMove}
                onUpload={this.props.onUpload}
                onProgress={this.props.onProgress}
                onReload={this.props.onReload}
              />
            )
          })}
        </Url>
      </Wrapper>
    )
  }
}
