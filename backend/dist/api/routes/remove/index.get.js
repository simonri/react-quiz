"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.end("<HTML>Removed annotation! <a href='/config'>Continue..</a></HTML>");

            _fs["default"].readFile(_path["default"].join(__dirname, "..", "config.json"), function read(err, data) {
              var config = JSON.parse(data);

              if (config.comments[req.query.id - 1].text === req.query.text) {
                config.comments.splice(req.query.id - 1, 1);
              }

              _fs["default"].writeFile(_path["default"].join(__dirname, "..", "config.json"), JSON.stringify(config));
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;