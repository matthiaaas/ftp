import styled from "styled-components";
import { Link } from "react-router-dom";

export const Header = styled.header`
  z-index: 11;
`

export const Content = styled.div`
  border-bottom: 1px solid var(--color-dark-grey);
  margin: 36px 0 0 201px;
  padding: 8px 0 36px 36px;
  width: 100vw;
  position: fixed;
  background: var(--color-dark);
  z-index: 7;
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
  pointer-events: ${props => props.disabled && "none"};
  transition: all ease 0.1s;
  display: inline-flex;
  align-items: center;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.disabled ? `var(--color-grey-dark) !important` : props.active ? `var(--color-grey-light)` : `var(--color-grey)`};

  &:not(:last-child) {
    margin-right: 32px;
  }

  div:first-child {
    border: 1px solid ${props => props.disabled ? `var(--color-dark-light) !important` : props.active ? `var(--color-dark-grey)` : `transparent`};
    background: ${props => props.disabled ? `transparent !important` : props.active && `var(--color-dark) !important`};
  }

  &:hover {
    color: var(--color-grey-light);

    div:first-child {
      border: 1px solid var(--color-dark-grey);
      background: var(--color-dark);
    }
  }

  &:active {
    div:first-child {
      background: var(--color-dark-grey-blur);
    }
  }
`

export const ItemInner = styled.div`
  border-radius: 27px;
  position: relative;
  padding: 11px 11px 8px 11px;
  font-size: 16px;
  background: var(--color-dark-light);

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover >div {
    transition: all 0s;
    transition-delay: 1s;
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
  border-radius: 4px;
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

export const Server = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-right: 12px;

  >a {
    color: ${props => props.disabled ? `var(--color-grey-dark) !important` : props.active ? `var(--color-grey-light)` : `var(--color-white)`};
    border: 1px solid ${props => props.disabled ? `var(--color-dark-light) !important` : props.active ? `var(--color-dark-grey)` : `transparent`};
    background: ${props => props.disabled ? `transparent !important` : props.active && `var(--color-dark) !important`};
  }

  &:hover {
    >div {
      transition: visibility 0s ease 0.4s, opacity 0.2s ease 0.4s;
      visibility: visible;
      opacity: 1;
    }

    >a {
      transition: padding-left 0.2s ease 0.4s;
      padding-left: 56px;
    }
  }
`

export const ServerName = styled(Link)`
  transition: all ease 0.1s;
  padding: 13px 24px;
  border: 1px solid transparent;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  position: relative;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  text-decoration: none;
  color: var(--color-white);
  background: var(--color-dark-light);

  &:hover {
    border: 1px solid var(--color-dark-grey);
    color: var(--color-grey-light);
    background: var(--color-dark);
  }

  &:active {
    background: var(--color-dark-grey-blur);
  }
`

export const ServerDisconnect = styled.div`
  position: absolute;
  visibility: hidden;
  z-index: 1;
  opacity: 0;
  padding: 10.5px 11px 8.5px 12px;
  border-radius: 50%;
  border: 1px solid var(--color-dark-grey);
  color: var(--color-grey-light);
  background: var(--color-dark);
  pointer-events: all;

  svg {
    width: 20px;
    height: 20px;
    color: var(--color-light-grey);
  }

  &:hover {
    color: var(--color-white);
  }

  &:active {
    background: var(--color-black);
  }
`
