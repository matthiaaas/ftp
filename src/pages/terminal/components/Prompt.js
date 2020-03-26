import styled from "styled-components";

export const Wrapper = styled.div`
  font-family: var(--font-code);
  font-size: 15px;
  color: var(--color-grey);
  display: flex;
  align-items: center;
`

export const Text = styled.span`

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
