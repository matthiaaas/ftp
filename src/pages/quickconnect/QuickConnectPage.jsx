import React, { Component } from "react";

import Container from "../../components/misc/Container";
import Headline from "../../components/misc/Headline";
import Tag from "../../components/misc/Tag";

import { Page, Content, Header, Connections } from "./styles";

import Connection from "./components/Connection";

class QuickConnectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connections: []
    }

    this.loadConnections = this.loadConnections.bind(this);
  }

  componentDidMount() {
    this.loadConnections();
  }

  loadConnections() {
    let connections = [
    ];

    if (!window.localStorage.hasOwnProperty("registered_connections")) {
      window.localStorage.setItem("registered_connections", JSON.stringify(connections));
    }

    connections = JSON.parse(window.localStorage.getItem("registered_connections"));

    this.setState({ connections: connections })
  }

  render() {
    return (
      <Page>
        <Container>
          <Content>
            <Header>
              <Headline>Quick Connect</Headline>
            </Header>
            {this.state.connections.length === 0 && <Tag>no connections</Tag>}
            <Connections>
              {this.state.connections.map((item, index) => {
                return (
                  <Connection
                    key={index}
                    connected={(this.props.ftpData.host === item.name && this.props.ftpData.user === item.user)}
                    name={item.name}
                    user={item.user}
                    port={item.port}
                    protocol={item.protocol.toUpperCase()}
                    password={item.password ? true : false}
                    onConnect={this.props.onLogin}
                    onDelete={this.loadConnections}
                  />
                )
              })}
              {this.state.connections.length % 2 === 1 && <div style={{flex: 1, marginLeft: "12px"}}></div>}
            </Connections>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default QuickConnectPage;
