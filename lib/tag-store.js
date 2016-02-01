"use strict";

var Tags = function () {
    this._objects = {};
};

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

Tags.prototype.remove = function (name) {
    if (this.doesNotExist(name)) {
        throw new RangeError('name cannot be found.');
    }
    delete this._objects[name];
};

Tags.prototype.doesExist = function (name) {
    return (name in this._objects);
};

Tags.prototype.doesNotExist = function (name) {
    return !this.doesExist(name);
};

Tags.prototype.find = function (name) {
    if (this.doesNotExist(name)) {
        throw new RangeError('name cannot be found.');
    }
    return this._objects[name];
};

Tags.prototype.findByTag = function (tag) {
    var result = [];
    for (var name in this._objects) {
        if (this._objects.hasOwnProperty(name)) {
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