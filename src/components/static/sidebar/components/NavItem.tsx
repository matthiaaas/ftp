import React from "react";

import { Item, Url, Icon, Text } from "../styles";

function NavItem(props: {name: string, to: string, icon: any, active: boolean}) {
  return (
    <Item active={props.active}>
      <Url to={props.to} tabIndex={-1}>
        <Icon>{props.icon}</Icon>
        <Text>{props.name}</Text>
      </Url>
    </Item>
  )
}

export default NavItem;
