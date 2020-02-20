import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Search } from "react-feather";

class Taskbar extends Component {
  render() {
    return (
      <nav id="taskbar">
        <div className="content">
          <div className="rows">
            <div className="row">
              <div className="item">
                <div className="inner">
                  <Search />
                </div>
                <div className="outer">
                  <span>Search</span>
                </div>
              </div>
            </div>
            <div className="row">
              <Link to="/" className="item server">
                <div className="inner">
                  <span>{this.props.ftpData.host ? this.props.ftpData.host : "/"}</span>
                  <div className={"status " + this.props.ftpStatus}></div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Taskbar;
