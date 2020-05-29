import express from "express";
import * as userController from "./user.controller";

export const userRouter = express.Router();

userRouter
  .route("/")
  .get(userController.getOneUser)
  .put(userController.updateUser);
