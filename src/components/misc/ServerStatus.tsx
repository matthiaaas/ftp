import React from "react";
import styled from "styled-components";

import { StatusTypes } from "../../providers/socket/types";

const Status = styled.div<{status: StatusTypes}>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid ${
    props => props.status === StatusTypes.offline ? `var(--color-red-dark)`
    : props.status === StatusTypes.idle ? `var(--color-yellow-dark)` : `var(--color-green-dark)`
  };;
  background: ${
    props => props.status === StatusTypes.offline ? `var(--color-red)`
    : props.status === StatusTypes.idle ? `var(--color-yellow)` : `var(--color-green)`
  };
`

function ServerStatus(props: {status: StatusTypes}) {
  return <Status {...props} />
}

export default ServerStatus;
