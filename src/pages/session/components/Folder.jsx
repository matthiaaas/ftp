import React, { Component } from "react";

import { Folder as FolderIcon } from "react-feather";

import { toAccurateDate } from "../../../assets/utils/utils.js";

class Folder extends Component {
  render() {
    const timestamp = toAccurateDate(this.props.folderTimestamp);

    return (
      <div tabIndex="1" className="file" onDragEnter={(event) => {
        event.preventDefault();
        event.target.classList.add("dropping");
      }} onDragOver={(event) => {
        event.preventDefault();
      }} onDrop={(event) => {
        this.props.onUpload.call(this, event.dataTransfer.files, this.props.folderName);
        event.target.classList.remove("dropping");
      }} onDragLeave={(event) => {
        event.target.classList.remove("dropping");
      }} onClick={(event) => {
        this.props.onEnter.call(this, this.props.folderName);
      }} onContextMenu={(event) => {
        event.preventDefault();
        this.props.onContext.call(this, event, this.props.folderName);
      }}>
        <FolderIcon />
        <span className="name">{this.props.folderName}</span>
        <span className="size">{/* this.props.folderSize */}</span>
        <span className="timestamp">
          {timestamp.day + "/" + timestamp.month + "/" + timestamp.year}
        </span>
      </div>
    );
  }
}

export default Folder;
