import React from "react";
import Helmet from "react-helmet";

import Navbar from "./components/navbar";
import Quizzes from "./components/quizzes";

import { Container, Row, Col } from "reactstrap";

export default () => (
  <>
    <Helmet>
      <title>Home · Kahoot</title>
    </Helmet>
    <Navbar />

    <Container className="page">
      <Quizzes />
    </Container>
  </>
);
