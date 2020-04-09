import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  transition: all 0s;
  transition-delay: ${props => props.dropping ? `0.3s` : `0s`};
  position: fixed;
  z-index: 0;
  top: 0;
  left: 201px;
  width: calc(100vw - 201px);
  height: 100vh;

  border-left: 1px solid ${props => props.dropping ? `var(--color-blue)` : `transparent`};
`

export default class Space extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropping: false
    }
  }

  render() {
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
          this.setState({ dropping: false });
          let transfer = event.dataTransfer;
          const isNative = Boolean(transfer.getData("native"));
          if (!isNative) {
            this.props.onUpload.call(this,
              transfer,
              this.props.path,
              this.props.onReturn,
              this.props.onProgress
            );
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          this.setState({ dropping: false });
        }}
        onClick={this.props.onClick}
        onContextMenu={(event) => {
          event.preventDefault();
          this.props.onContext.call(this, event);
        }}
      />
    )
  }
}
