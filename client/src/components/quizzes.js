import React from "react";
import {
  Alert,
  Col,
  Row,
  Card,
  Input,
  Label,
  FormGroup,
  Button,
} from "reactstrap";
import axios from "axios";

import { Link } from "react-router-dom";

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quizzes: [],
    };
  }

  componentDidMount() {
    axios.get("http://localhost:5000/api/quizzes").then((result) => {
      let quizzes = result.data.map((quiz) => {
        return (
          <Card key={quiz.id}>
            <div className="card-body">
              <Row>
                <Col>
                  <Link to={`/play/${quiz.id}`}>
                    <h3 className="card-title">{quiz.name}</h3>
                  </Link>
                </Col>
                <Col className="text-right">
                  <Link to={`/edit_quiz/${quiz.id}`}>
                    <Button>Edit</Button>
                  </Link>
                </Col>
              </Row>
            </div>
          </Card>
        );
      });
      this.setState({ quizzes: quizzes });
    });
  }

  render() {
    return (
      <>
        <div className="quizzes">{this.state.quizzes}</div>
      </>
    );
  }
}
