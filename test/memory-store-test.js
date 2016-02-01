"use strict";

var MemoryStore = require('../lib/memory-store');

describe("MemoryStore", function () {
    describe("#constructor", function () {
        it("Should instantiate without any errors", function () {
            var test = function () {
                var memoryStore = new MemoryStore();
            };
            expect(test).not.toThrowError();
        });
    });
    describe("#add", function () {
        var memoryStore = null;
        beforeEach(function () {
            memoryStore = new MemoryStore();
        });
        afterEach(function () {
            memoryStore = null;
        });
        it("Should throw an exception if name is not a string", function () {
            var test_names = [
                1.1,
                true,
                [],
                {},
                null,
                undefined
            ];
            test_names.forEach(function (name) {
                var test = function () {
                    memoryStore.add(name);
                };
                expect(test).toThrowError(TypeError, "name must be a string.")
            });
        });
        it("Should throw an exception if value is undefined", function () {
            var test = function () {
                memoryStore.add('name');
            };
            expect(test).toThrowError(TypeError, "value is required.")
        });
        it("Should accept any javascript type for value", function () {
            var test_values = [
                1.1,
                true,
                [],
                {},
                null
            ];
            test_values.forEach(function (value, index) {
                var test = function () {
                    memoryStore.add('test' + index, value);
                };
                expect(test).not.toThrowError()
            });
        });
    });
    describe("#get", function () {
        var memoryStore = null;
        beforeEach(function () {
            memoryStore = new MemoryStore();
        });
        afterEach(function () {
            memoryStore = null;
        });
        it("Should throw an exception if name cannot be found", function () {
            var test = function () {
                memoryStore.get('non-existent-name')
            };
            expect(test).toThrowError(RangeError,'name cannot be found.');
        });
        it("Should return the correct value", function () {
            var test_values = [
                1.1,
                true,
                [],
                {},
                null
            ];
            test_values.forEach(function (value, index) {
                var name = 'test' + index;
                memoryStore.add(name, value);
                expect(memoryStore.get(name)).toBe(value);
            });
        });
    });
    describe("#doesExist", function () {
        var memoryStore = null;
        beforeEach(function () {
            memoryStore = new MemoryStore();
        });
        afterEach(function () {
            memoryStore = null;
        });
        it("Should return false for a non-existend name", function () {
            var name = 'non-existent-name';
            expect(memoryStore.doesExist(name)).toBe(false);
        });
        it("Should return true for the given name", function () {
            var name = 'test';
            memoryStore.add(name, 'value');
            expect(memoryStore.doesExist(name)).toBe(true);
        });
    });
    describe("#doesNotExist", function () {
        var memoryStore = null;
        beforeEach(function () {
            memoryStore = new MemoryStore();
        });
        afterEach(function () {
            memoryStore = null;
        });
        it("Should return true for a non-existend name", function () {
            var name = 'non-existent-name';
            expect(memoryStore.doesNotExist(name)).toBe(true);
        });
        it("Should return false for the given name", function () {
            var name = 'test';
            memoryStore.add(name, 'value');
            expect(memoryStore.doesNotExist(name)).toBe(false);
        });
    });
    describe("#remove", function () {
        var memoryStore = null;
        beforeEach(function () {
            memoryStore = new MemoryStore();
        });
        afterEach(function () {
            memoryStore = null;
        });
        it("Should throw an error if name not found.", function () {
            var test = function () {
                memoryStore.remove('non-existent-name');
            };
            expect(test).toThrowError(RangeError, "name cannot be found.")
        });
        it("Should remove object that exists in store", function () {
            var name = 'object-to-remove';
            memoryStore.add(name, 'test');
            expect(memoryStore.doesExist(name)).toBe(true);
            memoryStore.remove(name);
            expect(memoryStore.doesNotExist(name)).toBe(true);
        });
    });
});