import styled from "styled-components";

export const Wrapper = styled.div`
  z-index: 11;
  top: 0;
  left: 0;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  background: var(--color-dark-blur);
`

export const Space = styled.div`
  z-index: 10;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`

export const Body = styled.div`
  z-index: 11;
  position: absolute;
  top: 128px;
  transition: all ease 0.2s;
  color: var(--color-grey);
  border: 1px solid var(--color-dark-grey);
  border-radius: 8px;
  overflow: hidden;
  width: 488px;
  background: var(--color-dark);
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-dark-grey);
  background: var(--color-black);

  svg {
    width: 20px;
    height: 20px;
  }
`

export const Input = styled.input`
  appearance: none;
  outline: none;
  user-select: all;
  border: none;
  background: transparent;
  margin-left: 12px;
  width: 288px;
  color: var(--color-white);

  &::placeholder {
    color: var(--color-grey);
  }
`

export const Tips = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
`

export const Tip = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-grey-dark);

  svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    animation-name: animLoader;
    animation-duration: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;

    @keyframes animLoader {
      from {
        transform: rotate(0)
      } to {
        transform: rotate(360deg)
      }
    }
  }
`

export const Section = styled.section`
  padding: 12px 0;
  border-bottom: 1px solid var(--color-dark-grey);
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`

export const Action = styled.div`
  text-transform: uppercase;
  font-size: 14px;
  color: var(--color-grey-dark);

  &:hover {
    color: ${props => props.disabled || `var(--color-grey)`};
  }
`

export const Results = styled.ul`
  margin-top: 8px;
  max-height: ${props => props.show * 32}px;
  overflow-y: scroll;
`

export const Result = styled.li`
  display: flex;
  align-items: center;
  padding: 6px 24px;
  box-sizing: border-box;
  width: 100%;
  color: ${props => props.focus && `var(--color-grey-light)`};
  background: ${props => props.focus ? `var(--color-dark-light) !important` : `transparent`};

  &:hover {
    background: var(--color-dark-grey-blur);
  }
`

export const Path = styled.span`
  margin-right: 4px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const File = styled.div`
  text-transform: uppercase;
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid var(--color-grey-dark);
  color: inherit;
  white-space: nowrap;
`

export const Match = styled.span`
  color: var(--color-white);
`

export const Error = styled.div`
  margin-left: 24px;
  height: 20px;
`
