import React from "react";
import Helmet from "react-helmet";
import { Redirect } from "react-router-dom";
import {
  Alert,
  Card,
  Input,
  Label,
  FormGroup,
  Button,
  Container,
} from "reactstrap";
import useAuth from "../services/authentication";

import Navbar from "../components/navbar";

export default () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [rememberLogin, setRemember] = React.useState(false);
  const [loginError, setLoginError] = React.useState(null);

  const auth = useAuth();

  const handleInputChange = (updater) => (event) => updater(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();

    auth
      .login(email, password, rememberLogin)
      .then((loggedIn) => {
        setLoggedIn(loggedIn);
      })
      .catch((e) => {
        setLoginError(e.message);
      });
  };

  if (loggedIn || auth.loggedIn) {
    if (process.env.NODE_ENV !== "production") {
      window.location.replace("/");
      return;
    }

    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Sign in · Kahoot</title>
      </Helmet>
      <Navbar />

      <Container>
        <div className="row align-middle">
          <div className="col-4 mx-auto text-center">
            <Card>
              <h2 className="mt-4 title text-center">
                <span>Login</span>
              </h2>

              {loginError && <Alert color="primary">Please try again!</Alert>}
              <form onSubmit={onSubmit} className="p-4">
                <FormGroup>
                  <Input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    onChange={handleInputChange(setEmail)}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    onChange={handleInputChange(setPassword)}
                  />
                </FormGroup>
                <FormGroup>
                  <Button type="submit" className="btn btn-primary">
                    Login
                  </Button>
                </FormGroup>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
};
