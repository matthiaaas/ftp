import React, { Component } from "react";

import { Folder as FolderIcon } from "react-feather";

class File extends Component {
  render() {
    return (
      <div tabIndex="1" className="file" onDragEnter={(event) => {
        event.preventDefault();
        event.target.classList.add("dropping");
      }} onDragOver={(event) => {
        event.preventDefault();
      }} onDrop={(event) => {
        // alert(event.dataTransfer.files[0].path);
        this.props.onUpload.call(this, event.dataTransfer.files);
        event.target.classList.remove("dropping");
      }} onDragLeave={(event) => {
        event.target.classList.remove("dropping");
      }} onClick={(event) => {
        this.props.onEnter.call(this, this.props.folderName);
      }}>
        <FolderIcon />
        <span className="name">{this.props.folderName}</span>
        <span className="size"></span>
      </div>
    );
  }
}

export default File;
