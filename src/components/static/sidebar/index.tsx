import React from "react";

import { Cloud, Terminal, PieChart, Sliders } from "react-feather";

import NavItem from "./components/NavItem";

import { Aside, Content, Nav } from "./styles";

const navItems = [
  {
    name: "Session",
    to: "/session",
    icon: <Cloud />
  },
  {
    name: "Terminal",
    to: "/terminal",
    icon: <Terminal />
  },
  {
    name: "Statistics",
    to: "/statistics",
    icon: <PieChart />
  },
  {
    name: "Settings",
    to: "/settings",
    icon: <Sliders />
  }
]

function Sidebar(props: {location: any}) {
  return (
    <Aside>
      <Content>
        <Nav>
          {navItems.map((item, index) => {
            return (
              <NavItem
                key={index}
                name={item.name}
                to={item.to}
                icon={item.icon}
                active={props.location.pathname === item.to}
              />
            )
          })}
        </Nav>
      </Content>
    </Aside>
  )
}

export default Sidebar;
