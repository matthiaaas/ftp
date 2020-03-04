import React, { Component } from "react";

import Container from "../../components/misc/Container";
import Headline from "../../components/misc/Headline";

import { Page, Content, Header, Connections } from "./styles";

import Connection from "./components/Connection";

class QuickConnectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connections: []
    }
  }

  componentDidMount() {
    let connections = [
    ];

    if (!window.localStorage.hasOwnProperty("registered_connections")) {
      window.localStorage.setItem("registered_connections", JSON.stringify(connections));
    }

    connections = JSON.parse(window.localStorage.getItem("registered_connections"));

    // connections.push({
    //   name: "ftp@example.com",
    //   port: 22,
    //   protocol: "sftp"
    // })

    console.log(connections);
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
            <Connections>
              {this.state.connections.map((item, index) => {
                return (
                  <Connection
                    connected={false}
                    name={item.name}
                    port={item.port}
                    protocol={item.protocol.toUpperCase()}
                    password={false}
                  />
                )
              })}
            </Connections>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default QuickConnectPage;
