import React, { Component } from "react";

import { Results as Wrapper, Result, Path, File, Match, Error } from "../styles";

export default class Results extends Component {
  render() {
    let show = this.props.show;
    let term = this.props.term;
    let results = this.props.results;
    let selected = this.props.selected;
    let defaultShow = this.props.defaultShow;

    return (
      <Wrapper show={defaultShow}>
        {results.length === 0 &&
          <Error>
            {term.length <= 1 ? "Try a search term" : "Nothing found"}
          </Error>
        }
        {results.slice(0, show).map((item, index) => {
          let split = [item.name, ""];
          if (term !== "") {
            split = item.name.toLowerCase().split(term)
          }

          return (
            <Result
              key={item.name + item.path + index}
              focus={index === selected}
              onClick={() => {
                this.props.onSelect.call(this, index);
              }}
            >
              <Path>{item.path}</Path>
              <File>
                <span>{split[0]}</span>
                <Match>{split.length !== 1 && term}</Match>
                <span>{split[1]}</span>
              </File>
            </Result>
          )
        })}
      </Wrapper>
    )
  } 
}
