import styled from "styled-components";

export const Page = styled.main`
  overflow: hidden;
`

export const Content = styled.div`
  margin: 0 36px 36px 36px;
`

export const Header = styled.section`
  margin: 48px 0 48px 0;
`

export const Connections = styled.section`
  display: flex;
  flex-wrap: wrap;
  margin: -12px;
`

export const NoConnections = styled.div`

`

export const Message = styled.div`
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  color: var(--color-grey);

  &:not(:first-child) {
    margin-top: 16px;
  }
`
