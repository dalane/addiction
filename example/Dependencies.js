"use strict";

var Container = require('../lib/Container');
var container = new Container();

// add the configuration object to the container as a parameter
var config = require('./config');
container.add('config', config);

// add the function for instantiating Foo with the dependency on config injected by the container
container.add('foo', function () {
    var Foo = require('./foo');
    var foo = new Foo();
    // config is injected through a setter method
    foo.setConfig(container.get('config'));
    return foo;
});

// add the function for instantiating Bar with the dependency on Foo injected by the container
container.add('bar', function () {
    var Bar = require('./bar');
    // foo is injected in the constructor
    return new Bar(container.get('foo'));
});

module.exports = container;