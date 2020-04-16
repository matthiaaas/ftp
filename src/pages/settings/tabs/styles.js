import styled from "styled-components";

export const Tab = styled.section`
  margin-top: 32px;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  color: var(--color-grey);
`

export const Setting = styled.div`
  opacity: ${props => props.disabled && `0.4`};
  pointer-events: ${props => props.disabled && `none`};

  &:not(:last-child) {
    margin-bottom: 32px;
  }
`

export const Label = styled.label`
  display: block;
  margin-bottom: 16px;
`

export const Radios = styled.div`
  >div:not(:last-child) {
    margin-right: 12px;
  }
`

export const Radio = styled.div`
  cursor: ${props => props.selected || `pointer`};
  position: relative;
  display: inline-block;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.selected ? `var(--color-white)` : `var(--color-grey)`};
  border: 1px solid ${props => props.selected ? `var(--color-blue)` : `var(--color-grey-dark)`};
  border-radius: 8px;
  padding: 13px 24px 13px 44px;
  display: inline-block;
  background: ${props => props.selected ? `var(--color-blue-blur)` : `transparent`};

  &:hover {
    background: ${props => props.selected || `var(--color-dark-grey-blur)`};
  }

  &:active {
    background: ${props => props.selected || `transparent`};
  }

  &::before {
    content: "";
    position: absolute;
    top: 13px;
    left: 18px;
    width: ${props => props.selected ? `6px` : `14px`};
    height: ${props => props.selected ? `6px` : `14px`};
    border: ${props => props.selected ? `5px solid var(--color-blue)` : `1px solid var(--color-grey-dark)`};
    border-radius: 50%;
    background: ${props => props.selected ? `var(--color-white)` : `transparent`};
  }
`
