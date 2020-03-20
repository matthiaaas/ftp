import React, { Component } from "react";

import Container from "../../components/misc/Container";
import Tag from "../../components/misc/Tag";

import Data from "../../components/data";

import { Page, Content, Warnings } from "./styles";

import Process from "./components/Process";

class TerminalPage extends Component {
  constructor(props) {
    super(props);

    this.dataSocket = new Data(this.props.socketData.host);

    this.newProcess = this.newProcess.bind(this);

    this.state = {
      processes: [
        {
          host: this.props.socketData.host,
          user: this.props.socketData.user,
          path: undefined,
          onFinished: this.newProcess
        }
      ]
    }
  }

  newProcess() {
    this.props.socket.raw("pwd", (err, data) => {
      if (data) {
        let path;
        if (data.text.includes('"')) {
          path = data.text.match(/"([^"]+)"/)[1];
        } else path = data.text.split("\n")[0];
        this.setState({
          processes: [
            ...this.state.processes,
            {
              host: this.props.socketData.host,
              user: this.props.socketData.user,
              path: path,
              onFinished: this.newProcess
            }
          ]
        })
      }
    })
  }

  render() {
    return (
      <Page>
        <Container>
          <Content>
            <Warnings>
              {this.props.socketStatus !== "online" && <Tag>You are not connected</Tag>}
              {this.props.socketData.protocol === "ftp" && <Tag>only FTP commands available</Tag>}
            </Warnings>
            {this.state.processes.map((item, index) => {
              return (
                <Process
                  key={index}
                  socket={this.props.socket}
                  user={item.user}
                  host={item.host}
                  path={item.path}
                  protocol={this.props.socketData.protocol}
                  onFinished={item.onFinished}
                />
              )
            })}
          </Content>
        </Container>
      </Page>
    )
  }
}

export default TerminalPage;
