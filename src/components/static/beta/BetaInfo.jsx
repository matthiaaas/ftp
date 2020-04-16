import React, { Component } from "react";

import Popup from "../../misc/Popup";
import Headline from "../../misc/Headline";

import { Teaser, Article } from "./styles";

export default class BetaInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    }

    this.close = this.close.bind(this);
  }

  componentDidMount() {
    if (!window.localStorage.hasOwnProperty("returning_user")) {
      this.setState({
        show: true
      })
      window.localStorage.setItem("returning_user", "true");
    }
  }

  close() {
    this.setState({ show: false })
  }

  render() {
    if (this.state.show) {
      return (
        <Popup
          style={{ maxWidth: "400px" }}
          onClose={this.close}
        > 
          <Teaser>welcome to transflow beta</Teaser>
          <Headline>Glad to see you</Headline>
          <Article>
            Transflow is in an early stage and released way before reaching a stable production build.
          </Article>
          <Article>
            This is an appeal to you ― contribute to this app and help making Transflow the best alternative to FileZilla and Putty. Thanks. Now press ESC
          </Article>
          <Article>
            Yep, this is the only popup you'll see
          </Article>
        </Popup>
      )
    } else return null;
  }
}
