import React from "react";
import styled from "styled-components";

import { StatusTypes } from "../../states/socket/types";

const Status = styled.div<{status: StatusTypes}>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid var(--color-red-dark);
  background: ${
    props => props.status === StatusTypes.offline ? `var(--color-red)`
    : ""
  };
`

function ServerStatus(props: {status: StatusTypes}) {
  return <Status {...props} />
}

export default ServerStatus;
