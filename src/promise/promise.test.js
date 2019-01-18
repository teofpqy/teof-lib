import Promise from './index';


const adapter = {
  resolved: function (value) {
      return new Promise(function (resolve) {
          resolve(value);
      });
  },
  rejected: function (reason) {
      return new Promise(function (resolve, reject) {
          reject(reason);
      });
  },
  deferred: function () {
      let resolve, reject;
      return {
          promise: new Promise(function (rslv, rjct) {
              resolve = rslv;
              reject = rjct;
          }),
          resolve: resolve,
          reject: reject
      };
  }
};


global.adapter = adapter;


// require("./tests/2.1.2");
// require("./tests/2.1.3");
require("./tests/2.2.1");
// require("./tests/2.2.2");
// require("./tests/2.2.3");
// require("./tests/2.2.4");
// require("./tests/2.2.5");
// require("./tests/2.2.6");
// require("./tests/2.2.7");
// require("./tests/2.3.1");
// require("./tests/2.3.2");
// require("./tests/2.3.3");
// require("./tests/2.3.4");

delete global.adapter;
