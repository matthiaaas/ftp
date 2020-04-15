import React, { Component } from "react";

import { Layout, Cloud, Settings } from "react-feather";

import Container from "../../components/misc/Container";

import { Page, Content, Tabs } from "./styles";

import TabItem from "./components/TabItem";

import AppearanceTab from "./tabs/AppearanceTab";
import TransferTab from "./tabs/TransferTab";
import GeneralTab from "./tabs/GeneralTab";

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: "/appearance"
    }

    this.changeActive = this.changeActive.bind(this);
  }

  changeActive(to) {
    this.setState({
      active: to
    })
  }

  render() {
    const tabItems = [
      {
        name: "Appearance",
        loc: "/appearance",
        icon: <Layout />,
        component: <AppearanceTab key="appearance" />
      },
      {
        name: "Transfer",
        loc: "/transfer",
        icon: <Cloud />,
        component: <TransferTab key="transfer" />
      },
      {
       
        name: "General",
        loc: "/general",
        icon: <Settings />,
        component: <GeneralTab  key="general" />
      }
    ];

    return (
      <Page>
        <Container>
          <Tabs>
            {tabItems.map((item, index) => {
              return (
                <TabItem
                  key={index}
                  name={item.name}
                  loc={item.loc}
                  icon={item.icon}
                  active={item.loc === this.state.active}
                  onNavigate={this.changeActive}
                />
              )
            })}
          </Tabs>
          <Content>
            {tabItems.map((item, index) => {
              if (this.state.active === item.loc) {
                return item.component
              }
            })}
          </Content>
        </Container>
      </Page>
    )
  }
}

export default SettingsPage;
