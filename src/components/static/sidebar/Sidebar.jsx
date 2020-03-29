import React, { Component } from "react";
import { Redirect } from "react-router";

import { Cloud, Terminal, PieChart, Sliders } from "react-feather";

import KeyEvents from "../../misc/KeyEvents";

import { Aside, Content } from "./styles";

import Nav, { NavItem } from "./components/Nav";

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: window.location.pathname,
      redirect: undefined,
      keys: []
    }

    this.changeActive = this.changeActive.bind(this);
    this.handleShortcut = this.handleShortcut.bind(this)
  }

  changeActive(location) {
    this.setState({ active: location.pathname });
  }

  handleShortcut(key) {
    let redirect = this.state.redirect;

    if (this.state.keys.cmd) {
      switch (key) {
        case "l":
          redirect = "/"
          break;
        case "s":
          redirect = "/session"
          break;
        case "t":
          redirect = "/terminal"
          break;
        case ",":
          redirect = "/settings"
          break;
        case "b":
          redirect = "/quickconnect"
          break;
        default:
          break;
      }
    }

    this.setState({
      redirect: redirect
    })
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
        <KeyEvents
          onModifierKeys={(keys) => {
            this.setState({
              keys: keys
            })
          }}
          onKeys={this.handleShortcut}
        />
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
        {this.state.redirect &&
          <Redirect to={this.state.redirect} />
        }
      </Aside>
    )
  }
}

export default Sidebar;
