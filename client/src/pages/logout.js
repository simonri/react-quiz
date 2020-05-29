import React, { Component } from "react";
import Helmet from "react-helmet";
import {
  Input,
  Label,
  FormGroup,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import authenticationService from "../services/authentication";

class Logout extends Component {
  constructor(props) {
    super(props);

    authenticationService.logout();
    this.props.history.push("/");
  }

  render() {
    return <></>;
  }
}

export default Logout;
