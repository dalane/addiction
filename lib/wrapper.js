"use strict";

const WRAPPER_TYPE_FACTORY = 'factory';
const WRAPPER_TYPE_PARAMETER = 'parameter';
const WRAPPER_TYPE_SERVICE = 'service';

var Wrapper = function (type, value) {
    if (type != WRAPPER_TYPE_FACTORY && type != WRAPPER_TYPE_PARAMETER && type != WRAPPER_TYPE_SERVICE) {
        throw new TypeError("Type must be either 'factory', 'parameter', or 'service'.");
    }
    this._type = type;
    this._value = value;
};

Wrapper.prototype.getType = function () {
    return this._type;
};

Wrapper.prototype.getValue = function () {
    return this._value;
};

Wrapper.prototype.isServiceLocator = function () {
    return (this._type == WRAPPER_TYPE_SERVICE);
};

Wrapper.prototype.isParameter = function () {
    return (this._type == WRAPPER_TYPE_PARAMETER);
};

Wrapper.prototype.isFactory = function () {
    return (this._type == WRAPPER_TYPE_FACTORY);
};

module.exports = Wrapper;