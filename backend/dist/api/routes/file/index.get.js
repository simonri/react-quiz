"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$query, ticker, file, URLs, _ref2, _ref3, edgar, eod, period_of_report, Financials_data, _period_of_report$spl, _period_of_report$spl2, year, month, day, str, edgarArchive, s;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$query = req.query, ticker = _req$query.ticker, file = _req$query.file;
            URLs = [_axios["default"].get("https://www.sec.gov/Archives/edgar/d".concat(file)), _axios["default"].get("https://eodhistoricaldata.com/api/fundamentals/".concat(ticker, ".US?api_token=5d039059ec3318.16078074"))];
            _context.next = 4;
            return Promise.all(URLs).then(function (_ref4) {
              var _ref5 = (0, _slicedToArray2["default"])(_ref4, 2),
                  edgar = _ref5[0],
                  eod = _ref5[1];

              return [edgar.data, eod.data];
            });

          case 4:
            _ref2 = _context.sent;
            _ref3 = (0, _slicedToArray2["default"])(_ref2, 2);
            edgar = _ref3[0];
            eod = _ref3[1];
            period_of_report = edgar.split('<div class="infoHead">Period of Report</div>')[1].split("</div>")[0].replace('<div class="info">', "").trim();
            Financials_data = eod.Financials;
            _period_of_report$spl = period_of_report.split("-").map(function (i) {
              return parseInt(i);
            }), _period_of_report$spl2 = (0, _slicedToArray2["default"])(_period_of_report$spl, 3), year = _period_of_report$spl2[0], month = _period_of_report$spl2[1], day = _period_of_report$spl2[2];
            str = edgar.split("/Archives/edgar")[1].split('"')[0];
            _context.next = 14;
            return _axios["default"].get("https://www.sec.gov/Archives/edgar".concat(str)).then(function (res) {
              return res.data;
            });

          case 14:
            edgarArchive = _context.sent;
            s = edgarArchive.split(/<body style="(.+);">\n(.*)\t<\/body>/);
            res.send(JSON.stringify({
              periodOfReport: {
                year: year,
                month: month,
                day: day
              },
              financialData: Financials_data,
              body: "<div style=\"".concat(s[1], "\">").concat(s[2], "</div>")
            }));

          case 17:
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