import React, { Component } from "react";

import { Search, Bookmark } from "react-feather";

import Button from "../../misc/Button";

import { Header, Content, Rows, Row, Item, ServerStatus, ItemInner, ItemOuter } from "./styles";

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
                </ItemInner>
                <ItemOuter>Search</ItemOuter>
              </Item>
              <Item>
                <ItemInner>
                  <Bookmark />
                </ItemInner>
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
