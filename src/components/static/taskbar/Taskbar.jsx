import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Search, Bookmark, Eye, RefreshCcw } from "react-feather";

import Button from "../../misc/Button";

import { Header, Content, Rows, Row, Item, ServerStatus, ItemInner, ItemOuter, ToolTip } from "./styles";

class Taskbar extends Component {
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
              <Item>
                <ItemInner>
                  <Eye />
                  <ToolTip>Keep track of file changes</ToolTip>
                </ItemInner>
                <ItemOuter>Sync</ItemOuter>
              </Item>
              <Item>
                <ItemInner>
                  <RefreshCcw />
                  <ToolTip>Refresh current session</ToolTip>
                </ItemInner>
              </Item>
              <Item>
                <Link to="/quickconnect">
                  <ItemInner>
                    <Bookmark />
                    <ToolTip>Open connection dictionary</ToolTip>
                  </ItemInner>
                </Link>
              </Item>
            </Row>
            <Row>
              <Button to="/" tabIndex="-1">
                <span>{this.props.ftpData.host === "" || this.props.ftpData.host === undefined ? "/" : this.props.ftpData.host}</span>
                <ServerStatus status={this.props.ftpStatus} />
              </Button>
            </Row>
          </Rows>
        </Content>
      </Header>
    )
  }
}

export default Taskbar;
