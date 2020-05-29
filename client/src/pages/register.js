import React from "react";
import Helmet from "react-helmet";
import { Redirect } from "react-router-dom";
import {
  Alert,
  Card,
  Container,
  Input,
  Label,
  FormGroup,
  Button,
} from "reactstrap";
import useAuth from "../services/authentication";

import Navbar from "../components/navbar";

export default () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [registered, setRegistered] = React.useState(false);
  const [invalidPassword, setInvalidPassword] = React.useState(false);
  const [registerError, setRegisterError] = React.useState(null);

  const auth = useAuth();

  const handleInputChange = (updater) => (event) => updater(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      setInvalidPassword(true);
      return;
    }

    auth
      .register(email, password)
      .then((registered) => {
        setRegistered(registered);
      })
      .catch((e) => {
        setRegisterError(e.message);
      });
  };

  return registered || auth.loggedIn ? (
    <Redirect
      to={{
        pathname: "/login",
        state: {
          justRegistered: true,
        },
      }}
    />
  ) : (
    <>
      <Helmet>
        <title>Sign up · Kahoot</title>
      </Helmet>
      <Navbar />

      <Container>
        <div className="row align-middle">
          <div className="col-4 mx-auto text-center">
            <Card>
              <h2 className="mt-4 title text-center">
                <span>Sign Up</span>
              </h2>

              {registerError && (
                <Alert color="primary">Please try again!</Alert>
              )}
              <form onSubmit={onSubmit} className="p-4">
                <FormGroup>
                  <Input
                    required
                    type="email"
                    placeholder="Email"
                    onChange={handleInputChange(setEmail)}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    required
                    type="password"
                    placeholder="Password"
                    onChange={handleInputChange(setPassword)}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    required
                    type="password"
                    placeholder="Confirm password"
                    onChange={handleInputChange(setPasswordConfirm)}
                    invalid={invalidPassword}
                  />
                </FormGroup>
                <Button type="submit" className="btn btn-primary">
                  Sign Up
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
};
