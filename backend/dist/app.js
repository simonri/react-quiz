"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _config = _interopRequireDefault(require("./config"));

var _loaders = _interopRequireDefault(require("./loaders"));

function startServer() {
  return _startServer.apply(this, arguments);
}

function _startServer() {
  _startServer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var app;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            app = (0, _express["default"])();
            (0, _loaders["default"])({
              expressApp: app
            });
            app.listen(_config["default"].port, function (err) {
              if (err) {
                app.locals.logger.error(err);
                process.exit(1);
              }

              app.locals.logger.info("Express running \u2192 PORT ".concat(_config["default"].port));
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _startServer.apply(this, arguments);
}

startServer();