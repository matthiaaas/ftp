import React from "react";
import styled from "styled-components";

import { StatusTypes } from "../../providers/socket/types";

const Status = styled.div<{status: StatusTypes}>(({ status }) =>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid ${
    status === StatusTypes.offline ? `var(--color-red-dark)`
    : status === StatusTypes.idle ? `var(--color-yellow-dark)` : `var(--color-green-dark)`
  };;
  background: ${
    status === StatusTypes.offline ? `var(--color-red)`
    : status === StatusTypes.idle ? `var(--color-yellow)` : `var(--color-green)`
  };
`)

function ServerStatus(props: {status: StatusTypes}) {
  return <Status {...props} />
}

export default ServerStatus;
