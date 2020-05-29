import React from "react";
import Helmet from "react-helmet";
import { Redirect } from "react-router-dom";
import { Card, FormGroup, Input, Label, Button, Container } from "reactstrap";
import axios from "axios";
import useAuth from "../services/authentication";

import Navbar from "../components/navbar";

export default () => {
  const [name, setName] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);

  const auth = useAuth();

  const handleInputChange = (updater) => (event) => updater(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();

    createQuiz(name);
  };

  const createQuiz = async (name) => {
    const payload = { name };
    const config = auth.getToken();

    await axios.post("http://localhost:5000/api/quizzes", payload, config);
    return window.location.replace("/");
  };

  if (!loggedIn && !auth.loggedIn) {
    return window.location.replace("/");
  }

  return (
    <>
      <Helmet>
        <title>Create Quiz · Kahoot</title>
      </Helmet>
      <Navbar />

      <Container className="page">
        <form onSubmit={onSubmit} className="p-4">
          <FormGroup>
            <Input
              name="name"
              type="text"
              className="form-control"
              placeholder="Name"
              onChange={handleInputChange(setName)}
            />
          </FormGroup>
          <FormGroup>
            <Button type="submit" className="btn btn-primary">
              Create
            </Button>
          </FormGroup>
        </form>
      </Container>
    </>
  );
};
