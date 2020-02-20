import React, { Component } from "react";

import { FileText as FileIcon } from "react-feather";

class File extends Component {
  render() {
    return (
      <div tabIndex="1" className="file" onDragEnter={(event) => {
        event.preventDefault();
        event.target.classList.add("dropping");
      }} onDragOver={(event) => {
        event.preventDefault();
      }} onDrop={(event) => {
        event.target.classList.remove("dropping");
      }} onDragLeave={(event) => {
        event.target.classList.remove("dropping");
      }} onContextMenu={(event) => {
        event.preventDefault();
        this.props.onContext.call(this, event, this.props.fileName);
      }}>
        <FileIcon />
        <span className="name">{this.props.fileName}</span>
        <span className="size">{this.props.fileSize}</span>
      </div>
    );
  }
}

export default File;
