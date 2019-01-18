"use strict";

var adapter = global.adapter;
var resolved = adapter.resolved;
var rejected = adapter.rejected;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it

describe("2.2.1: Both `onFulfilled` and `onRejected` are optional arguments.", () => {
    describe("2.2.1.1: If `onFulfilled` is not a function, it must be ignored.", () => {
        describe("applied to a directly-rejected promise", () => {
            function testNonFunction(nonFunction, stringRepresentation) {
                test("`onFulfilled` is " + stringRepresentation, done => {
                    rejected(dummy).then(nonFunction, function () {
                        done();
                    });
                });
            }

            testNonFunction(undefined, "`undefined`");
            testNonFunction(null, "`null`");
            testNonFunction(false, "`false`");
            testNonFunction(5, "`5`");
            testNonFunction({}, "an object");
        });

        describe("applied to a promise rejected and then chained off of", () => {
            function testNonFunction(nonFunction, stringRepresentation) {
                test("`onFulfilled` is " + stringRepresentation, done => {
                    rejected(dummy).then(function () { }, undefined).then(nonFunction, function () {
                        done();
                    });
                });
            }

            testNonFunction(undefined, "`undefined`");
            testNonFunction(null, "`null`");
            testNonFunction(false, "`false`");
            testNonFunction(5, "`5`");
            testNonFunction({}, "an object");
        });
    });

    describe("2.2.1.2: If `onRejected` is not a function, it must be ignored.", () => {
        describe("applied to a directly-fulfilled promise", () => {
            function testNonFunction(nonFunction, stringRepresentation) {
                test("`onRejected` is " + stringRepresentation, done => {
                    resolved(dummy).then(function () {
                        done();
                    }, nonFunction);
                });
            }

            testNonFunction(undefined, "`undefined`");
            testNonFunction(null, "`null`");
            testNonFunction(false, "`false`");
            testNonFunction(5, "`5`");
            testNonFunction({}, "an object");
        });

        describe("applied to a promise fulfilled and then chained off of", () => {
            function testNonFunction(nonFunction, stringRepresentation) {
                test("`onFulfilled` is " + stringRepresentation, done => {
                    resolved(dummy).then(undefined, function () { }).then(function () {
                        done();
                    }, nonFunction);
                });
            }

            testNonFunction(undefined, "`undefined`");
            testNonFunction(null, "`null`");
            testNonFunction(false, "`false`");
            testNonFunction(5, "`5`");
            testNonFunction({}, "an object");
        });
    });
});
