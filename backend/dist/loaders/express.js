"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _config = _interopRequireDefault(require("../config"));

var _api = _interopRequireDefault(require("../api"));

var _path = _interopRequireDefault(require("path"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _expressHttpProxy = _interopRequireDefault(require("express-http-proxy"));

/* eslint-disable no-unused-vars */
var _default = function _default(_ref) {
  var app = _ref.app;
  app.use(_bodyParser["default"].urlencoded({
    extended: false
  }));
  app.use(_bodyParser["default"].json());
  app.use((0, _cors["default"])());
  app.use((0, _cookieParser["default"])()); // Serve files

  app.set("views", _path["default"].join(__dirname, "..", "/views"));
  app.use("/", _express["default"]["static"](_path["default"].join(__dirname, "..", "public")));
  app.set("view engine", "ejs");
  app.use("/", (0, _api["default"])());
  app.get("/", function (req, res) {
    return res.render("index");
  }); // Catch 404

  app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  }); // Error handlers

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message
      }
    });
  });
};

exports["default"] = _default;