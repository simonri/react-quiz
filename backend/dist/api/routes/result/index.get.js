"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _xmlJs = _interopRequireDefault(require("xml-js"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var ticker, type, i, url, body, _body, _json, name, json, filings_list, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, context;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ticker = req.query.ticker;
            type = req.query.type;
            i = 1;
            url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&".concat(type, "=").concat(ticker, "&dateb=&owner=include&start=").concat(i * 100 - 100, "&count=").concat(i * 100, "&output=atom");
            _context.next = 6;
            return _axios["default"].get(url).then(function (res) {
              return res.data;
            });

          case 6:
            body = _context.sent;

            if (!body.includes("No matching Ticker Symbol.")) {
              _context.next = 20;
              break;
            }

            _context.next = 10;
            return _axios["default"].get("https://eodhistoricaldata.com/api/fundamentals/".concat(ticker, ".US?api_token=5d039059ec3318.16078074"));

          case 10:
            _body = _context.sent.data;
            _context.prev = 11;
            _json = JSON.parse(_body);
            name = _json.General.Name;
            return _context.abrupt("return", res.redirect("/result/?ticker=" + name + "&type=company"));

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](11);
            json = undefined;

          case 20:
            _context.prev = 20;
            json = JSON.parse(_xmlJs["default"].xml2json(body, {
              compact: true,
              spaces: 4
            }));
            _context.next = 27;
            break;

          case 24:
            _context.prev = 24;
            _context.t1 = _context["catch"](20);
            return _context.abrupt("return", res.render("error", {
              ticker: ticker.toUpperCase(),
              type: type
            }));

          case 27:
            filings_list = json.feed.entry.map(function (filing) {
              // filing file link
              var sec_file = filing.link._attributes.href.split("/edgar/d")[1];

              var sec_file_link = "/filing?file=".concat(sec_file); // filing date

              var date = filing.content["filing-date"]._text;
              var href_period = filing.category._attributes.term === "10-Q" ? "quarterly" : "yearly";
              return {
                ticker: filing.category._attributes.term,
                // the right way to get the ticker
                href: "".concat(sec_file_link, "&period=").concat(href_period, "&ticker=").concat(ticker, "&date=").concat(date),
                type: "",
                description: "",
                date: date
              };
            });
            _context.prev = 28;
            _context.next = 31;
            return _fsExtra["default"].readFile(_path["default"].join(__dirname, "..", "..", "served", "filings.csv"), {
              encoding: "utf-8"
            });

          case 31:
            data = _context.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 35;

            _loop = function _loop() {
              var line = _step.value;

              var _line$split = line.split(","),
                  _line$split2 = (0, _slicedToArray2["default"])(_line$split, 3),
                  starting = _line$split2[0],
                  type = _line$split2[1],
                  description = _line$split2[2];

              starting = starting.trim();
              filings_list.map(function (ticker_data) {
                return ticker_data.ticker.startsWith(starting) ? _objectSpread({}, ticker_data, {
                  type: type,
                  description: description
                }) : ticker_data;
              });
            };

            for (_iterator = data.split("\n")[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              _loop();
            }

            _context.next = 44;
            break;

          case 40:
            _context.prev = 40;
            _context.t2 = _context["catch"](35);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 44:
            _context.prev = 44;
            _context.prev = 45;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 47:
            _context.prev = 47;

            if (!_didIteratorError) {
              _context.next = 50;
              break;
            }

            throw _iteratorError;

          case 50:
            return _context.finish(47);

          case 51:
            return _context.finish(44);

          case 52:
            _context.next = 57;
            break;

          case 54:
            _context.prev = 54;
            _context.t3 = _context["catch"](28);
            void 0;

          case 57:
            _context.prev = 57;
            context = {
              ticker: ticker.toUpperCase(),
              filings_list: filings_list
            };
            res.render("result", context);
            return _context.finish(57);

          case 61:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 17], [20, 24], [28, 54, 57, 61], [35, 40, 44, 52], [45,, 47, 51]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;