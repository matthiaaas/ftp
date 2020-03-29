import React, { Component } from "react";
import styled from "styled-components";

import { Search as Zoom, Loader } from "react-feather";

import KeyEvents from "../../../misc/KeyEvents";

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

const Body = styled.div`
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
`

const Results = styled.ul`
  margin-top: 8px;
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
`

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: "",
      searching: false,
      results: {
        selected: 0,
        show: 3,
        files: [],
        folders: []
      }
    }

    this.search = this.search.bind(this);
    this.handleShortcut = this.handleShortcut.bind(this);
  }

  search(term) {
    if (this.props.socketStatus !== "online") return;

    const handleResults = (data) => {
      let results = [];
      for (let i = 0; i < data.length; i++) {
        let result = data[i];
        if (result === "" || !result.startsWith("/")) continue;
        let split = result.split("/");

        let name = split[split.length - 1];
        let depth = split.length;
        split.pop();
        let path = split.join("/");

        results.push({
          name: name,
          path: path,
          depth: depth
        })
      }
      return results;
    }

    const find = (type, callback) => {
      this.props.socket.raw(`find . -name ${term}* -type ${type || "f"} -not -path '*/\.*'`, (err, data) => {
        if (err) alert(err);
        if (data) {
          let results = handleResults(data.text.split("\n"));
          results.sort((a, b) => { return a.depth - b.depth })
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

  handleShortcut(key, code) {
    let selected = this.state.results.selected;

    switch (code) {
      case 40:
        selected++;
        break;
      case 38:
        selected--;
        break;
      case 27:
        this.props.onClose.call(this);
        break;
      default:
        break;
    }

    this.setState({
      results: {
        ...this.state.results,
        selected: selected
      }
    })
  }

  render() {
    return (
      <Wrapper>
        <KeyEvents onKeys={this.handleShortcut} />
        <Body>
          <Header>
            <Zoom />
            <Input
              onChange={(event) => {
                let term = event.target.value;
                this.setState({
                  term: term.replace("*", "")
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
          <Section>
            <Actions>
              <Action>{"Files" + (this.state.results.files.length > 0 ? ` (${this.state.results.files.length})` : "")}</Action>
            </Actions>
            <Results>
              {this.state.results.files.length === 0 &&
                <Error>Nothing found</Error>
              }
              {this.state.results.files.slice(0, this.state.results.show).map((item, index) => {
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
              <Action>Folders</Action>
            </Actions>
            <Results>
              {this.state.results.folders.length === 0 &&
                <Error>Nothing found</Error>
              }
              {this.state.results.folders.slice(0, this.state.results.show).map((item, index) => {
                let split = [item.name, ""];
                if (this.state.term !== "") {
                  split = item.name.split(this.state.term)
                }

                return (
                  <Result
                    key={item.name + item.path + index}
                    focus={index + this.state.results.show === this.state.results.selected}
                    onClick={() => {
                      this.setState({
                        results: {
                          ...this.state.results,
                          selected: index + this.state.results.show
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
          <Tips>
            {this.state.searching &&
              <Tip><Loader /> Searching</Tip>
            }
            {this.props.socketStatus === "online" && this.props.socketData.protocol !== "sftp" &&
              <Tip>FTP connections are not supported</Tip>
            }
            <Tip>{this.props.socketStatus !== "online" ? "Please login first" : " "}</Tip>
          </Tips>
        </Body>
      </Wrapper>
    )
  }
}
