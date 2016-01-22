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
 * A hash containing the name of each dependency and the tags associated with it to provide a two way mapping with
 * the property _tagged
 * @type {{}}
 * @private
 */
Container.prototype._dependency_tags = {};

/**
 * Add a dependency to the container that can later be retrieved by name. The dependency can be a value, object or a
 * factory function that returns an object
 * @param name {string} Identifies the service locator or parameter
 * @param dependency {*} A service locator function or parameter
 * @param tags [string] Optional list of tags to tag a service
 */
Container.prototype.add = function (name, dependency) {
    if (typeof name !== 'string') {
        throw new TypeError("Name must be a string");
    }
    if (typeof dependency == 'undefined') {
        throw new TypeError('Dependency is undefined');
    }
    this._dependencies[name] = dependency;
    // add in any tags that have been specified in tags
    var tags;

    // use this to determine whether b was passed or not
    if (arguments.length == 2) {
        return
    } else {
        tags = arguments[2]; // take the third argument
    }
    // it is optional so exit if it's undefined as all subsequent code relates to processing tags
    if (typeof tags === 'undefined') {
        return;
    }
    // if the tags parameter is not an array then throw a TypeError exception
    if (!Array.isArray(tags)) {
        throw new TypeError('Tags must be an array.')
    }
    // if the tags array is empty throw a SyntaxError exception
    if (tags.length !== 0) {

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
            // add the tag to the collection of tags if it doesn't already exist
            if (!self._tagged[tag].some(function (value) {
                    return (value == name);
                })) {
                self._tagged[tag].push(name);
            }
        });
        this._dependency_tags[name] = tags;
    }
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
    // check if the requested dependency is tagged by checking the keys in _dependency_tags
    if (name in this._dependency_tags) {
        var container = this;
        // iterate through each tag and remove the reference from _tagged
        container._dependency_tags[name].forEach(function (tag, index, self) {
            container._tagged[tag].forEach(function (linked_dependency, index, self) {
                if (name == linked_dependency) {
                    // it's not straightforward removing an item from an array
                    // find the index of the value we want to remove
                    var index = container._tagged[tag].indexOf(linked_dependency);
                    // then cut it out using splice
                    container._tagged[tag].splice(index, 1);
                }
            });
            if (container._tagged[tag].length == 0) {
                delete container._tagged[tag];
            }
        });
        // finally after we've removed all the cross references from _tagged remove the dependency from _dependency_tags
        delete this._dependency_tags[name];
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
    if (typeof tag !== 'string') {
        throw new TypeError('tag must be a string.')
    }
    if (!this._tagged[tag]) {
        throw new RangeError('tag does not exist.');
    }
    // Return unique list.
    // filter returns a new array as we don't want to return a reference that could be used to
    // interfere with innards of the container by reference
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