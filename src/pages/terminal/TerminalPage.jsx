import React, { Component } from "react";

import Container from "../../components/misc/Container";
import Tag from "../../components/misc/Tag";

import { Page, Content } from "./styles";

class TerminalPage extends Component {
  render() {
    return (
      <Page>
        <Container>
          <Content>
            <Tag>available in future release</Tag>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default TerminalPage;
