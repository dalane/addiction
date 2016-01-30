"use strict";

// get the object class for the dependency injection container
var Container = require('../lib/Container');

// instantiate a new container
var container = new Container();

// load the config.json file and add it to the container
var config = require('./config.json');
container.add('config', config);

// add the service locator function for the service object Foo
container.add('foo', function (c) {
    // note the "c" in the function arguments. This is the injected container so that we can retrieve items
    // from the container as required
    // require the reference to the Foo object class
    var Foo = require('./foo');
    // create the Foo service object
    var foo = new Foo();
    // config is retrieved from the container and injected through a setter method
    foo.setConfig(c.get('config'));
    // return the created service object
    return foo;
});

// add the service locator function for the service object Bar.
container.add('bar', function (c) {
    // note the "c" in the function arguments. This is the injected container so that we can retrieve items
    // from the container as required

    // require the reference to the Bar object class
    var Bar = require('./bar');
    // foo is retrieved from the container and injected through the constructor and the service object is returned
    return new Bar(c.get('foo'));
});

module.exports = container;