import { router } from "./api";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import errorhandler from "errorhandler";

const isProduction = process.env.NODE_ENV === "production";
const app = express();

app.use(cors());

app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("method-override")());

if (isProduction) {
  app.use(errorhandler());
}

app.use("/api", router);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({
    errors: Array.isArray(err.message) ? err.message : { message: err.message },
  });
});

export default app;
