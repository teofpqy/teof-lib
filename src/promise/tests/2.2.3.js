"use strict";

var assert = require("assert");
var testRejected = require("./helpers/testThreeCases").testRejected;

var adapter = global.adapter;
var rejected = adapter.rejected;
var deferred = adapter.deferred;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it
var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality

describe("2.2.3: If `onRejected` is a function,", () => {
    describe("2.2.3.1: it must be called after `promise` is rejected, with `promise`’s rejection reason as its " +
             "first argument.", () => {
        testRejected(sentinel, function (promise, done) {
            promise.then(null, function onRejected(reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });
        });
    });

    describe("2.2.3.2: it must not be called before `promise` is rejected", () => {
        test("rejected after a delay", done => {
            var d = deferred();
            var isRejected = false;

            d.promise.then(null, function onRejected() {
                assert.strictEqual(isRejected, true);
                done();
            });

            setTimeout(function () {
                d.reject(dummy);
                isRejected = true;
            }, 50);
        });

        test("never rejected", done => {
            var d = deferred();
            var onRejectedCalled = false;

            d.promise.then(null, function onRejected() {
                onRejectedCalled = true;
                done();
            });

            setTimeout(function () {
                assert.strictEqual(onRejectedCalled, false);
                done();
            }, 150);
        });
    });

    describe("2.2.3.3: it must not be called more than once.", () => {
        test("already-rejected", done => {
            var timesCalled = 0;

            rejected(dummy).then(null, function onRejected() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });
        });

        test(
            "trying to reject a pending promise more than once, immediately",
            done => {
                var d = deferred();
                var timesCalled = 0;

                d.promise.then(null, function onRejected() {
                    assert.strictEqual(++timesCalled, 1);
                    done();
                });

                d.reject(dummy);
                d.reject(dummy);
            }
        );

        test(
            "trying to reject a pending promise more than once, delayed",
            done => {
                var d = deferred();
                var timesCalled = 0;

                d.promise.then(null, function onRejected() {
                    assert.strictEqual(++timesCalled, 1);
                    done();
                });

                setTimeout(function () {
                    d.reject(dummy);
                    d.reject(dummy);
                }, 50);
            }
        );

        test(
            "trying to reject a pending promise more than once, immediately then delayed",
            done => {
                var d = deferred();
                var timesCalled = 0;

                d.promise.then(null, function onRejected() {
                    assert.strictEqual(++timesCalled, 1);
                    done();
                });

                d.reject(dummy);
                setTimeout(function () {
                    d.reject(dummy);
                }, 50);
            }
        );

        test(
            "when multiple `then` calls are made, spaced apart in time",
            done => {
                var d = deferred();
                var timesCalled = [0, 0, 0];

                d.promise.then(null, function onRejected() {
                    assert.strictEqual(++timesCalled[0], 1);
                });

                setTimeout(function () {
                    d.promise.then(null, function onRejected() {
                        assert.strictEqual(++timesCalled[1], 1);
                    });
                }, 50);

                setTimeout(function () {
                    d.promise.then(null, function onRejected() {
                        assert.strictEqual(++timesCalled[2], 1);
                        done();
                    });
                }, 100);

                setTimeout(function () {
                    d.reject(dummy);
                }, 150);
            }
        );

        test("when `then` is interleaved with rejection", done => {
            var d = deferred();
            var timesCalled = [0, 0];

            d.promise.then(null, function onRejected() {
                assert.strictEqual(++timesCalled[0], 1);
            });

            d.reject(dummy);

            d.promise.then(null, function onRejected() {
                assert.strictEqual(++timesCalled[1], 1);
                done();
            });
        });
    });
});
