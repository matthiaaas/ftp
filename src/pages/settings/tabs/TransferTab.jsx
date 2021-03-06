import React, { Component } from "react";

import Button from "../../../components/misc/Button";

import { getDownloadsFolder } from "../../../assets/utils/utils";

import { Tab, Setting, Label, Radios, Radio } from "./styles";

import Toggle from "./components/Toggle";

import Settings from "../../../components/localstorage/settings";

const path = window.require("path");

export default class TransferTab extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings();

    this.state = {
      sortBy: this.settings.get("sort_by") || "name",
      doubleClick: this.settings.get("doubleclick_open") || false,
      hideHidden: this.settings.get("hide_hidden_files") || false,
      dlDir: this.settings.get("downloads_folder") || getDownloadsFolder()
    }
  }

  render() {
    const sortByOptions = [
      {
        name: "Alphabetically",
        id: "name",
        setting: "name"
      },
      {
        name: "Folders first",
        id: "type",
        setting: "type"
      }
    ]

    return (
      <Tab>
        <Setting>
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
        <Setting>
          <Label>Downloads folder</Label>
          <Button
            variant="browse"
            type="folder"
            defaultValue={this.state.dlDir}
            onChange={(event) => {
              let file = event.target.files[0];
              let newPath = path.dirname(file.path);
              this.setState({
                dlDir: newPath
              });
              this.settings.set("downloads_folder", newPath)
            }}
          />
        </Setting>
        <Setting>
          <Label>Download & open files with double click</Label>
          <Toggle
            toggled={this.state.doubleClick}
            onClick={() => {
              this.setState({
                doubleClick: !this.state.doubleClick
              })
              this.settings.set("doubleclick_open", !this.state.doubleClick)
            }}
          />
        </Setting>
        <Setting>
          <Label>Hide hidden files</Label>
          <Toggle
            toggled={this.state.hideHidden}
            onClick={() => {
              this.setState({
                hideHidden: !this.state.hideHidden
              })
              this.settings.set("hide_hidden_files", !this.state.hideHidden)
            }}
          />
        </Setting>
      </Tab>
    )
  }
}
