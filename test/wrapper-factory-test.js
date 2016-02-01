"use strict";

var Wrapper = require('../lib/wrapper');
var WrapperFactory = require('../lib/wrapper-factory');

describe("WrapperFactory", function () {
    describe("#make", function () {
        it("Should return a wrapper object", function () {
            var wrapperFactory = new WrapperFactory();
            var wrapper = wrapperFactory.make('service', function () {
                return "test_string";
            });
            expect((wrapper instanceof Wrapper)).toBe(true);
            expect(wrapper.getType()).toBe('service');
            expect(wrapper.getValue()()).toBe('test_string');
        });
    });
});