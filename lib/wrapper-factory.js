"use strict";

var Wrapper = require('./wrapper');

var WrapperFactory = function () {};

WrapperFactory.prototype.make = function (type, value) {
    return new Wrapper(type, value);
};

module.exports = WrapperFactory;