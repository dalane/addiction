"use strict";

var Foo = function (config) {
    this._config = config;
    this.sayHello = function () {
        console.log('Hello ' + this._config.name + ' from Foo!');
    }
};
module.exports = Foo;