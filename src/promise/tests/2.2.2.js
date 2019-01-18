"use strict";

var assert = require("assert");
var testFulfilled = require("./helpers/testThreeCases").testFulfilled;

var adapter = global.adapter;
var resolved = adapter.resolved;
var deferred = adapter.deferred;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it
var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality

describe("2.2.2: If `onFulfilled` is a function,", () => {
    describe("2.2.2.1: it must be called after `promise` is fulfilled, with `promise`’s fulfillment value as its " +
             "first argument.", () => {
        testFulfilled(sentinel, function (promise, done) {
            promise.then(function onFulfilled(value) {
                assert.strictEqual(value, sentinel);
                done();
            });
        });
    });

    describe("2.2.2.2: it must not be called before `promise` is fulfilled", () => {
        test("fulfilled after a delay", done => {
            var d = deferred();
            var isFulfilled = false;

            d.promise.then(function onFulfilled() {
                assert.strictEqual(isFulfilled, true);
                done();
            });

            setTimeout(function () {
                d.resolve(dummy);
                isFulfilled = true;
            }, 50);
        });

        test("never fulfilled", done => {
            var d = deferred();
            var onFulfilledCalled = false;

            d.promise.then(function onFulfilled() {
                onFulfilledCalled = true;
                done();
            });

            setTimeout(function () {
                assert.strictEqual(onFulfilledCalled, false);
                done();
            }, 150);
        });
    });

    describe("2.2.2.3: it must not be called more than once.", () => {
        test("already-fulfilled", done => {
            var timesCalled = 0;

            resolved(dummy).then(function onFulfilled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });
        });

        test(
            "trying to fulfill a pending promise more than once, immediately",
            done => {
                var d = deferred();
                var timesCalled = 0;

                d.promise.then(function onFulfilled() {
                    assert.strictEqual(++timesCalled, 1);
                    done();
                });

                d.resolve(dummy);
                d.resolve(dummy);
            }
        );

        test(
            "trying to fulfill a pending promise more than once, delayed",
            done => {
                var d = deferred();
                var timesCalled = 0;

                d.promise.then(function onFulfilled() {
                    assert.strictEqual(++timesCalled, 1);
                    done();
                });

                setTimeout(function () {
                    d.resolve(dummy);
                    d.resolve(dummy);
                }, 50);
            }
        );

        test(
            "trying to fulfill a pending promise more than once, immediately then delayed",
            done => {
                var d = deferred();
                var timesCalled = 0;

                d.promise.then(function onFulfilled() {
                    assert.strictEqual(++timesCalled, 1);
                    done();
                });

                d.resolve(dummy);
                setTimeout(function () {
                    d.resolve(dummy);
                }, 50);
            }
        );

        test(
            "when multiple `then` calls are made, spaced apart in time",
            done => {
                var d = deferred();
                var timesCalled = [0, 0, 0];

                d.promise.then(function onFulfilled() {
                    assert.strictEqual(++timesCalled[0], 1);
                });

                setTimeout(function () {
                    d.promise.then(function onFulfilled() {
                        assert.strictEqual(++timesCalled[1], 1);
                    });
                }, 50);

                setTimeout(function () {
                    d.promise.then(function onFulfilled() {
                        assert.strictEqual(++timesCalled[2], 1);
                        done();
                    });
                }, 100);

                setTimeout(function () {
                    d.resolve(dummy);
                }, 150);
            }
        );

        test("when `then` is interleaved with fulfillment", done => {
            var d = deferred();
            var timesCalled = [0, 0];

            d.promise.then(function onFulfilled() {
                assert.strictEqual(++timesCalled[0], 1);
            });

            d.resolve(dummy);

            d.promise.then(function onFulfilled() {
                assert.strictEqual(++timesCalled[1], 1);
                done();
            });
        });
    });
});
