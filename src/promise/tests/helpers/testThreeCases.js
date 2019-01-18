"use strict";

var adapter = global.adapter;
var resolved = adapter.resolved;
var rejected = adapter.rejected;
var deferred = adapter.deferred;

exports.testFulfilled = function (value, ct) {
  test("already-fulfilled", done => {
    ct(resolved(value), done);
  });

  test("immediately-fulfilled", done => {
    var d = deferred();
    ct(d.promise, done);
    d.resolve(value);
  });

  test("eventually-fulfilled", done => {
    var d = deferred();
    ct(d.promise, done);
    setTimeout(function () {
      d.resolve(value);
    }, 50);
  });
};

exports.testRejected = function (reason, ct) {
  test("already-rejected", done => {
    ct(rejected(reason), done);
  });

  test("immediately-rejected", done => {
    var d = deferred();
    ct(d.promise, done);
    d.reject(reason);
  });

  test("eventually-rejected", done => {
    var d = deferred();
    ct(d.promise, done);
    setTimeout(function () {
      d.reject(reason);
    }, 50);
  });
};
