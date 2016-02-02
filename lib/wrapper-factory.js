"use strict";

var Wrapper = require('./wrapper');

var WrapperFactory = function () {};

/**
 * Instantiates and returns a new Wrapper object
 * @param type
 * @param value
 * @returns {Wrapper}
 */
WrapperFactory.prototype.make = function (type, value) {
    return new Wrapper(type, value);
};

module.exports = WrapperFactory;