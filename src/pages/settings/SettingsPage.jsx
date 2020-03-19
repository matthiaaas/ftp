import React, { Component } from "react";

import Container from "../../components/misc/Container";
import Button from "../../components/misc/Button";

import { Page, Content } from "./styles";

class SettingsPage extends Component {
  render() {
    return (
      <Page>
        <Container>
          <Content>
            <Button variant="button" primary>Save settings</Button>
            <Button variant="button">Save</Button>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default SettingsPage;
