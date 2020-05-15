import styled from "styled-components";

import InputWrapper from "../../components/misc/Input";
import DropdownWrapper from "../../components/misc/Dropdown";

export const View = styled.main`

`

export const Content = styled.div`
  margin: 0 36px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 48px 0 40px;

  >div {
    margin-right: 16px;
  }
`

export const Login = styled.div`

`

export const Row = styled.div`
  display: flex;

  &:not(:last-child) {
    margin-bottom: 24px;
  }
`

export const Field = styled.div`
  &:not(:last-child) {
    margin-right: 32px;
  }
`

export const Label = styled.label`
  display: block;
  color: var(--color-gray-200);
  margin-bottom: 16px;
`

export const Input = styled(InputWrapper)`
  
`

export const Port = styled.div`
  height: 44px;
  padding: 12px 10px 12px 24px;
  box-sizing: border-box;
  border-radius: 22px;
  border: 1px solid var(--color-dark-100);
  display: flex;
  align-items: center;
  background: var(--color-dark-100);

  &:focus {
    background: red;
  }
`

export const InputPort = styled(InputWrapper)`
  padding: 0;
  overflow: hidden;
  margin-right: 12px;
  border-radius: 0;
  border: 0;
  border-bottom: 1px solid transparent;
  max-width: 52px !important;

  &:focus {
    border-color: var(--color-dark-400);
  }

  &:invalid {
    border-color: var(--color-red);
  }
`

export const Dropdown = styled(DropdownWrapper)`
  transition: all ease 0.1s;
  color: var(--color-gray-200);
  border-radius: 12px;
  border: 1px solid var(--color-dark-400);
  padding: 3px 8px;
  background: var(--color-dark-500);

  &:hover {
    color: var(--color-gray-100);
    background: var(--color-dark-600);
  }

  &:focus-within {
    color: var(--color-gray-200);
  }

  ul {
    margin-top: 16px;
    width: 180px;
    border: 1px solid var(--color-dark-400);
    border-radius: 4px;
    background: var(--color-dark-300);

    li {
      padding: 8px 20px;
      width: 100%;
      box-sizing: border-box;
      color: var(--color-gray-200);

      &:not(:last-child) {
        border-bottom: 1px solid var(--color-dark-600);
      }

      &:hover {
        background: var(--color-dark-600);
      }

      &[data-selected="true"] {
        color: var(--color-gray-100);
        background: var(--color-dark-200);
      }
    }
  }
`

export const SwitchAuth = styled.div`
  margin-top: -4px;
  margin-bottom: 10px;
`

export const AuthMode = styled.div<{selected?: boolean}>`
  transition: all ease 0.1s;
  position: relative;
  display: inline-block;
  color: ${props => props.selected ? `var(--color-gray-200) !important` : `var(--color-gray-400)`};
  border-radius: 14px;
  padding: 4px 8px 4px 28px;
  display: inline-block;
  border: 1px solid ${props => props.selected ? `var(--color-dark-500) !important` : `transparent`};

  &:not(:last-child) {
    margin-right: 4px;
  }

  &:hover {
    color: var(--color-gray-300);
    border-color: var(--color-dark-500);
  }

  &:active {
    border-color: var(--color-dark-600);
  }

  &::before {
    content: "";
    position: absolute;
    top: ${props => props.selected ? `9px` : `6px`};
    left: ${props => props.selected ? `9px` : `6px`};
    width: ${props => props.selected ? `6px` : `12px`};
    height: ${props => props.selected ? `6px` : `12px`};
    box-shadow: 0 0 0 ${props => props.selected ? `5px var(--color-dark-500)` : `1px var(--color-gray-400)`};
    border-radius: 50%;
    background: ${props => props.selected && `var(--color-gray-200)`};
  }
`
