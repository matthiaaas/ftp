import { Component } from "react"
import { withRouter } from "react-router";

class RouteChange extends Component {
  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange.call(this, location, action);
      } 
    });
  }
  
  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(RouteChange);
