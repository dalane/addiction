"use strict"

var Callable = function (callable) {
    if (!(typeof callable == 'function')) {
        throw new TypeError('The parameter callable must be a function.')
    }
    this._callable = callable;
    this.getCallable = function () {
        return this._callable;
    }
};
module.exports = Callable;