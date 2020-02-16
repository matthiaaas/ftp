import React, { Component } from "react";

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
              <div className="item server">
                <div className="inner">
                  <span>root@example.com</span>
                  <div className="status online"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Taskbar;
