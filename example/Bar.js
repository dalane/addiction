"use strict";

// define Bar with the service object Foo set through the constructor
var Bar = function (foo) {
    this._foo = foo;
    this.saySomething = function () {
        this._foo.sayHello();
    };
};
module.exports = Bar;