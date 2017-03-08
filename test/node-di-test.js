"use strict";

var dic = require('../lib');
var Container = require('../lib/container');

describe("javascript-di", function () {
    describe("#getContainer", function () {
        it("Should return an instance of the container", function () {
            var result = dic.getContainer();
            expect(result instanceof Container).toBe(true);
        });
        it("Should always return the new instance of the container", function () {
            var result = dic.getContainer();
            var result2 = dic.getContainer();
            expect((result !== result2)).toBe(true);
        });
        it("Should always return the same instance of the container when using getSingleton", function () {
            var result = dic.getSingleton();
            var result2 = dic.getSingleton();
            expect((result == result2)).toBe(true);
        });
    });
});
