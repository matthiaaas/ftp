import React, { Component } from "react";

import { Tab, Setting, Label, Radios, Radio } from "./styles";

import Settings from "../../../components/localstorage/settings";

export default class TransferTab extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings();

    this.state = {
      sortBy: this.settings.get("sort_by") || "alphabetically"
    }
  }

  render() {
    const sortByOptions = [
      {
        name: "Alphabetically",
        id: "alphabetically",
        setting: "alphabetically"
      },
      {
        name: "Folders first",
        id: "folders-first",
        setting: "folders"
      }
    ]

    return (
      <Tab>
        <Setting disabled>
          <Label>Sort Files and folders</Label>
          <Radios>
            {sortByOptions.map((item, index) => {
              return (
                <Radio
                  key={item.id + index}
                  selected={this.state.sortBy === item.setting}
                  onClick={() => {
                    this.setState({
                      sortBy: item.setting
                    })
                    this.settings.set("sort_by", item.setting)
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
