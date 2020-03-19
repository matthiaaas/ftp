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

export const ServerStatus = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 16px;

  background: ${
    props => props.status === "online" ? `var(--color-green)`
    : props.status === "afk" ? `var(--color-yellow)` : `var(--color-red)`
  };
`

export const Login = styled.section`
  padding-top: 40px;
`

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -24px;

  &:not(:first-child) {
    margin-top: 24px;
  }
`

export const Input = styled.div`
  position: relative;
  width: 100%;
  max-width: 216px;
  margin-bottom: 24px;

  &:not(:last-child) {
    margin-right: 32px;
  }

  &.show-tip {
    .tip {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const Label = styled.label`
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  color: var(--color-grey);
  display: block;
  margin-bottom: 16px;
`

export const Tip = styled.div`
  cursor: default;
  transition: all ease 0.4s;
  opacity: 0;
  transform: translateY(-10px);
  position: absolute;
  top: 95px;
  right: 0;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 14px;
  color: var(--color-grey);

  .highlighted {
    border-bottom: 1px solid var(--color-grey);
    padding-bottom: 2px;

    &:hover {
      border-bottom: 1px solid var(--color-grey-light);
      color: var(--color-grey-light);
    }
  }
`

export const QuickActions = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 40px;
  list-style: none;
`
