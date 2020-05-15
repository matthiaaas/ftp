import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin: 188px 0 0 200px;
`

function Container(props: {children: React.ReactNode}) {
  return (
    <Wrapper>{props.children}</Wrapper>
  )
}

export default Container;
