import React, { Component } from "react";

import Container from "../../components/misc/Container";
import Tag from "../../components/misc/Tag";


import { Page, Content, Warnings } from "./styles";

import RawTerminal from "./components/RawTerminal";
import InteractiveTerminal from "./components/InteractiveTerminal";

class TerminalPage extends Component {
  render() {
    return (
      <Page>
        <Container>
          <Content>
            <Warnings>
              {this.props.socketStatus !== "online" && <Tag>You are not connected</Tag>}
              {this.props.socketData.protocol === "ftp" && <Tag>only FTP commands available</Tag>}
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
