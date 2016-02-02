"use strict";

/**
 * We require MemoryStore as Tags will inherit from it
 * @type {MemoryStore|exports}
 */
var MemoryStore = require('./memory-store');

var Tags = function () {
    MemoryStore.call(this);
};

Tags.prototype = Object.create(MemoryStore.prototype);

Tags.prototype.constructor = Tags;

/**
 * Adds a collection of tags to the named dependency. Overloads the MemoryStore add method.
 */
Tags.prototype.add = function (name, tags) {
    if (typeof name !== "string") {
        throw new TypeError('name must be a string.');
    }
    if (!Array.isArray(tags)) {
        throw new TypeError('tags must be an array');
    }
    tags.forEach(function (tag, index, tags) {
        if (typeof tag !== 'string') {
            throw new TypeError('Tag defined at index ' + index + ' must be string value.');
        }
    });
    this._objects[name] = tags;
};

/**
 * Given a tag name, will find all named dependencies that have that tag assigned
 * @param tag {string}
 * @returns {Array}
 */
Tags.prototype.findByTag = function (tag) {
    var result = [];
    for (var name in this._objects) {
        if (this._objects.hasOwnProperty(name)) { // this is a redundant check as we know what properties we've added to this._objects
            var search_result = this._objects[name].some(function (item, index, self) {
                return (item === tag);
            });
            if (search_result) {
                result.push(name);
            }
        }
    }
    return result;
};

module.exports = Tags;