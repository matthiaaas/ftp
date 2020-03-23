import React, { Component } from "react";

import Container from "../../components/misc/Container";
import Tag, { TagTooltip } from "../../components/misc/Tag";

import { Page, Content, Warnings } from "./styles";

import RawTerminal from "./components/RawTerminal";
import InteractiveTerminal from "./components/InteractiveTerminal";
import Code from "../../components/misc/Code";

class TerminalPage extends Component {
  render() {
    return (
      <Page>
        <Container>
          <Content>
            <Warnings>
              {this.props.socketStatus !== "online" &&
                <Tag>
                  <span>You are not connected</span>
                  <TagTooltip>First connect to a server from the login</TagTooltip>
                </Tag>
              }
              {this.props.socketData.protocol === "ftp" &&
                <Tag>
                  <span>only FTP commands available</span>
                  <TagTooltip>Shell commands like <Code>cd</Code> won't work. Try <Code>cwd</Code> instead.</TagTooltip>
                </Tag>
              }
            </Warnings>
            {this.props.socketStatus === "online" && this.props.socket.sftp &&
              <InteractiveTerminal
                socket={this.props.socket}
                socketData={this.props.socketData}
                socketStatus={this.props.socketStatus}
              />
            }
            {this.props.socketData.protocol !== "sftp" &&
              <RawTerminal
                socket={this.props.socket}
                socketData={this.props.socketData}
                socketStatus={this.props.socketStatus}
              />
            }
          </Content>
        </Container>
      </Page>
    )
  }
}

export default TerminalPage;
