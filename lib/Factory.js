"use strict"

var Factory = function (factory) {
    if (!(typeof factory == 'function')) {
        throw new TypeError('The parameter callable must be a function.')
    }
    this._factory = factory;
    this.invoke = function () {
        return this._factory();
    }
};
module.exports = Factory;