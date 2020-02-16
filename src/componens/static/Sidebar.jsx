import React, { Component } from "react";

import { Cloud, Terminal, PieChart, Sliders } from "react-feather";
import { Link } from "react-router-dom";

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: window.location.pathname
    }
  }

  changeActive(location) {
    this.setState({active: location.pathname});
  }

  render() {
    const menuItems = [
      {
        name: "Session",
        loc: "/session",
        icon: <Cloud />
      },
      {
        name: "Terminal",
        loc: "/terminal",
        icon: <Terminal />
      },
      {
        name: "Statistics",
        loc: "/stats",
        icon: <PieChart />
      },
      {
        name: "Settings",
        loc: "/settings",
        icon: <Sliders />
      }
    ]

    return (
      <aside id="sidebar">
        <div className="content">
          <ul className="nav">
            {menuItems.map((item, index) => {
              return (
                <li key={index}>
                  <Link to={item.loc} className={item.loc === this.state.active ? "active" : {}}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
