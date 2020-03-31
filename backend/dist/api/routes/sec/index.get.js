"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _xmlJs = _interopRequireDefault(require("xml-js"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var url, body, _url, _body, name;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&".concat(req.query.type, "=").concat(req.query.ticker, "&dateb=") + "&owner=include&start=0&count=100&output=atom";
            _context.prev = 1;
            _context.next = 4;
            return _axios["default"].get(url);

          case 4:
            body = _context.sent.data;

            if (!body.includes("No matching Ticker Symbol.")) {
              _context.next = 16;
              break;
            }

            _url = "https://eodhistoricaldata.com/api/fundamentals/".concat(req.query.ticker, ".US?api_token=5d039059ec3318.16078074");
            _context.next = 9;
            return _axios["default"].get(_url);

          case 9:
            _body = _context.sent;

            if (!(Object.getOwnPropertyNames(_body).length === 0)) {
              _context.next = 13;
              break;
            }

            res.send({
              error: 404
            });
            return _context.abrupt("return");

          case 13:
            name = _body.General.Name.replace(/" Corporation"|" Corp"/g, "");
            res.redirect("/result?ticker=".concat(name, "&type=company"));
            return _context.abrupt("return");

          case 16:
            res.send(_xmlJs["default"].xml2json(body, {
              compact: true,
              spaces: 4
            }));
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](1);
            res.send({
              error: 404
            });

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 19]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;