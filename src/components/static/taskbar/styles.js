import styled from "styled-components";

export const Header = styled.header`
  z-index: 7;
  border-bottom: 1px solid var(--color-dark-light);
  margin: 36px 0 0 200px;
  padding: 8px 0 36px 36px;
  width: 100vw;
  position: fixed;
  background: var(--color-dark);
`

export const Content = styled.div`
  
`

export const Rows = styled.div`
  
`

export const Row = styled.div`
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-top: 20px;
  }
`

export const Item = styled.div`
  cursor: default;
  transition: all ease 0.1s;
  display: inline-flex;
  align-items: center;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  color: var(--color-grey);

  &:not(:last-child) {
    margin-right: 32px;
  }

  >div:first-child {
    border: 1px solid transparent;
  }

  &:hover {
    color: var(--color-grey-light);

    >div:first-child {
      border: 1px solid var(--color-dark-light);
      background: var(--color-dark);
    }
  }
`

export const ItemInner = styled.div`
  border-radius: 27px;
  position: relative;
  /* padding: 11px 13px; */
  padding: 12px 13px 10px 13px;
  font-size: 16px;
  background: var(--color-dark-light);

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover >div {
    transition: all 0s;
    transition-delay: 1.5s;
    transform: scaleY(1);
  }
`

export const ItemOuter = styled.span`
  margin-left: 16px;
`

export const ToolTip = styled.div`
  position: absolute;
  z-index: 9 !important;
  top: 56px;
  left: -64px;
  width: 148px;
  padding: 8px 12px;
  line-height: 1.2;
  border-radius: 12px;
  color: var(--color-grey);
  background: var(--color-black);
  transform: scaleY(0);

  &::after {
    content: " ";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    transform: rotate(180deg);
    border-color: var(--color-black) transparent transparent transparent;
  }
`

export const ServerStatus = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin: 0 -4px 0 8px;

  background: ${
    props => props.status === "online" ? `var(--color-green)`
    : props.status === "afk" ? `var(--color-yellow)` : `var(--color-red)`
  }
`
