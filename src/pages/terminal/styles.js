import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
`

export const Content = styled.div`
  margin: 36px;
`

export const Warnings = styled.div`
  display: block;

  >div:not(:last-child) {
    margin-right: 12px;
  }
`
