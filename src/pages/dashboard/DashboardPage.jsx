import React, { Component, Fragment } from "react";

import { Database, Shield, ShieldOff, GitCommit, Bookmark } from "react-feather";

import Container from "../../components/misc/Container";
import Headline from "../../components/misc/Headline";
import ServerStatus from "../../components/misc/ServerStatus";
import CircularChart from "../../components/misc/CircularChart";

import { Page, Content, Header, QuickActions, Dashboard, Column, Item, Label, Box, Chart, Info, BoxSection, Icon, Text, ToolTip, Ip } from "./styles";

import QuickAction from "./components/QuickAction";

class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storage: {
        error: false,
        loading: true,
        used: 0,
        available: 0,
        max: 1
      }
    }

    this.saveConnection = this.saveConnection.bind(this);
  }

  componentDidMount() {
    if (this.props.socketStatus === "offline") {
      this.props.history.push("/")
    } else {
      this.getSpace();
    }
  }

  saveConnection() {
    let connections = JSON.parse(window.localStorage.getItem("registered_connections")) || [];
    connections.push({
      name: this.props.socketData.host,
      user: this.props.socketData.user,
      port: this.props.socketData.port,
      pass: this.props.socketData.pass === "anonymous" && this.props.socketData.pass,
      key: this.props.socketData.key ? this.props.socketData.key.toString() : false,
      protocol: this.props.socketData.protocol,
      popularity: 0
    });
    window.localStorage.setItem("registered_connections", JSON.stringify(connections));
    alert("Saved connection as a bookmark in QuickConnect", false)
  }

  getSpace() {
    if (this.props.socket && this.props.socket.sftp) {
      this.props.socket.raw("df -l -h -BM /", (err, output) => {
        if (output) {
          output = output.text.split("\n")
          output.shift()
          output.pop()
          let data = [];
          output.forEach(line => {
            let raw = line.split(" ");
            let entries = []
            raw.map(entry => {
              if (entry !== "") {
                entries.push(entry);
              }
            })
            let item = {
              name: entries[0],
              size: parseInt(entries[1].split("B")[0]),
              used: parseInt(entries[2].split("B")[0]),
              available: parseInt(entries[3].split("B")[0]),
              path: entries[5]
            }
            data.push(item);
          })
          let i = 0;
          if (data[i] !== undefined) {
            this.setState({
              storage: {
                used: data[i].used,
                available: data[i].available,
                max: data[i].size
              }
            })
          } else {
            this.setState({
              storage: {
                ...this.state.storage,
                error: true,
                loading: false
              }
            })
          }
        }
      })
    } else {
      this.setState({
        storage: {
          ...this.state.storage,
          error: true,
          loading: false
        }
      })
    }
  }

  render() {
    let data = this.props.socketData;

    return (
      <Page>
        <Container>
          <Content>
            <Header>
              <ServerStatus status={this.props.socketStatus} />
              <Headline>{data.user ? data.user + "@" : "Dashboard"}{data.host}</Headline>
              <QuickActions>
                <QuickAction
                  disabled={this.props.socketStatus !== "online"}
                  onAction={this.saveConnection}
                >
                  <Bookmark />
                </QuickAction>
              </QuickActions>
              
            </Header>
            <Dashboard>
              <Column>
                <Item>
                  <Label>Storage</Label>
                  <Box>
                    <Chart>
                      <CircularChart
                        outer={{percentage: this.state.storage.used / this.state.storage.max}}
                        inner={{percentage: this.state.storage.available / this.state.storage.max}}
                        icon={<Database />}
                      />
                    </Chart>
                    <Info>
                      {
                        this.state.storage.loading ? "Loading..." : 
                        this.state.storage.error ? "Unable to load" : 
                        <Fragment>
                          <span style={{color: "var(--color-blue)"}}>
                            {Math.round((this.state.storage.used / 1000 + Number.EPSILON) * 100) / 100}
                          </span>
                          <span>
                            {"/" + Math.round((this.state.storage.max / 1000 + Number.EPSILON) * 100) / 100 + "GB"}
                          </span>
                        </Fragment>
                      }
                    </Info>
                  </Box>
                </Item>
              </Column>
              <Column>
                <Item>
                  <Label>Connection</Label>
                  <Box>
                    <BoxSection>
                      <Text highlighted>
                        <Ip>{data.ip}</Ip>
                        {/* <ToolTip>{data.ip}</ToolTip> */}
                      </Text>
                      <Icon style={{margin: "0 4px", color: "var(--color-white)"}}><GitCommit /></Icon>
                      <Text style={{userSelect: "all"}} highlighted>{data.port}</Text>
                    </BoxSection>
                    <BoxSection>
                      <Text>{data.family ? "IPv" + data.family : "Connecting..."}</Text>
                    </BoxSection>
                    <BoxSection>
                      <Icon>{data.protocol === "ftp" ? <ShieldOff /> : <Shield />}</Icon>
                      <Text>{data.protocol.toUpperCase()} over {data.key ? "private key" : "password"}</Text>
                    </BoxSection>
                  </Box>
                </Item>
                <Item>
                  <Label>System</Label>
                  <Box>
                    <BoxSection>
                      <Text>Unix</Text>
                    </BoxSection>
                  </Box>
                </Item>
              </Column>
            </Dashboard>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default DashboardPage;
