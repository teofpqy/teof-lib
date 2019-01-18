"use strict";

var assert = require("assert");
var testFulfilled = require("./helpers/testThreeCases").testFulfilled;
var testRejected = require("./helpers/testThreeCases").testRejected;

var adapter = global.adapter;
var resolved = adapter.resolved;
var rejected = adapter.rejected;
var deferred = adapter.deferred;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it

describe("2.2.4: `onFulfilled` or `onRejected` must not be called until the execution context stack contains only " +
         "platform code.", () => {
    describe("`then` returns before the promise becomes fulfilled or rejected", () => {
        testFulfilled(dummy, function (promise, done) {
            var thenHasReturned = false;

            promise.then(function onFulfilled() {
                assert.strictEqual(thenHasReturned, true);
                done();
            });

            thenHasReturned = true;
        });
        testRejected(dummy, function (promise, done) {
            var thenHasReturned = false;

            promise.then(null, function onRejected() {
                assert.strictEqual(thenHasReturned, true);
                done();
            });

            thenHasReturned = true;
        });
    });

    describe("Clean-stack execution ordering tests (fulfillment case)", () => {
        test(
            "when `onFulfilled` is added immediately before the promise is fulfilled",
            () => {
        var d = deferred();
        var onFulfilledCalled = false;

        d.promise.then(function onFulfilled() {
            onFulfilledCalled = true;
        });

        d.resolve(dummy);

        assert.strictEqual(onFulfilledCalled, false);
    }
        );

        test(
            "when `onFulfilled` is added immediately after the promise is fulfilled",
            () => {
        var d = deferred();
        var onFulfilledCalled = false;

        d.resolve(dummy);

        d.promise.then(function onFulfilled() {
            onFulfilledCalled = true;
        });

        assert.strictEqual(onFulfilledCalled, false);
    }
        );

        test(
            "when one `onFulfilled` is added inside another `onFulfilled`",
            done => {
                var promise = resolved();
                var firstOnFulfilledFinished = false;

                promise.then(function () {
                    promise.then(function () {
                        assert.strictEqual(firstOnFulfilledFinished, true);
                        done();
                    });
                    firstOnFulfilledFinished = true;
                });
            }
        );

        test("when `onFulfilled` is added inside an `onRejected`", done => {
            var promise = rejected();
            var promise2 = resolved();
            var firstOnRejectedFinished = false;

            promise.then(null, function () {
                promise2.then(function () {
                    assert.strictEqual(firstOnRejectedFinished, true);
                    done();
                });
                firstOnRejectedFinished = true;
            });
        });

        test("when the promise is fulfilled asynchronously", done => {
            var d = deferred();
            var firstStackFinished = false;

            setTimeout(function () {
                d.resolve(dummy);
                firstStackFinished = true;
            }, 0);

            d.promise.then(function () {
                assert.strictEqual(firstStackFinished, true);
                done();
            });
        });
    });

    describe("Clean-stack execution ordering tests (rejection case)", () => {
        test(
            "when `onRejected` is added immediately before the promise is rejected",
            () => {
        var d = deferred();
        var onRejectedCalled = false;

        d.promise.then(null, function onRejected() {
            onRejectedCalled = true;
        });

        d.reject(dummy);

        assert.strictEqual(onRejectedCalled, false);
    }
        );

        test(
            "when `onRejected` is added immediately after the promise is rejected",
            () => {
        var d = deferred();
        var onRejectedCalled = false;

        d.reject(dummy);

        d.promise.then(null, function onRejected() {
            onRejectedCalled = true;
        });

        assert.strictEqual(onRejectedCalled, false);
    }
        );

        test("when `onRejected` is added inside an `onFulfilled`", done => {
            var promise = resolved();
            var promise2 = rejected();
            var firstOnFulfilledFinished = false;

            promise.then(function () {
                promise2.then(null, function () {
                    assert.strictEqual(firstOnFulfilledFinished, true);
                    done();
                });
                firstOnFulfilledFinished = true;
            });
        });

        test(
            "when one `onRejected` is added inside another `onRejected`",
            done => {
                var promise = rejected();
                var firstOnRejectedFinished = false;

                promise.then(null, function () {
                    promise.then(null, function () {
                        assert.strictEqual(firstOnRejectedFinished, true);
                        done();
                    });
                    firstOnRejectedFinished = true;
                });
            }
        );

        test("when the promise is rejected asynchronously", done => {
            var d = deferred();
            var firstStackFinished = false;

            setTimeout(function () {
                d.reject(dummy);
                firstStackFinished = true;
            }, 0);

            d.promise.then(null, function () {
                assert.strictEqual(firstStackFinished, true);
                done();
            });
        });
    });
});
