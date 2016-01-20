"use strict";

var Bar = function (foo) {
    this._foo = foo;
    this.saySomething = function () {
        this._foo.sayHello();
    };
};
module.exports = Bar;