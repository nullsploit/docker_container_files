"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdateapp"]("main",{

/***/ "./src/ContainerApp.js":
/*!*****************************!*\
  !*** ./src/ContainerApp.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var quill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! quill */ \"./node_modules/quill/dist/quill.js\");\n/* harmony import */ var quill__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(quill__WEBPACK_IMPORTED_MODULE_1__);\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && \"function\" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }, _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } Object.defineProperty(subClass, \"prototype\", { value: Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }), writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } else if (call !== void 0) { throw new TypeError(\"Derived constructors may only return object or undefined\"); } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\n\nvar ContainerApp = /*#__PURE__*/function (_Component) {\n  _inherits(ContainerApp, _Component);\n\n  var _super = _createSuper(ContainerApp);\n\n  function ContainerApp(props) {\n    var _this;\n\n    _classCallCheck(this, ContainerApp);\n\n    _this = _super.call(this, props);\n\n    _defineProperty(_assertThisInitialized(_this), \"directoryClick\", function (directory) {\n      if (directory.endsWith(\"/\")) {\n        // check if last character is ../\n        if (directory.slice(-3) === \"../\") {\n          // get the directory without the last ../\n          var directory = directory.slice(0, -3); // split the directory by /\n\n          var directory_array = directory.split(\"/\"); // remove empty strings from the array\n\n          directory_array = directory_array.filter(function (el) {\n            return el != \"\";\n          }); // remove the last element from the array\n\n          directory_array.pop(); // join the array back into a string\n\n          directory = directory_array.join(\"/\"); // directory_array.pop();\n\n          if (!directory.startsWith(\"/\")) {\n            directory = \"/\" + directory;\n          }\n\n          if (!directory.endsWith(\"/\")) {\n            directory = directory + \"/\";\n          } // directory = \"/\"+directory_array.join(\"/\");\n          // directory = directory.replace(/\\/\\//g, \"/\");\n\n        } // replace // with /\n\n\n        _this.getDirectory(_this.state.container_name, directory).then(function (response) {\n          // console.log(response)\n          _this.setState({\n            directory: directory,\n            directory_items: response.items\n          });\n        });\n      }\n    });\n\n    _defineProperty(_assertThisInitialized(_this), \"getDirectory\", function (container_name, directory) {\n      return new Promise(function (resolve, reject) {\n        fetch(\"/api/get_directory/\".concat(container_name, \"/?dir=\").concat(directory), {\n          method: \"GET\",\n          headers: {\n            \"Content-Type\": \"application/json\"\n          }\n        }) // .then(response => response.text())\n        // .then(text => {\n        //   console.log(text);\n        // })\n        .then(function (response) {\n          return response.json();\n        }).then(function (data) {\n          resolve(data);\n        })[\"catch\"](function (error) {\n          reject(error);\n        });\n      });\n    });\n\n    _this.state = {\n      directory: \"\",\n      directory_items: [],\n      container_name: \"\",\n      container: {}\n    };\n    return _this;\n  }\n\n  _createClass(ContainerApp, [{\n    key: \"componentDidMount\",\n    value: function componentDidMount() {\n      var _this2 = this;\n\n      var container_name = window.getContainerName();\n      var container = window.getContainerObject();\n      this.getDirectory(container_name, \"/\").then(function (response) {\n        // console.log(response)\n        _this2.setState({\n          directory: \"/\",\n          directory_items: response.items,\n          container_name: container_name,\n          container: container\n        });\n      });\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      var _this3 = this;\n\n      var editor = new (quill__WEBPACK_IMPORTED_MODULE_1___default())('#text_editor');\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", {\n        className: \"col-lg-6\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", {\n        className: \"card\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", {\n        className: \"card-header\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", {\n        className: \"row\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", {\n        className: \"col-lg-6\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"button\", {\n        onClick: function onClick() {\n          window.location.href = \"/\";\n        },\n        className: \"btn btn-sm btn-primary\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"i\", {\n        className: \"fa fa-arrow-left\"\n      }), \" Back\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"h4\", null, this.state.container_name)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", null, this.state.directory)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", {\n        className: \"col-lg-6\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", null, this.state.container.status == \"running\" ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"span\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"i\", {\n        className: \"fa fa-play text-success\"\n      }), \" \", this.state.container.status) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"span\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"i\", {\n        className: \"fa fa-stop text-danger\"\n      }), \" \", this.state.container.status))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", {\n        className: \"card-body\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"table\", {\n        className: \"table table-sm table-striped\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"thead\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"tr\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"th\", null, \"Path\"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"tbody\", null, this.state.directory_items.map(function (item, index) {\n        if (item != \"./\") {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"tr\", {\n            key: index,\n            onClick: function onClick() {\n              _this3.directoryClick(\"\".concat(_this3.state.directory).concat(item));\n            }\n          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"td\", null, item));\n        }\n      })))))));\n    }\n  }]);\n\n  return ContainerApp;\n}(react__WEBPACK_IMPORTED_MODULE_0__.Component);\n\n;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ContainerApp);\n\n//# sourceURL=webpack://app/./src/ContainerApp.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("afccc8ce6c8bc2eabcce")
/******/ })();
/******/ 
/******/ }
);