import React, { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
`

const Select = styled.select`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
`

const Selected = styled.span`

`

const Options = styled.ul`
  z-index: 10;
  position: absolute;
  top: 100%;
  left: 0;
  overflow: hidden;
`

const Option = styled.li`
  
`

export interface IOption {
  name: string,
  value?: any,
  selected?: boolean
}

export type TOptions = Array<IOption>;

interface IProps {
  options: TOptions,
  onChange?: any
}

function Dropdown(props: IProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(props.options);
  const [selected, setSelected] = useState(
    options.find(elem => elem.selected) || options[0]
  )

  const updateOptions = (i: number) => {
    let newOptions: TOptions = options;
    newOptions.forEach((elem, index) =>
      index === i ? elem.selected = true
      : elem.selected = false
    );
    const newSelected: IOption = newOptions[i];
    if (props.onChange) {
      props.onChange(newOptions, newSelected)
    }
    setOptions(newOptions);
    setSelected(newSelected);
  }

  return (
    <Wrapper {...props}>
      <Select
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
      />
      <Selected>{selected.name}</Selected>
      {open &&
        <Options>
          {options.map((option: IOption, index: number) => {
            return (
              <Option
                key={index}
                data-selected={selected === option}
                onMouseDown={() => updateOptions(index)}
              >{option.name}</Option>
            );
          })}
        </Options>
      }
    </Wrapper>
  )
}

export default Dropdown;
