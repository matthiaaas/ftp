import React from "react";
import styled from "styled-components";

const Bar = styled.div`
  position: fixed;
  -webkit-app-region: drag;
  width: 100%;
  height: 36px;
  background: transparent;
`


function Titlebar() {
  return <Bar />;
}

export default Titlebar;
