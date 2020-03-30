import { Component } from "react";

const process = window.require("process");

const isMac = process.platform === "darwin";

export default class KeyEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cmd: false,
      alt: false,
      ctrl: false,
      shift: false
    }

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown)
    window.addEventListener("keyup", this.handleKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown)
    window.removeEventListener("keyup", this.handleKeyUp)
  }

  handleKeyDown(event) {
    let keys = this.state;
    let modifier = true;
    switch (event.keyCode) {
      case 91:
        keys.cmd = true;
        break;
      case 18:
        keys.alt = true;
        break;
      case 17:
        if (isMac) keys.ctrl = true;
        else keys.cmd = true;
        break;
      case 16:
        keys.shift = true;
        break;
      default:
        modifier= false;
    }
    if (modifier) {
      this.setState(keys);
      if (typeof this.props.onModifierKeys === "function") {
        this.props.onModifierKeys.call(this, keys);
      }
    } else {
      if (typeof this.props.onKeys === "function") {
        this.props.onKeys.call(this, event.key.toLowerCase(), event.keyCode, event)
      }
    }
  }

  handleKeyUp(event) {
    let keys = this.state;
    let modifier = true;
    switch (event.keyCode) {
      case 91:
        keys.cmd = false;
        break;
      case 18:
        keys.alt = false;
        break;
      case 17:
        if (isMac) keys.ctrl = false;
        else keys.cmd = false;
        break;
      case 16:
        keys.shift = false;
        break;
      default:
        modifier = false;
    }
    if (modifier) {
      this.setState(keys);
      if (typeof this.props.onModifierKeys === "function") {
        this.props.onModifierKeys.call(this, keys);
      }
    }
  }

  render() {
    return null;
  }
}
