import { Component } from "react"
import { withRouter, RouteComponentProps } from "react-router-dom";
import { UnregisterCallback } from "history";

interface IProps extends RouteComponentProps {
  onChange: any
}

class RouteChange extends Component<IProps, {unlisten: UnregisterCallback}> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      unlisten: () => {}
    }
  }

  componentWillMount() {
    this.setState({
      unlisten: this.props.history.listen((location: any) => {
        if (typeof this.props.onChange === "function") {
          window.localStorage.setItem("location", location.pathname);
          this.props.onChange.call(this, location);
        }
      })
    })
  }
  
  componentWillUnmount() {
    this.state.unlisten();
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(RouteChange);
