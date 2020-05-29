import { Quiz } from "./quiz.model";
import { User } from "../user/user.model";
import { protect } from "../../modules/auth";
import { getUserFromToken } from "../user/user.controller";

export const getAllQuizzes = async (req, res, next) => {
  try {
    let quizzes = await Quiz.find({});

    res.status(200).json(quizzes);
  } catch (e) {
    next(e);
  }
};

export const createQuiz = [
  protect,
  getUserFromToken,
  async (req, res, next) => {
    const { user } = res.locals;
    const { name } = req.body;

    try {
      const quiz = await new Quiz({
        userId: user.id,
        name: name,
      }).save();

      try {
        User.findOneAndUpdate(
          {
            _id: user.id,
          },
          {
            $addToSet: { quizzes: quiz.id },
          }
        );

        res.status(200).json(quiz);
      } catch (e) {
        next(e);
      }
    } catch (e) {
      next(e);
    }

    res.sendStatus(200);
  },
];

export const getOneQuiz = [
  async (req, res, next) => {
    const { id } = req.params;

    try {
      let quiz = await Quiz.findOne({
        _id: id,
      });

      res.status(200).json(quiz);
    } catch (e) {
      next(e);
    }
  },
];

export const updateQuiz = [
  protect,
  getUserFromToken,
  async (req, res, next) => {
    const { id } = req.params;
    const update = req.body;

    try {
      let oldQuiz = await Quiz.findOneAndUpdate(
        {
          _id: id,
        },
        update
      );

      try {
        let newQuiz = await Quiz.findOne({
          _id: id,
        });

        res.status(200).json(newQuiz);
      } catch (e) {
        next(e);
      }
    } catch (e) {
      next(e);
    }
  },
];

export const deleteQuiz = [
  protect,
  getUserFromToken,
  async (req, res, next) => {
    const { user } = res.locals;
    const { id } = req.params;

    try {
      let quiz = await Quiz.findOneAndDelete({
        _id: id,
      });

      if (!quiz) return res.status(404).send("Quiz not found");

      const payload = {
        quiz,
        msg: "Quiz was deleted",
      };

      res.status(200).json(payload);
    } catch (e) {
      next(e);
    }
  },
];
