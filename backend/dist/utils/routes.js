"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTreeList = exports.addRoutes = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var globalRoutePath = [];

var addRoutes = function addRoutes(items) {
  var expressRouter = _express["default"].Router();

  for (var _i = 0, _Object$entries = Object.entries(items); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
        routePath = _Object$entries$_i[0],
        currentRoute = _Object$entries$_i[1];

    if (currentRoute.type === "directory") {
      globalRoutePath.push(routePath);
      expressRouter.use("/".concat(routePath), addRoutes(currentRoute.items, false));
      globalRoutePath = globalRoutePath.slice(0, -1);
    } else if (currentRoute.type === "file") {
      var _routePath$split = routePath.split("."),
          _routePath$split2 = (0, _slicedToArray2["default"])(_routePath$split, 2),
          routeName = _routePath$split2[0],
          routeMethod = _routePath$split2[1];

      if (routeName === "index") routeName = "";
      expressRouter[routeMethod]("/" + routeName, require(_path["default"].join(currentRoute.dir, routePath))["default"]);
    } else {
      throw new Error("Invalid type!");
    }
  }

  return expressRouter;
};

exports.addRoutes = addRoutes;

var generateTreeList = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var structure,
        _len,
        ofFolder,
        _key,
        dir,
        _iteratorNormalCompletion,
        _didIteratorError,
        _iteratorError,
        _iterator,
        _step,
        item,
        stat,
        newItem,
        _args = arguments;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            structure = {};

            for (_len = _args.length, ofFolder = new Array(_len), _key = 0; _key < _len; _key++) {
              ofFolder[_key] = _args[_key];
            }

            _context.next = 4;
            return _fsExtra["default"].readdir(_path["default"].join.apply(_path["default"], ofFolder));

          case 4:
            dir = _context.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 8;
            _iterator = dir[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 26;
              break;
            }

            item = _step.value;
            _context.next = 14;
            return _fsExtra["default"].stat(_path["default"].join.apply(_path["default"], ofFolder.concat([item])));

          case 14:
            stat = _context.sent;

            if (!stat.isDirectory()) {
              _context.next = 22;
              break;
            }

            _context.next = 18;
            return generateTreeList.apply(void 0, ofFolder.concat([item]));

          case 18:
            newItem = _context.sent;
            structure[item] = {
              type: "directory",
              items: newItem,
              dir: ofFolder
            };
            _context.next = 23;
            break;

          case 22:
            structure[item] = {
              type: "file",
              dir: _path["default"].join.apply(_path["default"], ofFolder)
            };

          case 23:
            _iteratorNormalCompletion = true;
            _context.next = 10;
            break;

          case 26:
            _context.next = 32;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 32:
            _context.prev = 32;
            _context.prev = 33;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 35:
            _context.prev = 35;

            if (!_didIteratorError) {
              _context.next = 38;
              break;
            }

            throw _iteratorError;

          case 38:
            return _context.finish(35);

          case 39:
            return _context.finish(32);

          case 40:
            return _context.abrupt("return", structure);

          case 41:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[8, 28, 32, 40], [33,, 35, 39]]);
  }));

  return function generateTreeList() {
    return _ref.apply(this, arguments);
  };
}();

exports.generateTreeList = generateTreeList;