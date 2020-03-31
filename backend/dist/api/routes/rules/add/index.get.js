"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _default = function _default(req, res) {
  var logic = req.body.logic;
  var text = req.body.text.trim();
  var sections = JSON.parse(req.body.sections);
  logic = logic.replace(/and/g, " && ");
  logic = logic.replace(/\n|\r/g, "");
  var rules;
  var rule = {
    logic: logic,
    text: text,
    sections: sections
  };

  _fsExtra["default"].readFile(_path["default"].join(__dirname, "..", "..", "..", "served", "rules.json"), function (err, data) {
    rules = JSON.parse(data);
    rules.push(rule);

    _fsExtra["default"].writeFile(_path["default"].join(__dirname, "..", "..", "..", "served", "rules.json"), JSON.stringify(rules));
  });

  res.send({
    added: "OK"
  });
};

exports["default"] = _default;