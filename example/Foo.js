"use strict";

// define Foo with the configuration parameter set through a setter function #setConfig()
var Foo = function () {
    this._config = null;
    this.setConfig = function (config) {
        this._config = config;
    };
    this.sayHello = function () {
        console.log('Hello ' + this._config.name + ' from Foo!');
    }
};
module.exports = Foo;