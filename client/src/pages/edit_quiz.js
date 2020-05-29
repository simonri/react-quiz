import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { Redirect } from "react-router-dom";
import {
  Card,
  InputGroup,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
  Button,
  Container,
} from "reactstrap";
import axios from "axios";
import useAuth from "../services/authentication";

import Navbar from "../components/navbar";

export default (props) => {
  const [name, setName] = useState("");

  const [quiz, setQuiz] = useState({ questions: [] });
  const [loggedIn, setLoggedIn] = useState(false);

  const auth = useAuth();

  const handleChange = (event) => {
    if (["name", "correct"].includes(event.target.name)) {
      let newQuestions = [...quiz.questions];

      newQuestions[event.target.dataset.id][event.target.name] =
        event.target.value;

      setQuiz({ ...quiz, questions: newQuestions });
    } else if (["title"].includes(event.target.name)) {
      setQuiz({ ...quiz, name: event.target.value });
    } else if (["option"].includes(event.target.name)) {
      let newQuestions = [...quiz.questions];

      let questionId = event.target.dataset.question.split("-")[1];

      newQuestions[questionId].options[event.target.dataset.id] =
        event.target.value;

      setQuiz({ ...quiz, questions: newQuestions });
    }
  };

  useEffect(() => {
    let id = props.match.params.id;

    axios.get("http://localhost:5000/api/quizzes/" + id).then((result) => {
      let quiz = result.data;
      setQuiz(quiz);
      setName(quiz.name);
    });
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();

    editQuiz(quiz);
  };

  const addQuestion = (event) => {
    event.preventDefault();

    let newQuestions = quiz.questions.concat({
      name: "",
      correct: "",
      options: ["", "", "", ""],
    });
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const editQuiz = async (newQuiz) => {
    const config = auth.getToken();

    await axios.put(
      "http://localhost:5000/api/quizzes/" + newQuiz.id,
      newQuiz,
      config
    );

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
        <h1>Edit quiz</h1>
        <form onSubmit={onSubmit} onChange={handleChange}>
          <p>Name:</p>
          <FormGroup>
            <Input
              name="title"
              type="text"
              placeholder="Name"
              value={quiz.name}
            />
          </FormGroup>

          <FormGroup>
            <Button onClick={addQuestion} className="btn btn-primary">
              Add new question
            </Button>
          </FormGroup>

          {quiz.questions.map((val, idx) => {
            let questionId = `question-${idx}`,
              correctId = `correct-${idx}`;

            return (
              <FormGroup className="question" key={idx}>
                <label
                  htmlFor={questionId}
                  className="font-weight-bold"
                >{`Question #${idx + 1}`}</label>

                <FormGroup>
                  <Input
                    name={questionId}
                    data-id={idx}
                    id={questionId}
                    type="text"
                    name="name"
                    value={val.name}
                  />
                </FormGroup>

                {val &&
                  val.options.map((val2, idx) => {
                    let optionId = `option-${idx}`;

                    return (
                      <FormGroup key={idx}>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>{idx + 1}</InputGroupText>
                          </InputGroupAddon>
                          <Input
                            name={optionId}
                            data-id={idx}
                            id={optionId}
                            type="text"
                            name="option"
                            data-question={questionId}
                            value={val2}
                          />
                        </InputGroup>
                      </FormGroup>
                    );
                  })}

                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Correct index</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name={correctId}
                    data-id={idx}
                    id={correctId}
                    type="text"
                    name="correct"
                    value={val.correct}
                  />
                </InputGroup>
              </FormGroup>
            );
          })}

          <FormGroup>
            <Button type="submit" className="btn btn-primary">
              Update
            </Button>
          </FormGroup>
        </form>
      </Container>
    </>
  );
};
