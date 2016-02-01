"use strict";

var TagsStore = require('../lib/tag-store');

describe("TagsStore", function () {
    describe("#findByTag", function () {
        var tagsStore = null;
        beforeEach(function () {
            tagsStore = new TagsStore();
        });
        afterEach(function () {
            tagsStore = undefined;
        });
        it("Should throw an exception if any tag value is not a string", function () {
            var tag_values = [
                1.1,
                true,
                [],
                {},
                null
            ];
            tag_values.forEach(function (tag, index) {
                var test = function () {
                    tagsStore.add('foo', [tag])
                };
                expect(test).toThrowError(TypeError, 'Tag defined at index 0 must be string value.')
            });
        });
        it("Should accept an array of string tags", function () {
            var test = function () {
                tagsStore.add('foo', ['tag_a', 'tag_b']);
            };
            expect(test).not.toThrowError();
        });
        it("Should return an array with the names identified by a given tag", function () {
            tagsStore.add('foo', ['tag_a', 'tag_b']);
            tagsStore.add('bar', ['tag_b', 'tag_c']);
            tagsStore.add('fop', ['tag_d', 'tag_e']);
            var result = tagsStore.findByTag('tag_b');
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
            expect(result[0]).toBe('foo');
            expect(result[1]).toBe('bar');
        });
    });
});