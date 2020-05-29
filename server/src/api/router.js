import express from "express";
import { protect, register, login, changePassword } from "./modules/auth";
import { validateChangePassword } from "./modules/validate";
import { quizRouter } from "./resources/quiz";
import { userRouter } from "./resources/user";

export const router = express.Router();

// Auth routes
router.route("/register").post(register);
router.route("/login").post(login);
router
  .route("/change_password")
  .post(validateChangePassword, protect, changePassword);

// Resource routes
router.use("/users", userRouter);
router.use("/quizzes", quizRouter);
