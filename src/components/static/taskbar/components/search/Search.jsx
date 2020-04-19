import React, { Component, Fragment } from "react";
import { Redirect } from "react-router";

import { Search as Zoom, Loader } from "react-feather";

import Data from "../../../../localstorage/data";

import KeyEvents from "../../../../misc/KeyEvents";
import Tag from "../../../../misc/Tag";

import Find from "./components/search";

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
    this.submit = this.submit.bind(this);
    this.handleShortcut = this.handleShortcut.bind(this);
  }

  search(term) {
    if (this.props.socketStatus !== "online") return;
    this.setState({
      results: {
        ...this.state.results,
        files: [],
        folders: []
      }
    })
    this.setState({ searching: true })
      let find = new Find(term, this.props.socket);
      find.find((results, end) => {
        let newFiles = this.state.results.files;
        let newFolders = this.state.results.folders;

        if (results) {
          results.map(result => {
            if (result.type === 0) {
              return newFiles.push(result)
            } else {
              return newFolders.push(result)
            }
          })
          newFiles = find.resort(newFiles);
          newFolders = find.resort(newFolders);
          this.setState({
            results: {
              ...this.state.results,
              files: newFiles,
              folders: newFolders
            }
          })
        }

        if (end) this.setState({ searching: false })
      });
  }

  submit() {
    console.log("submittting")
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
    console.log(newPath)
 
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
        if (this.props.socketStatus === "online" && (!this.state.recursive || this.state.results.files.length + this.state.results.folders.length > 0)) {
          this.submit();
        } else {
          this.search(this.state.term);
        }
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
                let term = event.target.value.toLowerCase().replace("*", "").trim();
                let show = this.state.results.show;
                show.files = show.default;
                show.folders = show.default;
                this.setState({
                  term: term,
                  searching: false,
                  results: {
                    ...this.state.results,
                    show: show,
                    selected: 0,
                    files: [],
                    folders: []
                  }
                })
                if (term.length > 0) {
                  setTimeout(() => {
                    if (term === this.state.term) {
                      this.search(term);
                    }
                  }, 600)
                }
              }}
              placeholder="Search for files and folders"
              autoFocus
            />
          </Header>
          {this.props.socketStatus === "online" &&
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
                  onSubmit={this.submit}
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
            {this.props.socketStatus !== "online" &&
              <Tag>please login first</Tag>
            }
            {this.state.recursive && this.state.results.files.length + this.state.results.folders.length === 0 && !this.state.searching &&
              <Tip>Hit Enter to search</Tip>
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
