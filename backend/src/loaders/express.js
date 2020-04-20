import express from "express";
import routes from "../api";
import path from "path";

import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

export default ({ app }) => {
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(bodyParser.json());
	app.use(cors());
	app.use(cookieParser());

	// Serve files
	app.set("views", path.join(__dirname, "..", "/views"));
	app.use("/", express.static(path.join(__dirname, "..", "public")));

	app.set("view engine", "ejs");

	app.use("/", routes());

	app.get("/", (req, res) => res.render("index"));
	app.get("/create", (req, res) => res.render("create"));

	// Catch 404
	app.use((req, res, next) => {
		const err = new Error("Not Found");
		err.status = 404;
		next(err);
	});

	// Error handlers
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.json({ errors: { message: err.message } });
	});
};
