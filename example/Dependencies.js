"use strict";

// get the object class for the dependency injection container
var Container = require('../lib/Container');

// instantiate a new container
var container = new Container();

// add the configuration object to the container as a parameter
var config = require('./config');
container.add('config', config);

// add the service locator function for the service object Foo
container.add('foo', function () {
    // require the reference to the Foo object class
    var Foo = require('./foo');
    // create the Foo service object
    var foo = new Foo();
    // config is retrieved from the container and injected through a setter method
    foo.setConfig(container.get('config'));
    // return the created service object
    return foo;
});

// add the service locator function for the service object Bar
container.add('bar', function () {
    // require the reference to the Bar object class
    var Bar = require('./bar');
    // foo is retrieved from the container and injected through the constructor and the service object is returned
    return new Bar(container.get('foo'));
});

module.exports = container;