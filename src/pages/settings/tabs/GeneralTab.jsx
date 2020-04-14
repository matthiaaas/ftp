import React, { Component } from "react";

import { Tab, Setting, Label, Radios, Radio } from "./styles";

import Settings from "../../../components/localstorage/settings";

export default class GeneralTab extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings();

    this.state = {
      startScreen: this.settings.get("start_screen") || "/",
      defaultApp: this.settings.get("default_app") || false
    }
  }

  render() {
    const startScreenOptions = [
      {
        name: "Login",
        id: "login",
        setting: "/"
      },
      {
        name: "QuickConnect",
        id: "quickconnect",
        setting: "/quickconnect"
      }
    ]

    const defaultAppOptions = [
      {
        name: "Auto-Detect",
        id: "auto",
        setting: false
      },
      {
        name: "IDE",
        id: "ide",
        setting: "visual studio code"
      },
      {
        name: "Text Edit",
        id: "atom",
        setting: "atom"
      }
    ]

    return (
      <Tab>
        <Setting>
          <Label>Start screen</Label>
          <Radios>
            {startScreenOptions.map((item, index) => {
              return (
                <Radio
                  key={item.id + index}
                  selected={this.state.startScreen === item.setting}
                  onClick={() => {
                    this.setState({
                      startScreen: item.setting
                    })
                    this.settings.set("start_screen", item.setting)
                  }}
                >{item.name}</Radio>
              )
            })}
          </Radios>
        </Setting>
        <Setting disabled>
          <Label>Default app for opening a file</Label>
          <Radios>
            {defaultAppOptions.map((item, index) => {
              return (
                <Radio
                  key={item.id + index}
                  selected={this.state.defaultApp === item.setting}
                  onClick={() => {
                    this.setState({
                      defaultApp: item.setting
                    })
                    this.settings.set("default_app", item.setting)
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
