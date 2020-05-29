import express from "express";
import * as quizController from "./quiz.controller";

export const quizRouter = express.Router();

quizRouter
  .route("/")
  .get(quizController.getAllQuizzes)
  .post(quizController.createQuiz);

quizRouter
  .route("/:id")
  .get(quizController.getOneQuiz)
  .put(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);
