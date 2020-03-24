import styled from "styled-components";

export const Wrapper = styled.div`
  font-family: var(--font-main);
  font-size: 16px;
  display: block;

  &:not(:first-child) {
    margin-top: 12px;
  }

  &:last-child {
    margin-bottom: 24px;
  }
`

export const Prompt = styled.div`
  display: flex;
  align-items: center;
`

export const Connection = styled.span`
  white-space: nowrap;
  color: var(--color-white);
`

export const Tree = styled.span`
  margin-left: 4px;
  color: var(--color-blue);
`

export const Input = styled.input`
  appearance: none;
  outline: none;
  user-select: all;
  border: none;
  margin-left: 8px;
  font-family: var(--font-code);
  font-size: 15px;
  color: var(--color-grey);
  width: 100%;
  background: none;

  &:read-only {
    cursor: default;
  }
`

export const Output = styled.div`
  font-family: var(--font-code);
  font-size: 15px;
  margin-top: 4px;
`

export const Line = styled.div`
  white-space: pre-wrap;
  user-select: text;
  line-height: 1.1;
  color: ${props => props.isError ? `var(--color-red)` : `var(--color-grey)`};
`
