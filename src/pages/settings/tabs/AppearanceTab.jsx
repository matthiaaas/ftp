import React, { Component } from "react";

import ThemeProvider from "../../../components/ThemeProvider";

import { Tab, Setting, Label, Radios, Radio } from "./styles";

import Settings from "../../../components/localstorage/settings";

import { ThemeSwitch, Theme } from "../components/ThemeSwitch";

export default class AppearanceTab extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings();

    this.state = {
      activeTheme: this.settings.get("theme") || "theme:dark",
      display: "beautiful"
    }

    this.themeProvider = new ThemeProvider();
  }

  render() {
    const themeItems = this.themeProvider.getAllThemes();
    
    const displayOptions = [
      {
        name: "Beautiful",
        id: "beautiful"
      },
      {
        name: "Advanced",
        id: "advanced"
      }
    ]

    return (
      <Tab>
        <Setting>
          <Label>Theme</Label>
          <ThemeSwitch>
            {themeItems.map((item, index) => {
              return (
                <Theme
                  key={item.id + index}
                  id={item.id}
                  color1={item.colors["--color-dark-light"]}
                  color2={item.colors["--color-dark"]}
                  active={item.id === this.state.activeTheme}
                  onSelect={(id) => {
                    this.settings.set("theme", id);
                    this.themeProvider.changeTheme(id)
                    this.setState({
                      activeTheme: id
                    })
                  }}
                />
              )
            })}
          </ThemeSwitch>
        </Setting>
        <Setting disabled>
          <Label>Display</Label>
          <Radios>
            {displayOptions.map((item, index) => {
              return (
                <Radio
                  key={item.id + index}
                  selected={this.state.display === item.id}
                  onClick={() => {
                    this.setState({
                      display: item.id
                    })
                  }}
                >{item.name}</Radio>
              )
            })}
          </Radios>
        </Setting>
      </Tab>
    )
  }
}
