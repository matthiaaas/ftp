import React, { Component } from "react";

import Container from "../../components/misc/Container";
import Headline from "../../components/misc/Headline";
import Tag from "../../components/misc/Tag";
import Button from "../../components/misc/Button";
import Popup from "../../components/misc/Popup";

import { Page, Content, Header, Connections, NoConnections, Message } from "./styles";

import Connection from "./components/Connection";

class QuickConnectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connections: [],
      target: undefined
    }

    this.submit = this.submit.bind(this);
    this.connect = this.connect.bind(this);
    this.loadConnections = this.loadConnections.bind(this);
    this.updateConnection = this.updateConnection.bind(this);
  }

  componentDidMount() {
    this.loadConnections();
  }

  loadConnections() {
    let connections = [];
    if (!window.localStorage.hasOwnProperty("registered_connections")) {
      window.localStorage.setItem("registered_connections", JSON.stringify(connections));
    }

    connections = JSON.parse(window.localStorage.getItem("registered_connections"));
    connections = connections.sort((a, b) => b.popularity - a.popularity);

    this.setState({ connections: connections })
  }

  updateConnection(connection) {
    let connections = this.state.connections;
    let i = connections.findIndex(item => item.name === connection.host && item.user === connection.user && item.port === connection.port);
    if (connections[i].popularity !== undefined) {
      connections[i].popularity++;
    } else {
      connections[i].popularity = 1;
    }
    this.setState({
      connections: connections
    })
    window.localStorage.setItem("registered_connections", JSON.stringify(connections))
  }

  submit(connection) {
    const noPassProvided = connection.pass === undefined || connection.pass === false || connection.pass === "";
    if (noPassProvided && connection.key === false) {
      connection.preview = `${connection.user}@${connection.host}`
      this.setState({ target: connection });
    } else {
      if (connection.key) {
        connection.key = window.Buffer.from(connection.key, "utf-8");
      }
      this.connect(connection)
    }
  }

  connect(login) {
    this.props.onLogin.call(this, login, (err, success) => {
      if (success) {
        this.updateConnection(login)
        this.props.history.push("/session")
      }
    });
  }

  render() {
    return (
      <Page>
        {this.state.target &&
          <Popup
            style={{ maxWidth: "364px" }}
            headline={<span>Type in the password for <span style={{borderBottom: "1px solid var(--color-white)", paddingBottom: "4px"}}>{this.state.target.preview}</span></span>}
            onClose={() => {this.setState({ target: undefined })}}
          >
            <Button variant="input"
              placeholder="••••"
              type="password"
              style={{ marginTop: "24px" }}
              onKeyDown={(event) => {
                if (event.keyCode === 13) {
                  event.preventDefault();
                  let connection = this.state.target;
                  connection.pass = event.target.value;
                  this.connect(connection)
                }
              }}
              autoFocus
            />
          </Popup>
        }
        <Container>
          <Content>
            <Header>
              <Headline>Quick Connect</Headline>
            </Header>
            {this.state.connections.length === 0 &&
              <NoConnections>
                <Tag>no connections</Tag>
                <Message style={{width: "280px"}}>You can add a server here by saving a connected server from the login</Message>
                <Message>If connected to a remote server, click on 'Save connection' from the login page</Message>
              </NoConnections>
            }
            <Connections>
              {this.state.connections.map((item, index) => {
                return (
                  <Connection
                    key={index}
                    id={index}
                    connected={(this.props.socketData.host === item.name && this.props.socketData.user === item.user && this.props.socketStatus === "online")}
                    name={item.name}
                    port={item.port}
                    user={item.user}
                    pass={item.pass}
                    protocol={item.protocol}
                    password={item.pass ? true : false}
                    keyData={item.key}
                    onSubmit={this.submit}
                    onDelete={this.loadConnections}
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
