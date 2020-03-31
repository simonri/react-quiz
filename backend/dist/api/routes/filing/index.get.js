"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var body1, str, body, ticker, period, periodOfReport, jsonBody, ret, financialsData, balanceSheetData, incomeStatementData, periodOfReportData, periodOfReportYear, context;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _axios["default"].get("https://www.sec.gov/Archives/edgar/d".concat(req.query.file)).then(function (res) {
              return res.data;
            });

          case 2:
            body1 = _context.sent;
            str = body1.split("/Archives/edgar")[1].split('"')[0];
            _context.next = 6;
            return _axios["default"].get("https://www.sec.gov/Archives/edgar".concat(str)).then(function (res) {
              return res.data;
            });

          case 6:
            body = _context.sent;
            // Get the data from the eod API
            ticker = req.query.ticker;
            period = req.query.period;
            periodOfReport = req.query.date;
            _context.next = 12;
            return _axios["default"].get("https://eodhistoricaldata.com/api/fundamentals/".concat(ticker, ".US?api_token=5d039059ec3318.16078074")).then(function (res) {
              return res.data;
            });

          case 12:
            jsonBody = _context.sent;
            ret = {
              response: jsonBody,
              body: body
            };

            if (!(jsonBody === "Unauthorized")) {
              _context.next = 18;
              break;
            }

            return _context.abrupt("return", res.render("filing", ret));

          case 18:
            financialsData = jsonBody["Financials"];
            balanceSheetData = financialsData["Balance_Sheet"][period][periodOfReport];
            incomeStatementData = financialsData["Income_Statement"][period][periodOfReport];
            periodOfReportData = JSON.stringify(_objectSpread({}, balanceSheetData, {}, incomeStatementData));
            financialsData = JSON.stringify(financialsData);
            periodOfReportYear = periodOfReport.split("-")[0];
            context = _objectSpread({}, ret, {
              period: period,
              periodOfReport: periodOfReport,
              periodOfReportYear: periodOfReportYear,
              periodOfReportData: periodOfReportData,
              financialsData: financialsData
            });
            return _context.abrupt("return", res.render("filing", context));

          case 26:
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