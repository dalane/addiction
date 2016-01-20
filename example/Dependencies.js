"use strict";

var Container = require('../lib/Container');
var container = new Container();

// add the configuration object to the container
var config = require('./config');
container.add('config', config);

// add the function for instantiating Foo with the dependency on config injected by the container
container.add('_foo', function () {
    var Foo = require('./foo');
    return new Foo(container.get('config'));
});

// add the function for instantiating Bar with the dependency on Foo injected by the container
container.add('bar', function () {
    var Bar = require('./bar');
    return new Bar(container.get('_foo'));
});

module.exports = container;