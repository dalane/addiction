"use strict";

const WRAPPER_TYPE_FACTORY = 'factory';
const WRAPPER_TYPE_PARAMETER = 'parameter';
const WRAPPER_TYPE_SERVICE = 'service';

/**
 * Instantiate a new Wrapper given a type and value
 * @param type {string} The type of value that is being wrapped by the Wrapper.
 * @param value {mixed} The value to be returned by the Wrapper
 * @constructor
 */
var Wrapper = function (type, value) {
    if (type != WRAPPER_TYPE_FACTORY && type != WRAPPER_TYPE_PARAMETER && type != WRAPPER_TYPE_SERVICE) {
        throw new TypeError("Type must be either 'factory', 'parameter', or 'service'.");
    }
    this._type = type;
    if ((type == WRAPPER_TYPE_FACTORY || type == WRAPPER_TYPE_SERVICE) && 'function' !== typeof value) {
        throw new TypeError('The value to be wrapped as a factory or service must be a function.')
    }
    this._value = value;
};

/**
 * The type of value that has been wrapped by the Wrapper
 * @returns {string|*}
 */
Wrapper.prototype.getType = function () {
    return this._type;
};

/**
 * The value that has been wrapped by the Wrapper
 * @returns {mixed|*}
 */
Wrapper.prototype.getValue = function () {
    return this._value;
};

/**
 * Identifies if the value wrapped has the 'service' type
 * @returns {boolean}
 */
Wrapper.prototype.isServiceLocator = function () {
    return (this._type == WRAPPER_TYPE_SERVICE);
};

/**
 * Identifies if the value wrapped has the 'parameter' type
 * @returns {boolean}
 */
Wrapper.prototype.isParameter = function () {
    return (this._type == WRAPPER_TYPE_PARAMETER);
};

/**
 * Identifies if the value wrapped has the 'factory' type
 * @returns {boolean}
 */
Wrapper.prototype.isFactory = function () {
    return (this._type == WRAPPER_TYPE_FACTORY);
};

module.exports = Wrapper;