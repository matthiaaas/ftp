import React, { Component, Fragment } from "react";
import { Redirect } from "react-router";
import styled from "styled-components";

import Data from "../../../data";

import { Search as Zoom, Loader } from "react-feather";

import KeyEvents from "../../../misc/KeyEvents";
import Tag from "../../../misc/Tag";

const Wrapper = styled.div`
  z-index: 11;
  top: 0;
  left: 0;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  background: var(--color-dark-blur);
`

const Space = styled.div`
  z-index: 10;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`

const Body = styled.div`
  z-index: 11;
  position: absolute;
  top: 128px;
  transition: all ease 0.2s;
  color: var(--color-grey);
  border: 1px solid var(--color-dark-grey);
  border-radius: 8px;
  overflow: hidden;
  width: 488px;
  background: var(--color-dark);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-dark-grey);
  background: var(--color-black);

  svg {
    width: 20px;
    height: 20px;
  }
`

const Input = styled.input`
  appearance: none;
  outline: none;
  user-select: all;
  border: none;
  background: transparent;
  margin-left: 12px;
  width: 288px;
  color: var(--color-white);

  &::placeholder {
    color: var(--color-grey);
  }
`

const Tips = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
`

const Tip = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-grey-dark);

  svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    animation-name: animLoader;
    animation-duration: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;

    @keyframes animLoader {
      from {
        transform: rotate(0)
      } to {
        transform: rotate(360deg)
      }
    }
  }
`

const Section = styled.section`
  padding: 12px 0;
  border-bottom: 1px solid var(--color-dark-grey);
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`

const Action = styled.div`
  text-transform: uppercase;
  font-size: 14px;
  color: var(--color-grey-dark);

  &:hover {
    color: ${props => props.disabled || `var(--color-grey)`};
  }
`

const Results = styled.ul`
  margin-top: 8px;
  max-height: ${props => props.show * 32}px;
  overflow-y: scroll;
`

const Result = styled.li`
  display: flex;
  align-items: center;
  padding: 6px 24px;
  box-sizing: border-box;
  width: 100%;
  color: ${props => props.focus && `var(--color-grey-light)`};
  background: ${props => props.focus ? `var(--color-dark-light) !important` : `transparent`};

  &:hover {
    background: var(--color-dark-grey-blur);
  }
`

const Path = styled.span`
  margin-right: 4px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const File = styled.div`
  text-transform: uppercase;
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid var(--color-grey-dark);
  color: inherit;
  white-space: nowrap;
`

const Match = styled.span`
  color: var(--color-white);
`

const Error = styled.div`
  margin-left: 24px;
  height: 20px;
`

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

    this.dataSocket = new Data(this.props.socketData.host);

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
          callback(results)
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

    if (selected >= files.length) {
      result = folders[selected - files.length];
    } else {
      result = files[selected];
    }

    this.dataSocket.set("path", result.path);
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
                <Results show={this.state.results.show.default}>
                  {this.state.results.files.length === 0 &&
                    <Error>
                      {this.state.term.length <= 1 ? "Try a search term" : "Nothing found"}
                    </Error>
                  }
                  {this.state.results.files.slice(0, this.state.results.show.files).map((item, index) => {
                    let split = [item.name, ""];
                    if (this.state.term !== "") {
                      split = item.name.split(this.state.term)
                    }

                    return (
                      <Result
                        key={item.name + item.path + index}
                        focus={index === this.state.results.selected}
                        onClick={() => {
                          this.setState({
                            results: {
                              ...this.state.results,
                              selected: index
                            }
                          })
                        }}
                      >
                        <Path>{item.path}</Path>
                        <File>
                          <span>{split[0]}</span>
                          <Match>{split.length !== 1 && this.state.term}</Match>
                          <span>{split[1]}</span>
                        </File>
                      </Result>
                    )
                  })}
                </Results>
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
                <Results show={this.state.results.show.default}>
                  {this.state.results.folders.length === 0 &&
                    <Error>
                      {this.state.term.length <= 1 ? "Try a search term" : "Nothing found"}
                    </Error>
                  }
                  {this.state.results.folders.slice(0, this.state.results.show.folders).map((item, index) => {
                    let split = [item.name, ""];
                    if (this.state.term !== "") {
                      split = item.name.split(this.state.term)
                    }

                    return (
                      <Result
                        key={item.name + item.path + index}
                        focus={index + this.state.results.files.length === this.state.results.selected}
                        onClick={() => {
                          this.setState({
                            results: {
                              ...this.state.results,
                              selected: index + this.state.results.files.length
                            }
                          })
                        }}
                      >
                        <Path>{item.path}</Path>
                        <File>
                          <span>{split[0]}</span>
                          <Match>{split.length !== 1 && this.state.term}</Match>
                          <span>{split[1]}</span>
                        </File>
                      </Result>
                    )
                  })}
                </Results>
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
