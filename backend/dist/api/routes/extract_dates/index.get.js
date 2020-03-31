"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _request = _interopRequireDefault(require("request"));

var extraction = _interopRequireWildcard(require("../../../utils/extraction"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var href, filteredData;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            href = req.query.file;
            filteredData = "";
            (0, _request["default"])("https://www.sec.gov/Archives/edgar/d".concat(href), function (error, response, body) {
              var str = body;
              str = str.split("/Archives/edgar")[1];
              str = str.split('"')[0];
              (0, _request["default"])("https://www.sec.gov/Archives/edgar".concat(str), function (subError, subResponse, subBody) {
                filteredData = extraction.extractDataFromURL(subBody);
                res.send(filteredData);
              });
            });

          case 3:
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