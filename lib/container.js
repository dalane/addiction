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
 * An array containing all the id's of the callables
 * @type []
 * @private
 */
Container.prototype._callables = [];

/**
 * A hash containing the tags added to service locators and parameters
 * @type {{}}
 * @private
 */
Container.prototype._tagged = {};

/**
 * Add a dependency to the container that can later be retrieved by name. The dependency can be a value, object or a
 * factory function that returns an object
 * @param name {string} Identifies the service locator or parameter
 * @param dependency {*} A service locator function or parameter
 * @param tags [string] Optional list of tags to tag a service
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
    // it is optional so exit if it's undefined as all subsequent code relates to processing tags
    if (typeof tags === 'undefined') {
        return;
    }
    // if the tags parameter is not an array then throw a TypeError exception
    if (typeof tags !== 'array') {
        throw new TypeError('Tags must be an array.')
    }
    // iterate through each tag to ensure that each one is a string type and throw TypeError if any non-strings found
    tags.forEach(function (tag) {
        if (typeof tag !== 'string') {
            throw new TypeError('Tag names must be string values.');
        }
    });
    // store this as self so that we can access it in the anonymous function
    var self = this;
    // iterate through each tag and save
    tags.forEach(function (tag) {
        // check if it already exists and create an empty array for tagged services if it doesn't exist
        if (!self._tagged[tag]) {
            self._tagged[tag] = [];
        }
        // add the tag to the collection of tags
        self._tagged[tag].push(name);
    });
    return this;
};

/**
 * If the named dependency was registered as a function it will be invoked the first time and the return value cached.
 * Subsequent calls will return the cached value.
 * @param name {string} The name of the service locator or parameter added to the container
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
    // check if the requested dependency is a factory
    if (this._factories.some(this._checkValueAgainstDependenciesCollection(name))) {
        // invoke the factory
        return this._getDependency(name)();
    }
    // check if the requested dependency is a callable
    if (this._callables.some(this._checkValueAgainstDependenciesCollection(name))) {
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

/**
 * Removes a service locator or parameter from the container
 * @param name {string}
 * @returns {Container}
 */
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
    // check if the requested dependency is a factory
    if (this._factories.some(this._checkValueAgainstDependenciesCollection(name))) {
        // delete the factory
        delete this._factories[name];
    }
    // check if the requested dependency is a callable
    if (this._callables.some(this._checkValueAgainstDependenciesCollection(name))) {
        // delete the callable
        delete this._callables[name];
    }
    return this;
};

/**
 * Will return the names of services tagged with given tag.
 *
 * @param tag {string}
 * @returns [string]
 */
Container.prototype.tagged = function (tag) {
    if (typeof tag == 'undefined') {
        throw new SyntaxError('tag is required.');
    }
    if (typeof tag !== 'string') {
        throw new TypeError('tag must be a string')
    }
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
 * @param callable {function}
 * @returns {function}
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
 * @param factory {function}
 * @returns {function}
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
 * @param name {string}
 * @returns {*}
 * @private
 */
Container.prototype._getDependency = function (name) {
    return this._dependencies[name];
};

/**
 * Returns cached service objects
 * @param name {string}
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

/**
 * Returns an anonymous function to check if the value provide by array.some() matches the name in the _dependencies
 * @param name {string}
 * @returns {Function}
 * @private
 */
Container.prototype._checkValueAgainstDependenciesCollection = function (name) {
    var self = this;
    return function (value) {
        return (value == self._dependencies[name]);
    };
};

module.exports = Container;