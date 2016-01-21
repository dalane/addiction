"use strict";

/**
 * A dependency injection container for Node.js
 * @constructor
 */
var Container = function () {};

/**
 * A hash containing the registered dependencies
 * @type {{}}
 * @private
 */
Container.prototype._dependencies = {};

/**
 * A hash containing the instantiated service objects
 * @type {{}}
 * @private
 */
Container.prototype._cache = {};

/**
 * An array containing all the id's of the factories
 * @type []
 * @private
 */
Container.prototype._factories = [];

/**
 * A array containing all the id's of the callables
 * @type []
 * @private
 */
Container.prototype._callables = [];

Container.prototype._tagged = {};

/**
 * Add a dependency to the container that can later be retrieved by name. The dependency can be a value, object or a
 * factory function that returns an object
 * @param name string Identifies the service locator or parameter
 * @param dependency mixed A service locator function or parameter
 * @param tags [string] A list of tags to a service
 */
Container.prototype.add = function (name, dependency, tags) {
    if (typeof name !== 'string') {
        throw new TypeError("Name must be a string");
    }
    if (typeof dependency == 'undefined') {
        throw new TypeError('Dependency is undefined');
    }
    this._dependencies[name] = dependency;
    // add in any tags that have been specified in tags
    // it is optional so only throw an exception if it is not undefined and not of type array
    if (typeof tags !== 'array' && typeof tags !== 'undefined') {
        throw new TypeError('Tags must be an array.')
    }
    var self = this;
    // iterate through each tag
    tags.forEach(function (tag) {
        // check if it already exists and create an empty array for tagged services if it doesn't exist
        if (!self._tagged[tag]) {
            self._tagged[tag] = [];
        }
        self._tagged[tag].push(name);
    });
};

/**
 * If the named dependency was registered as a function it will be invoked the first time and the return value cached.
 * Subsequent calls will return the cached value.
 * @param name string The name of the service locator or parameter added to the container
 * @returns mixed
 */
Container.prototype.get = function (name) {
    var self = this;
    // the name property is required
    if (typeof name == 'undefined') {
        throw new SyntaxError('The name parameter is required.');
    }
    // check if the named dependency exists
    if (!(name in this._dependencies)) {
        throw new RangeError('The requested dependency "' + name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
    }
    // a function to check if the value provide by array.some() matches the value in the _dependencies
    var checkValueAgainstDependenciesCollection = function (value) {
        return (value == self._dependencies[name]);
    };
    // check if the requested dependency is a factory
    if (this._factories.some(checkValueAgainstDependenciesCollection)) {
        // invoke the factory
        return this._getDependency(name)();
    }
    // check if the requested dependency is a callable
    if (this._callables.some(checkValueAgainstDependenciesCollection)) {
        // return the callable
        return this._getDependency(name);
    }
    // check if the requested dependency is a parameter
    if (typeof this._dependencies[name] !== 'function') {
        // return the parameter
        return this._dependencies[name];
    }
    return this._getCache(name);
};

Container.prototype.remove = function (name) {
    var self = this;
    // the name property is required
    if (typeof name == 'undefined') {
        throw new SyntaxError('The name parameter is required.');
    }
    // check if the named dependency exists
    if (!(name in this._dependencies)) {
        throw new RangeError('The requested dependency "' + name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
    }
    // delete from the dependencies hash
    delete this._dependencies[name];
    // a function to check if the value provide by array.some() matches the value in the _dependencies
    var checkValueAgainstDependenciesCollection = function (value) {
        return (value == self._dependencies[name]);
    };
    // check if the requested dependency is a factory
    if (this._factories.some(checkValueAgainstDependenciesCollection)) {
        // delete the factory
        delete this._factories[name];
    }
    // check if the requested dependency is a callable
    if (this._callables.some(checkValueAgainstDependenciesCollection)) {
        // delete the callable
        delete this._callables[name];
    }
};

/**
 * Will return the names of services tagged with given tag.
 *
 * @param tag
 * @returns [string]
 */
Container.prototype.tagged = function (tag) {
    if (!this._tagged[tag]) {
        return [];
    }
    // Return unique list.
    return this._tagged[tag].filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
};

/**
 * Wraps a function and protects it from being invoked by the container so that the function itself can be returned.
 * @param callable
 * @returns function
 */
Container.prototype.callable = function (callable) {
    if (!(typeof callable == 'function')) {
        throw new TypeError('The parameter callable must be a function.')
    }
    this._callables.push(callable);
    return callable;
};

/**
 * Wraps a function as a factory so tht the container will invoke the function everytime instead of returning the cached
 * result.
 * @param factory
 * @returns function
 */
Container.prototype.factory = function (factory) {
    if (!(typeof factory == 'function')) {
        throw new TypeError('The parameter factory must be a function.')
    }
    this._factories.push(factory);
    return factory;
};

/**
 * Returns the parameter or service locator without in invoking of functions
 * @param name
 * @returns mixed
 * @private
 */
Container.prototype._getDependency = function (name) {
    return this._dependencies[name];
};

/**
 * Returns cached service objects
 * @param name
 * @returns {*}
 * @private
 */
Container.prototype._getCache = function (name) {
    // the only thing remaining are service locators
    // does the service object exist in the cache?
    if ((name in this._cache)) {
        return this._cache[name];
    }
    // invoke the service locator and add the service object to cache
    this._cache[name] = this._dependencies[name]();
    // return the cached service object
    return this._cache[name];
};

module.exports = Container;