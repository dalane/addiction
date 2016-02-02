"use strict";

var Wrapper = require('../lib/wrapper');

describe("Testing Wrapper class", function () {
    describe("#constructor", function () {
        it("Should generate error if type is incorrect", function () {
            var test = function () {
                var wrapper = new Wrapper('incorrect_type', function () {
                });
            };
            expect(test).toThrowError(TypeError, "Type must be either 'factory', 'parameter', or 'service'.");
        });
        it("Should accept 'service' as type", function () {
            var test = function () {
                var wrapper = new Wrapper('service', function () {
                });
            };
            expect(test).not.toThrowError(TypeError, "Type must be either 'factory', 'parameter', or 'service'.");
        });
        it("Should accept 'factory' as type", function () {
            var test = function () {
                var wrapper = new Wrapper('factory', function () {
                });
            };
            expect(test).not.toThrowError(TypeError, "Type must be either 'factory', 'parameter', or 'service'.");
        });
        it("Should accept 'parameter' as type", function () {
            var test = function () {
                var wrapper = new Wrapper('parameter', function () {
                });
            };
            expect(test).not.toThrowError(TypeError);
        });
        it("Should accept any javascript type for value", function () {
            var args = [
                1,
                true,
                function () {
                },
                {},
                null,
                "argument"
            ];
            args.forEach(function (test_argument) {
                var test = function () {
                    var wrapper = new Wrapper('parameter', test_argument);
                };
                expect(test).not.toThrowError();
            });
        });
        it("Should generate a TypeError if factory type is specified and value is not a function", function () {
            var test = function () {
                var wrapper = new Wrapper('factory', 'parameter');
            };
            expect(test).toThrowError(TypeError, "The value to be wrapped as a factory or service must be a function.");
        });
        it("Should generate a TypeError if service type is specified and value is not a function", function () {
            var test = function () {
                var wrapper = new Wrapper('service', 'parameter');
            };
            expect(test).toThrowError(TypeError, "The value to be wrapped as a factory or service must be a function.");
        });
    });
    describe("#getType", function () {
        it("Should return the type set on instantiation", function () {
            var wrapper = new Wrapper('service', function () {});
            expect(wrapper.getType()).toBe('service');
        });
    });
    describe("#getValue", function () {
        it("Should return the value set on instantiation", function () {
            var wrapper = new Wrapper('parameter', "test_value");
            expect(wrapper.getValue()).toBe('test_value');
        });
    });
    describe("#isFactory", function () {
        it("Should return true for isFactory and false for isServiceLocator and isParameter", function() {
            var wrapper = new Wrapper('factory', function () {});
            expect(wrapper.isFactory()).toBe(true);
            expect(wrapper.isServiceLocator()).toBe(false);
            expect(wrapper.isParameter()).toBe(false);
        });
    });
    describe("#isServiceLocator", function () {
        it("Should return true for isServiceLocator and false for isFactory and isParameter", function () {
            var wrapper = new Wrapper('service', function () {
            });
            expect(wrapper.isFactory()).toBe(false);
            expect(wrapper.isServiceLocator()).toBe(true);
            expect(wrapper.isParameter()).toBe(false);
        });
    });
    describe("#isParameter", function () {
        it("Should return true for isParameter and false for isServiceLocator and isFactory", function () {
            var wrapper = new Wrapper('parameter', function () {
            });
            expect(wrapper.isFactory()).toBe(false);
            expect(wrapper.isServiceLocator()).toBe(false);
            expect(wrapper.isParameter()).toBe(true);
        });
    });
});