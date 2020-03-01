import React, { Component } from "react";

import Container from "../../components/misc/Container";
import Tag from "../../components/misc/Tag";

import { Page, Content } from "./styles";

class SettingsPage extends Component {
  render() {
    return (
      <Page>
        <Container>
          <Content>
            <Tag>coming soon</Tag>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default SettingsPage;
