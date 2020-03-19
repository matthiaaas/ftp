import React, { Component } from "react";

import Container from "../../components/misc/Container";
import Tag from "../../components/misc/Tag";

import Data from "../../components/data";

import { Page, Content } from "./styles";

import Process from "./components/Process";

class TerminalPage extends Component {
  constructor(props) {
    super(props);

    this.dataSocket = new Data(this.props.ftpData.host);

    this.newProcess = this.newProcess.bind(this);

    this.state = {
      processes: [
        {
          host: this.props.ftpData.host,
          user: this.props.ftpData.user,
          path: undefined,
          onFinished: this.newProcess
        }
      ]
    }
  }

  newProcess() {
    this.props.ftp.raw("pwd", (err, data) => {
      let path = data.text.match(/"([^"]+)"/)[1];
      this.setState({
        processes: [
          ...this.state.processes,
          {
            host: this.props.ftpData.host,
            user: this.props.ftpData.user,
            path: path,
            onFinished: this.newProcess
          }
        ]
      })
    })
  }

  render() {
    return (
      <Page>
        <Container>
          <Content>
            {this.props.ftpStatus !== "online" && <Tag>You are not online</Tag>}
            {this.state.processes.map((item, index) => {
              return (
                <Process
                  key={index}
                  ftp={this.props.ftp}
                  user={item.user}
                  host={item.host}
                  path={item.path}
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
