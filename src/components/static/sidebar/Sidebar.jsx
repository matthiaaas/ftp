import React, { Component } from "react";

import { Cloud, Terminal, PieChart, Sliders } from "react-feather";

import { Aside, Content } from "./styles";

import Nav, { NavItem } from "./components/Nav";

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: window.location.pathname
    }
  }

  changeActive(location) {
    this.setState({ active: location.pathname });
  }

  render() {
    const navItems = [
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
    ];

    return (
      <Aside>
        <Content>
          <Nav>
            {navItems.map((item, index) => {
              return (
                <NavItem key={index}
                  icon={item.icon}
                  name={item.name}
                  to={item.loc}
                  active={item.loc === this.state.active}
                />
              )
            })}
          </Nav>
        </Content>
      </Aside>
    )
  }
}

export default Sidebar;
