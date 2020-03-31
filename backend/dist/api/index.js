"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _routes = require("../utils/routes");

var _default = function _default() {
  var app = (0, _express.Router)();
  (0, _routes.generateTreeList)(__dirname, "routes").then(function (routes) {
    return (0, _routes.addRoutes)(routes);
  }).then(function (routes) {
    return app.use("/", routes);
  });
  return app;
};

exports["default"] = _default;