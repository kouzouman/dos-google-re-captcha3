"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReCaptcha3Server = exports.ReCaptcha3Client = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * GoogleReCaptchaのラッパー＠クライアント
 */
class ReCaptcha3Client {
  /**
   * サイトキーを引数にトークンを取得するためのAPI URL
   */
  static RECAPTCHA_API(siteKey) {
    return `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
  }
  /**
   * サイトキーを引数に初期化
   * @param {String} siteKey
   * @param {Option String} id
   */


  static init(siteKey, id) {
    ReCaptcha3Client.siteKey = siteKey; // URLをhtmlに挿入

    let element = !id ? document.querySelector('body') : document.querySelector(`#${id}`);
    let scriptDom = document.createElement('script');
    scriptDom.setAttribute('src', ReCaptcha3Client.RECAPTCHA_API(siteKey));
    element.appendChild(scriptDom);
  }
  /**
   * クライアントトークンを取得
   * @param {*} siteKey
   */


  static async getToken() {
    return new Promise((resolve, reject) => {
      let counter = 0;
      let timer = setInterval(() => {
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

        grecaptcha.ready(() => {
          grecaptcha.execute(ReCaptcha3Client.siteKey, {
            action: 'homepage'
          }).then(token => {
            resolve(token);
          });
        });
      }, 100);
    });
  }

}
/**
 * GoogleReCaptchaのラッパー＠サーバ
 */


exports.ReCaptcha3Client = ReCaptcha3Client;

class ReCaptcha3Server {
  /**
   * サイトキーを引数にトークンを取得するためのAPI URL
   */
  static get RECAPTCHA_API() {
    return `https://www.google.com/recaptcha/api/siteverify`;
  }
  /**
   * スコアレスポンスを取得
   * @param {*} secretKey
   * @param {*} token
   * @param {*} ip
   */


  static async getScore(secretKey, token, ip) {
    //  GoogleReCaptchaのスコアを取得
    const res = await ReCaptcha3Client.post(ReCaptcha3Server.RECAPTCHA_API, {
      secret: secretKey,
      response: token,
      remoteip: ip
    });
    return !!res && !!res.data ? res.data : {
      success: false
    };
  }
  /**
   * POSTメソッドでアクセスする
   * @param {String} url
   * @param {Object} param
   */


  static async post(url, param) {
    const res = await _axios.default.post(`${url}`, ReCaptcha3Client.combParamStr(param));
    return res;
  }
  /**
   * パラメータのオブジェクトを文字列に変換
   * @param {Object} params
   */


  static combParamStr(params) {
    let res = new URLSearchParams();
    cf.Object2Array(params).forEach(v => {
      res.append(v.key, v.value);
    });
    return res;
  }

}

exports.ReCaptcha3Server = ReCaptcha3Server;