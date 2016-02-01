"use strict";

var nodeDi = require('../lib/node-di');
var Container = require('../lib/container');

describe("node-di", function () {
    describe("#getContainer", function () {
        it("Should return an instance of the container", function () {
            var result = nodeDi.getContainer();
            expect(result instanceof Container).toBe(true);
        });
        it("Should always return the same instance of the container", function () {
            var result = nodeDi.getContainer();
            var result2 = nodeDi.getContainer();
            expect((result == result2)).toBe(true);
        });
    });
});