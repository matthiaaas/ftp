import React, { Component, Fragment } from "react";
import { Redirect } from "react-router";

import { Search as Zoom, Loader } from "react-feather";

import Data from "../../../../localstorage/data";

import KeyEvents from "../../../../misc/KeyEvents";
import Tag from "../../../../misc/Tag";

import { Wrapper, Body, Header, Input, Section, Actions, Action, Tips, Tip, Space } from "./styles";

import Results from "./components/Results";

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: "",
      searching: false,
      redirect: undefined,
      keys: {},
      results: {
        selected: 0,
        show: {
          default: 3,
          files: 3,
          folders: 3
        },
        files: [],
        folders: []
      }
    }

    this.dataSocket = new Data(this.props.socketData.host, this.props.socketData.user);

    this.search = this.search.bind(this);
    this.handleShortcut = this.handleShortcut.bind(this);
  }

  search(term) {
    if (this.props.socketStatus !== "online") return;

    const handleResults = (data) => {
      let results = [];
      for (let i = 0; i < data.length; i++) {
        let result = data[i];
        if (result === "" || !(result.startsWith("./") || result.startsWith("/"))) continue;
        let split = result.split("/");

        let name = split[split.length - 1];
        let depth = split.length;
        split.pop();
        let path = split.join("/") + "/";

        results.push({
          name: name,
          path: path,
          depth: depth
        })
      }
      return results;
    }

    const find = (type, callback) => {
      this.props.socket.raw(`find . -iname *${term}* -type ${type || "f"} -not -path '*/\.*'`, (err, data) => {
        if (err) alert(err);
        if (data) {
          let results = handleResults(data.text.split("\n"));
          results = results.sort((a, b) => {
            return a.depth - b.depth + a.name.length - b.name.length
          })
          callback(results);
        }
      })
    }

    if (this.props.socket.sftp) {
      this.setState({ searching: true })
      find("f", (results) => {
        this.setState({
          results: {
            ...this.state.results,
            files: results
          }
        })
        find("d", (results) => {
          this.setState({
            results: {
              ...this.state.results,
              folders: results
            }
          })
          this.setState({ searching: false })
        })
      })
    }
  }

  submit() {
    let result;
    let selected = this.state.results.selected;
    let files = this.state.results.files;
    let folders = this.state.results.folders;
    
    let isFolder = false;

    if (selected >= files.length + folders.length) return;

    if (selected >= files.length) {
      isFolder = true;
      result = folders[selected - files.length];
    } else {
      result = files[selected];
    }

    let newPath = result.path + (isFolder ? result.name + "/" : "");
 
    this.dataSocket.set("path", newPath);
    this.setState({ redirect: "session" })
    this.props.onClose.call(this);
  }

  handleShortcut(key, code, event) {
    let selected = this.state.results.selected;

    switch (code) {
      case 40:
        selected++;
        event.preventDefault();
        break;
      case 38:
        selected--;
        event.preventDefault();
        break;
      case 27:
        this.props.onClose.call(this);
        break;
      case 13:
        this.submit();
        break;
      case 9:
        if (!this.state.keys.shift) selected++;
        else if (this.state.keys.shift) selected--;
        event.preventDefault();
        break;
      default:
        break;
    }

    let show = this.state.results.show;
    let files = this.state.results.files;
    let folders = this.state.results.folders;
    if (selected >= 0 && selected < files.length + folders.length) {
      if (selected > this.state.results.selected && selected >= show.files && files.length > selected) {
        selected += files.length - show.files;
      } else if (selected < this.state.results.selected && selected > show.files && files.length > selected) {
        selected -= files.length - show.files;
      }
      this.setState({
        results: {
          ...this.state.results,
          selected: selected
        }
      })
    }
  }

  render() {
    return (
      <Wrapper>
        <KeyEvents
          onModifierKeys={(keys) => {
            this.setState({
              keys: keys
            })
          }}
          onKeys={this.handleShortcut}
        />
        <Body>
          <Header>
            <Zoom />
            <Input
              onChange={(event) => {
                let term = event.target.value.toLowerCase().replace("*", "");
                let show = this.state.results.show;
                show.files = show.default;
                show.folders = show.default;
                this.setState({
                  term: term,
                  results: {
                    ...this.state.results,
                    show: show,
                    selected: 0
                  }
                })
                if (term.length > 0) {
                  this.search(term)
                } else {
                  this.setState({
                    results: {
                      ...this.state.results,
                      files: [],
                      folders: []
                    }
                  })
                }
              }}
              placeholder="Search for files and folders"
              autoFocus
            />
          </Header>
          {this.props.socketStatus === "online" && this.props.socketData.protocol !== "ftp" &&
            <Fragment>
              <Section>
                <Actions>
                  <Action disabled>{"Files" + (this.state.results.files.length > 0 ? ` (${this.state.results.files.length})` : "")}</Action>
                  {this.state.results.files.length > this.state.results.show.files &&
                    <Action onClick={() => {
                      let show = this.state.results.show;
                      show.files = this.state.results.files.length;
                      this.setState({
                        results: {
                          ...this.state.results,
                          show: show
                        }
                      })
                    }}>Show All</Action>
                  }
                </Actions>
                <Results
                  term={this.state.term}
                  results={this.state.results.files}
                  show={this.state.results.show.files}
                  selected={this.state.results.selected}
                  defaultShow={this.state.results.show.default}
                  onSelect={(i) => {
                    this.setState({
                      results: {
                        ...this.state.results,
                        selected: i
                      }
                    })
                  }}
                />
              </Section>
              <Section>
                <Actions>
                  <Action disabled>{"Folders" + (this.state.results.folders.length > 0 ? ` (${this.state.results.folders.length})` : "")}</Action>
                  {this.state.results.folders.length > this.state.results.show.folders &&
                    <Action onClick={() => {
                      let show = this.state.results.show;
                      show.folders = this.state.results.folders.length;
                      this.setState({
                        results: {
                          ...this.state.results,
                          show: show
                        }
                      })
                    }}>Show All</Action>
                  }
                </Actions>
                <Results
                  term={this.state.term}
                  results={this.state.results.folders}
                  show={this.state.results.show.folders}
                  selected={this.state.results.selected - this.state.results.files.length}
                  defaultShow={this.state.results.show.default}
                  onSelect={(i) => {
                    this.setState({
                      results: {
                        ...this.state.results,
                        selected: i + this.state.results.files.length
                      }
                    })
                  }}
                />
              </Section>
            </Fragment>
          } 
          <Tips>
            {this.state.searching &&
              <Tip><Loader /> Searching</Tip>
            }
            {this.props.socketStatus === "online" && this.props.socketData.protocol !== "sftp" &&
              <Tip>FTP connections are not supported</Tip>
            }
            {this.props.socketStatus !== "online" &&
              <Tag>please login first</Tag>
            }
            <Tip>{" "}</Tip>
          </Tips>
        </Body>
        <Space onClick={this.props.onClose} />
        {this.state.redirect &&
          <Redirect to={this.state.redirect} />
        }
      </Wrapper>
    )
  }
}
