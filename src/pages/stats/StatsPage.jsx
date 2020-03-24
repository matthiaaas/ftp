import React, { Component } from "react";

import Container from "../../components/misc/Container";
import Tag, { TagTooltip } from "../../components/misc/Tag";

import { Page, Content } from "./styles";

class StatsPage extends Component {
  render() {
    return (
      <Page>
        <Container>
          <Content>
            <Tag>
              <span>coming soon</span>
              <TagTooltip>This is an SFTP/SSH only feature</TagTooltip>
            </Tag>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default StatsPage;
