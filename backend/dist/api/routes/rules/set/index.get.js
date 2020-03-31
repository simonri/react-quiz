"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _default = function _default(req, res) {
  var rules = req.body.rules;

  _fsExtra["default"].writeFile(_path["default"].join(__dirname, "..", "..", "..", "served", "rules.json"), rules);

  res.send({
    set: "OK"
  });
};

exports["default"] = _default;