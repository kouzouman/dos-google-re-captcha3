"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReCaptcha3Server = exports.ReCaptcha3Client = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * GoogleReCaptchaのラッパー＠クライアント
 */
var ReCaptcha3Client =
/*#__PURE__*/
function () {
  function ReCaptcha3Client() {
    _classCallCheck(this, ReCaptcha3Client);
  }

  _createClass(ReCaptcha3Client, null, [{
    key: "RECAPTCHA_API",

    /**
     * サイトキーを引数にトークンを取得するためのAPI URL
     */
    value: function RECAPTCHA_API(siteKey) {
      return "https://www.google.com/recaptcha/api.js?render=".concat(siteKey);
    }
    /**
     * サイトキーを引数に初期化
     * @param {String} siteKey
     * @param {Option String} id
     */

  }, {
    key: "init",
    value: function init(siteKey, id) {
      ReCaptcha3Client.siteKey = siteKey; // URLをhtmlに挿入

      var element = !id ? document.querySelector('body') : document.querySelector("#".concat(id));
      var scriptDom = document.createElement('script');
      scriptDom.setAttribute('src', ReCaptcha3Client.RECAPTCHA_API(siteKey));
      element.appendChild(scriptDom);
    }
    /**
     * クライアントトークンを取得
     * @param {*} siteKey
     */

  }, {
    key: "getToken",
    value: function () {
      var _getToken = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  var counter = 0;
                  var timer = setInterval(function () {
                    // 5秒以上トークン初期化が完了しない場合エラー
                    counter++;

                    if (counter > 50) {
                      clearInterval(timer);
                      return reject(false);
                    } //  初期化されていない場合このループを終わる


                    if (typeof grecaptcha == 'undefined') {
                      return false;
                    }

                    clearInterval(timer); //  初期化が確認できたため、トークンを取得

                    grecaptcha.ready(function () {
                      grecaptcha.execute(ReCaptcha3Client.siteKey, {
                        action: 'homepage'
                      }).then(function (token) {
                        resolve(token);
                      });
                    });
                  }, 100);
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getToken() {
        return _getToken.apply(this, arguments);
      }

      return getToken;
    }()
  }]);

  return ReCaptcha3Client;
}();
/**
 * GoogleReCaptchaのラッパー＠サーバ
 */


exports.ReCaptcha3Client = ReCaptcha3Client;

var ReCaptcha3Server =
/*#__PURE__*/
function () {
  function ReCaptcha3Server() {
    _classCallCheck(this, ReCaptcha3Server);
  }

  _createClass(ReCaptcha3Server, null, [{
    key: "getScore",

    /**
     * スコアレスポンスを取得
     * @param {*} secretKey
     * @param {*} token
     * @param {*} ip
     */
    value: function () {
      var _getScore = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(secretKey, token, ip) {
        var res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return ReCaptcha3Client.post(ReCaptcha3Server.RECAPTCHA_API, {
                  secret: secretKey,
                  response: token,
                  remoteip: ip
                });

              case 2:
                res = _context2.sent;
                return _context2.abrupt("return", !!res && !!res.data ? res.data : {
                  success: false
                });

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getScore(_x, _x2, _x3) {
        return _getScore.apply(this, arguments);
      }

      return getScore;
    }()
    /**
     * POSTメソッドでアクセスする
     * @param {String} url
     * @param {Object} param
     */

  }, {
    key: "post",
    value: function () {
      var _post = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(url, param) {
        var res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _axios.default.post("".concat(url), ReCaptcha3Client.combParamStr(param));

              case 2:
                res = _context3.sent;
                return _context3.abrupt("return", res);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function post(_x4, _x5) {
        return _post.apply(this, arguments);
      }

      return post;
    }()
    /**
     * パラメータのオブジェクトを文字列に変換
     * @param {Object} params
     */

  }, {
    key: "combParamStr",
    value: function combParamStr(params) {
      var res = new URLSearchParams();
      cf.Object2Array(params).forEach(function (v) {
        res.append(v.key, v.value);
      });
      return res;
    }
  }, {
    key: "RECAPTCHA_API",

    /**
     * サイトキーを引数にトークンを取得するためのAPI URL
     */
    get: function get() {
      return "https://www.google.com/recaptcha/api/siteverify";
    }
  }]);

  return ReCaptcha3Server;
}();

exports.ReCaptcha3Server = ReCaptcha3Server;