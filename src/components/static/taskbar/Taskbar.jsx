import React, { Component } from "react";
import { Link } from "react-router-dom";

import Tag from "../../misc/Tag";
import KeyEvents from "../../misc/KeyEvents";
import ServerStatus from "../../misc/ServerStatus";

import { Search as Zoom, Bookmark, Eye, RefreshCcw, X, Plus } from "react-feather";

import { Header, Content, Rows, Row, Item, ItemInner, ItemOuter, ToolTip, Server, ServerDisconnect, ServerName } from "./styles";

import Search from "./components/search/Search";

class Taskbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: window.location.pathname,
      search: false,
      keys: []
    }

    this.handleShortcut = this.handleShortcut.bind(this);
    this.changeActive = this.changeActive.bind(this);
  }

  changeActive(location) {
    this.setState({ location: location.pathname });
  }

  handleShortcut(key) {
    if (this.state.keys.cmd && !this.state.keys.shift) {
      switch (key) {
        case "f":
          this.setState({ search: !this.state.search })
          break;
        case "d":
          this.props.onDisconnect.call(this);
          break;
        default:
          break;
      }
    }
  }

  render() {
    return (
      <Header>
        <KeyEvents
          onModifierKeys={(keys) => {
            this.setState({
              keys: keys
            })
          }}
          onKeys={this.handleShortcut}
        />
        {this.state.search &&
          <Search
            socket={this.props.socket}
            socketData={this.props.socketData}
            socketStatus={this.props.socketStatus}
            onClose={() => { this.setState({ search: false }) }}
          />
        }
        <Content>
          <Rows>
            <Row>
              <Item disabled={this.props.socketStatus !== "online"} active={this.state.search} onClick={() => { this.setState({ search: true }) }}>
                <ItemInner>
                  <Zoom />
                  <ToolTip>Search for files and folders</ToolTip>
                </ItemInner>
                <ItemOuter>Search</ItemOuter>
              </Item>
              <Item disabled={true}>
                <ItemInner>
                  <Eye />
                  <ToolTip><Tag>soon</Tag><br></br> Keep track of file changes</ToolTip>
                </ItemInner>
                <ItemOuter>Sync</ItemOuter>
              </Item>
              <Item onClick={this.props.onRefresh} disabled={this.state.location !== "/session" || this.props.socketStatus !== "online"}>
                <ItemInner>
                  <RefreshCcw />
                  <ToolTip>Reload files and folders</ToolTip>
                </ItemInner>
              </Item>
              <Item active={this.state.location === "/quickconnect"}>
                <Link to="/quickconnect" tabIndex="-1">
                  <ItemInner>
                    <Bookmark />
                    <ToolTip>Open connection dictionary</ToolTip>
                  </ItemInner>
                </Link>
              </Item>
            </Row>
            <Row>
              {this.props.socketStatus !== "offline" &&
                <Server active={this.state.location === "/dashboard"}>
                  <ServerDisconnect onClick={this.props.onDisconnect}><X /></ServerDisconnect>
                  <ServerName to="/dashboard" tabIndex="-1">
                    <span>{this.props.socketData.host === "" || this.props.socketData.host === undefined ? "/" : this.props.socketData.host}</span>
                    <ServerStatus style={{margin: "0 -4px 0 8px"}} status={this.props.socketStatus} />
                  </ServerName>
                </Server>
              }
              <Item active={this.state.location === "/"}>
                <Link to="/" tabIndex="-1">
                  <ItemInner>
                    <Plus />
                  </ItemInner>
                </Link>
              </Item>
            </Row>
          </Rows>
        </Content>
      </Header>
    )
  }
}

export default Taskbar;
