import styled from "styled-components";

import { Link } from "react-router-dom";

export const Aside = styled.aside`
  z-index: 8;
  position: fixed;
  top: 0;
  width: 200px;
  height: 100vh;
  border-right: 1px solid var(--color-dark-400);
  background: var(--color-dark-200);
`

export const Content = styled.div`
  margin-top: 36px;
`

export const Nav = styled.ul`
  padding-top: 152px;
`

export const Item = styled.li<{active: boolean}>(({ active }) => `
  color: ${active ? `var(--color-white) !important` : `var(--color-gray-200)`};
  background: ${active && `var(--color-dark-100) !important`};

  svg {
    color: ${active && `var(--color-blue) !important`};
  }

  &:hover {
    color: var(--color-gray-100);
    background: var(--color-dark-300);
  }

  &:active {
    color: var(--color-gray-200);
  }
`)

export const Url = styled(Link)`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 16px 36px;
  text-decoration: none;
`

export const Icon = styled.div`
  margin-right: 16px;
  width: 20px;
  height: 20px;

  svg {
    width: inherit;
    height: inherit;
    color: inherit;
  }
`

export const Text = styled.span`
  color: inherit;
`
