import React, { Component } from "react";

import { FileText, Image, Volume1, Film } from "react-feather";

import { toAccurateDate } from "../../../assets/utils/utils";

class File extends Component {
  render() {
    let Icon;

    switch (this.props.fileType) {
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

    const timestamp = toAccurateDate(this.props.fileTimestamp);

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
        {
          Icon
        }
        <span className="name">{this.props.fileName}</span>
        <span className="size">{this.props.fileSize}</span>
        <span className="timestamp">
          {timestamp.day + "/" + timestamp.month + "/" + timestamp.year}
        </span>
      </div>
    );
  }
}

export default File;
