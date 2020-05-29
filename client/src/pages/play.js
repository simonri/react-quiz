import React from "react";
import Helmet from "react-helmet";
import { Redirect } from "react-router-dom";
import {
  Card,
  FormGroup,
  Input,
  Row,
  Label,
  Button,
  Container,
} from "reactstrap";
import axios from "axios";

import Navbar from "../components/navbar";
import Quiz from "react-quiz-component";

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quiz: {},
    };

    this.renderCustomResultPage = this.renderCustomResultPage.bind(this);
  }

  renderCustomResultPage(obj) {
    return <h1>Score: {obj.numberOfCorrectAnswers}</h1>;
  }

  componentDidMount() {
    let id = this.props.match.params.id;

    axios.get("http://localhost:5000/api/quizzes/" + id).then((result) => {
      let quiz = result.data;

      quiz["quizTitle"] = quiz.name;

      quiz.questions.map((q) => {
        q["question"] = q["name"];
        q["questionType"] = "text";
        q["answerSelectionType"] = "single";
        q["answers"] = q["options"];
        q["correctAnswer"] = q["correct"];
      });

      this.setState({ quiz });

      console.log(this.state.quiz);
    });
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Play · Kahoot</title>
        </Helmet>
        <Navbar />

        <Container className="page">
          <Quiz
            quiz={this.state.quiz}
            shuffle={true}
            showDefaultResult={false}
            customResultPage={this.renderCustomResultPage}
          />
        </Container>
      </>
    );
  }
}
