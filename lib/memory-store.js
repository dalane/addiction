"use strict";

var MemoryStore = function () {
    this._objects = {};
};

MemoryStore.prototype.add = function (name, value) {
    if (typeof name !== "string") {
        throw new TypeError('name must be a string.');
    }
    if (typeof value == 'undefined') {
        throw new TypeError('value is required.');
    }
    this._objects[name] = value;
};

MemoryStore.prototype.remove = function (name) {
    if (this.doesNotExist(name)) {
        throw new RangeError('name cannot be found.');
    }
    delete this._objects[name];
};

MemoryStore.prototype.doesExist = function (name) {
    return (name in this._objects);
};

MemoryStore.prototype.doesNotExist = function (name) {
    return !this.doesExist(name);
};

MemoryStore.prototype.get = function (name) {
    if (this.doesNotExist(name)) {
        throw new RangeError('name cannot be found.');
    }
    return this._objects[name];
};

module.exports = MemoryStore;