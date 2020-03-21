import React, { Component } from "react";
import { Link } from "react-router-dom";

import Button from "../../../components/misc/Button";

import { Search, Bookmark, Eye, RefreshCcw, X } from "react-feather";

import { Header, Content, Rows, Row, Item, ItemInner, ItemOuter, ToolTip, Server, ServerStatus, ServerDisconnect, ServerRedirect } from "./styles";

class Taskbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: window.location.pathname
    }
  }

  changeActive(location) {
    this.setState({ location: location.pathname });
  }

  render() {
    return (
      <Header>
        <Content>
          <Rows>
            <Row>
              <Item>
                <ItemInner>
                  <Search />
                  <ToolTip>Search for files and folders</ToolTip>
                </ItemInner>
                <ItemOuter>Search</ItemOuter>
              </Item>
              <Item disabled={true}>
                <ItemInner>
                  <Eye />
                  <ToolTip>Keep track of file changes</ToolTip>
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
              <Server>
                <ServerDisconnect onClick={this.props.onDisconnect}><X /></ServerDisconnect>
                <Button to="/" tabIndex="-1">
                  <span>{this.props.socketData.host === "" || this.props.socketData.host === undefined ? "/" : this.props.socketData.host}</span>
                  <ServerStatus status={this.props.socketStatus} />
                </Button>
              </Server>
            </Row>
          </Rows>
        </Content>
      </Header>
    )
  }
}

export default Taskbar;
