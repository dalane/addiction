"use strict";

var MemoryStore = function () {
    // object to store add items
    this._objects = {};
};

/**
 * add item to the memory store
 * @param name
 * @param value
 */
MemoryStore.prototype.add = function (name, value) {
    if (typeof name !== "string") {
        throw new TypeError('name must be a string.');
    }
    if (typeof value == 'undefined') {
        throw new TypeError('value is required.');
    }
    this._objects[name] = value;
};

/**
 * remove an item from the memory store
 * @param name
 */
MemoryStore.prototype.remove = function (name) {
    if (this.doesNotExist(name)) {
        throw new RangeError('name cannot be found.');
    }
    delete this._objects[name];
};

/**
 * verify that a named item exists in the memory store
 * @param name
 * @returns {boolean}
 */
MemoryStore.prototype.doesExist = function (name) {
    return (name in this._objects);
};

/**
 * verify that a named item does not exist in the memory store
 * @param name
 * @returns {boolean}
 */
MemoryStore.prototype.doesNotExist = function (name) {
    return !this.doesExist(name);
};

/**
 * Retrieve a named item from the memory store
 * @param name
 * @returns {*}
 */
MemoryStore.prototype.get = function (name) {
    if (this.doesNotExist(name)) {
        throw new RangeError('name cannot be found.');
    }
    return this._objects[name];
};

module.exports = MemoryStore;