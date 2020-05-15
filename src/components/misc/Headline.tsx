import React from "react";
import styled from "styled-components";

const Text = styled.h1`
  font-family: var(--font-main);
  font-weight: bold;
  font-size: 24px;
  color: var(--color-white);
`

function Headline(props: {children: React.ReactNode}) {
  return <Text>{props.children}</Text>
}

export default Headline;
