"use strict"

var Callable = require('./Callable');
var Factory = require('./Factory');

/**
 * A dependency injection container for Node.js
 * @constructor
 */
var Container = function () {};

/**
 * A hash table containing the registered dependencies
 * @type {{}}
 * @private
 */
Container.prototype._dependencies = {};

/**
 * A hash table containing all of the created dependencies
 * @type {{}}
 * @private
 */
Container.prototype._cache = {};

/**
 * A hash table containing all of the registered factories
 * @type {{}}
 * @private
 */
Container.prototype._factories = {};

/**
 * Add a dependency to the container that can later be retrieved by name. The dependency can be a value, object or a
 * factory function that returns an object
 * @param name
 * @param dependency
 */
Container.prototype.add = function (name, dependency) {
    if (typeof name !== 'string') {
        throw new TypeError("Name must be a string");
    }
    if (typeof dependency == 'undefined') {
        throw new TypeError('Dependency is undefined');
    }
    this._dependencies[name] = dependency;
};

/**
 * If the named dependency was registered as a function it will be invoked the first time and the return value cached.
 * Subsequent calls will return the cached value.
 * @param name
 * @returns {*}
 */
Container.prototype.get = function (name) {
    // the name property is required
    if (typeof name == 'undefined') {
        throw new SyntaxError('The name parameter is required.');
    }
    // check if the named dependency exists
    if (!(name in this._dependencies)) {
        throw new RangeError('The requested dependency "' + name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
    }
    // if this is a wrapped factory then invoke the factory
    if (this._dependencies[name] instanceof Factory) {
        return this._dependencies[name].invoke();
    }
    // if this is a wrapped callable then return the function
    if (this._dependencies[name] instanceof Callable) {
        return this._dependencies[name].getCallable();
    }
    // check to see if the dependency has been created before. This allows us to not waste memory creating objects that we don't need
    // and not create a new object each time
    if (!(name in this._cache)) {
        // if the requested dependency is a function (i.e. a factory function) then invoke the function or return the value
        // then add it to the cache
        this._cache[name] = (typeof this._dependencies[name] == 'function') ? this._dependencies[name]() : this._dependencies[name];
    }
    // return the requested dependency from the _cache hash
    return this._cache[name];
};

/**
 * Wraps a function and protects it from being invoked by the container so that the function itself can be returned.
 * @param callable
 * @returns {*}
 */
Container.prototype.callable = function (callable) {
    return new Callable(callable);
};

/**
 * Wraps a function as a factory so tht the container will invoke the function everytime instead of returning the cached
 * result.
 * @param factory
 * @returns {*}
 */
Container.prototype.factory = function (factory) {
    return new Factory(factory);
};

module.exports = Container;