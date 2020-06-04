import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

import { Upload } from "react-feather";

const ResizingWrapper = styled.div`

`

const Wrapper = styled.input(({ type }) => `
  appearance: none;
  outline: none;
  user-select: all;
  height: 44px;
  padding: 12px 24px;
  box-sizing: border-box;
  border-radius: 22px;
  border: 1px solid var(--color-dark-100);
  letter-spacing: ${type === "password" && "3px"};
  color: var(--color-white);
  display: inline-block;
  background: var(--color-dark-100);

  &::placeholder {
    color: var(--color-gray-200);
  }

  &:focus {
    border-color: var(--color-dark-400);
  }

  &:invalid {
    border-color: var(--color-red);
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`)

const Span = styled.span`
  visibility: hidden;
  display: none;
`

const WrapperBrowse = styled.div`
  appearance: none;
  outline: none;
  user-select: all;
  text-decoration: none;
  color: var(--color-gray-200);
  width: 200px;
  height: 44px;
  padding-left: 60px;
  box-sizing: border-box;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  position: relative;
  background: transparent;

  &:hover {
    color: var(--color-gray-100);
    
    >button {
      background: var(--color-dark-200);
    }
  }

  &:focus-within {
    >button {
      border-color: var(--color-dark-500);
      background: var(--color-dark-200);
    }
  }
`

const BrowseIcon = styled.button`
  appearance: none;
  outline: none;
  user-select: all;
  pointer-events: none;
  height: 100%;
  width: 44px;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 24px;
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  color: inherit;
  background: var(--color-dark-100);

  svg {
    width: 20px;
    height: 20px;
  }
`

const BrowseInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`

const BrowseText = styled.span<{invalid?: boolean, highlighted?: boolean}>(({ invalid, highlighted }) => `
  pointer-events: none;
  color: ${invalid ? `var(--color-red)` : highlighted ? `var(--color-white)` : `inherit`};
`)

interface IProps {
  type: string,
  defaultValue?: string,
  placeholder: string,
  dynamicResizing?: boolean,
  min?: number,
  max?: number,
  [x:string]: any
}

function Input(props: IProps) {
  const [content, setContent] = useState(props.placeholder);
  const [width, setWidth] = useState(0);

  const spanRef = useRef<HTMLDivElement>(null);
  const browseRef = useRef<HTMLInputElement>(null);
  
  const updateWidth = () => {
    const ref = spanRef.current;
    if (props.dynamicResizing && ref) {
      ref.style.display = "unset";
      setWidth(ref.offsetWidth);
      ref.style.display = "none";
    }
  }
  
  useEffect(updateWidth, [])
  
  if (props.type === "browse") {
    return (
      <WrapperBrowse
        tabIndex={1}
        onChange={props.onChange}
        onClick={() => browseRef.current?.click()}
      >
        <BrowseIcon tabIndex={-1}>
          <Upload />
        </BrowseIcon>
        <BrowseInput
          tabIndex={-1}
          type="file"
          ref={browseRef}
        />
        <BrowseText invalid={props.invalid} highlighted={props.defaultValue ? true : false}>{props.defaultValue || "Browse..."}</BrowseText>
      </WrapperBrowse>
    )
  } else if (props.dynamicResizing) {
    return (
      <ResizingWrapper>
        <Span ref={spanRef}>{content}</Span>
        <Wrapper
          {...props}
          style={{
            ...props.style,
            width: `${width + 4}px`
          }}
          onChange={(event) => {
            setContent(event.target.value || props.placeholder);
            setTimeout(updateWidth, 0);
            if (props.onChange) props.onChange(event);
          }}
        />
      </ResizingWrapper>
    )
  } else {
    return (
      <Wrapper {...props} />
    )
  }
}

export default Input;
