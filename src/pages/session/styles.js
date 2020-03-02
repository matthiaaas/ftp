import styled from "styled-components";

export const Page = styled.main`
  /* position: relative; */
`

export const Content = styled.div`
  margin: 0 36px 36px 36px;
  display: flex;
  flex-wrap: wrap;
`

export const System = styled.section`
  flex: 1;
  min-width: 300px;
`

export const Space = styled.div`
  position: fixed;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
`

export const Path = styled.div`
  z-index: 3;
  position: fixed;
  width: 100%;
  padding: 28px 0 20px 0;
  color: var(--color-grey);
  display: flex;
  align-items: center;
  background: var(--color-dark-light);
`

export const Url = styled.span`
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  margin-left: 16px;
`

export const Files = styled.div`
  margin-top: 80px;
`
