"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _default = function _default(req, res) {
  _fsExtra["default"].readFile(_path["default"].join(__dirname, "..", "..", "..", "served", "rules.json"), function (err, data) {
    res.send(data);
  });
};

exports["default"] = _default;