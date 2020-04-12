import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  background: var(--color-dark);
`

export const Content = styled.div`
  margin: 0 36px;
`

export const Header = styled.section`
  display: flex;
  align-items: center;
  margin: 48px 0 0 8px;
`

export const Dashboard = styled.section`
  padding-top: 40px;
  display: flex;
  margin: -8px;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const Item = styled.div`
  margin: 8px;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  color: var(--color-grey);
`

export const Label = styled.label`
  margin-bottom: 16px;
  display: block;
`

export const Box = styled.div`
  border-radius: 8px;
  border: 1px solid var(--color-dark-grey);
  background: var(--color-black);
`

export const Chart = styled.div`
  padding: 24px;
`

export const Info = styled.div`
  border-top: 1px solid var(--color-dark-grey);
  padding: 12px 0;
  text-align: center;
`

export const BoxSection = styled.div`
  box-sizing: border-box;
  min-width: 264px;
  padding: 12px 24px;
  display: flex;
  align-items: center;

  &:not(:first-child) {
    border-top: 1px solid var(--color-dark-grey);
  }
`

export const Icon = styled.div`
  margin-right: 8px;

  svg {
    display: block;
    width: 16px;
    height: 16px;
  }
`

export const Text = styled.div`
  position: relative;
  display: block;
  color: ${props => props.highlighted ? `var(--color-white)` : `var(--color-grey)`};

  &:hover >div {
    transition: all 0s;
    transition-delay: 1s;
    transform: scaleY(1);
  }
`

export const Ip = styled.span`
  display: block;
  user-select: all;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 184px;
`

export const ToolTip = styled.div`
  position: absolute;
  z-index: 9 !important;
  user-select: all;
  bottom: calc(100% + 24px);
  left: 50%;
  padding: 8px 12px;
  line-height: 1.2;
  border-radius: 4px;
  font-size: 16px;
  text-transform: initial;
  color: var(--color-grey);
  background: var(--color-black);

  &::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: var(--color-black) transparent transparent transparent;
  }
`
