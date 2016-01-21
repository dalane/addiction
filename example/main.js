"use strict";

// the file dependencies.js has our dependency injection container with all of our program's dependencies described.
var dependencies = require('./dependencies');

// get the instantiated object from the dependency injection container
var bar = dependencies.get('bar');

// bar is retrieved with all of it's dependencies automatically populated ready to do work
bar.saySomething();