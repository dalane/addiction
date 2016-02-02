"use strict";

var Wrapper = require('./wrapper');

/**
 * A dependency injection container for Node.js
 * @constructor
 */
var Container = function (wrapperStore, cache, tagsStore, wrapperFactory) {
    this._wrappers = wrapperStore;
    this._cache = cache;
    this._tags = tagsStore;
    this._wrapperFactory = wrapperFactory;
};

/**
 * Add a dependency to the container that can later be retrieved by name. The dependency can be a value, object or a
 * factory function that returns an object
 * @param name {string} Identifies the service locator or parameter
 * @param dependency {*} A service locator function or parameter
 * @param tags [string] Optional list of tags to tag a service
 * @return void
 */
Container.prototype.add = function (name, dependency) {
    if (typeof name !== 'string') {
        throw new TypeError("Name must be a string");
    }
    if (typeof dependency == 'undefined') {
        throw new TypeError('Dependency is undefined');
    }
    // get any tags from a third argument if it has been provided...
    var tags = this._getTagsFromArgs(arguments);
    var wrapper = null;
    if (typeof dependency == 'function') {
        wrapper = this._wrapperFactory.make('service', dependency);
    } else if (dependency instanceof Wrapper) {
        wrapper = dependency;
    } else {
        wrapper = this._wrapperFactory.make('parameter', dependency);
    }
    this._wrappers.add(name, wrapper);
    this._tags.add(name, tags);
};

/**
 * If the named dependency was registered as a function it will be invoked the first time and the return value cached.
 * Subsequent calls will return the cached value.
 * @param name {string} The name of the service locator or parameter added to the container
 * @returns {*}
 */
Container.prototype.get = function (name) {
    var container = this;
    // the name property is required
    if (typeof name == 'undefined') {
        throw new SyntaxError('The name parameter is required.');
    }
    // check if the named dependency exists
    if (this._wrappers.doesNotExist(name)) {
        throw new RangeError('The requested dependency "' + name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
    }
    var wrapper = this._wrappers.get(name);
    if (wrapper.isFactory()) {
        // get the factory function, and invoke with container as an argument
        return wrapper.getValue()(container);
    }
    if (wrapper.isServiceLocator()) {
        if (this._cache.doesExist(name)) {
            return this._cache.get(name);
        }
        var service_locator = wrapper.getValue();
        var service_object = service_locator(container);
        if (typeof service_object == 'undefined') {
            throw new TypeError('The service locator \'' + name + '\' does not return a value.');
        }
        this._cache.add(name, service_object);
        return service_object;
    }
    return wrapper.getValue();
};

/**
 * Removes a service locator or parameter from the container
 * @param name {string}
 * @returns {Container}
 */
Container.prototype.remove = function (name) {
    // the name property is required
    if (typeof name == 'undefined') {
        throw new SyntaxError('The name parameter is required.');
    }
    // check if the named dependency exists
    if (this._wrappers.doesNotExist(name)) {
        throw new RangeError('The requested dependency "' + name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
    }
    // delete from the dependencies hash
    this._wrappers.remove(name);
    // if it's been cached then remove the cache object
    if (this._cache.doesExist(name)) {
        this._cache.remove(name);
    }
    // remove the reference from the collection of tags
    this._tags.remove(name);
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
    return this._tags.findByTag(tag);
};

/**
 * Wraps a function and identifies it as a service locator
 * @param service {function}
 * @returns {Wrapper}
 */
Container.prototype.service = function (service) {
    if (!(typeof service == 'function')) {
        throw new TypeError('The service must be a function.')
    }
    return this._wrapperFactory.make('service', service);
};

/**
 * Wraps a function and protects it from being invoked by the container so that the function itself can be returned.
 * @param parameter {*}
 * @returns {Wrapper}
 */
Container.prototype.parameter = function (parameter) {
    return this._wrapperFactory.make('parameter', parameter);
};

/**
 * Wraps a function as a factory so tht the container will invoke the function everytime instead of returning a cached
 * result.
 * @param factory {function}
 * @returns {Wrapper}
 */
Container.prototype.factory = function (factory) {
    if (!(typeof factory == 'function')) {
        throw new TypeError('The factory must be a function.')
    }
    return this._wrapperFactory.make('factory', factory);
};

/**
 * Parses the arguments from #add for a third parameter "tags"
 * @param args
 * @returns {*}
 * @private
 */
Container.prototype._getTagsFromArgs = function (args) {
    var tags = null;
    if (args.length > 2) {
        tags = args[2]; // take the third argument
    } else {
        return [];
    }
    // it is optional so exit if it's undefined as all subsequent code relates to processing tags
    if (typeof tags == 'undefined') {
        return []
    }
    // if the tags parameter is not an array then throw a TypeError exception
    if (!Array.isArray(tags)) {
        throw new TypeError('Tags must be an array.');
    }
    if (tags.length == 0) {
        return tags;
    }
    tags.forEach(function (tag, index, tags) {
        if (typeof tag !== 'string') {
            throw new TypeError('Tag defined at index ' + index + ' must be string value.');
        }
    });
    return tags;
};

module.exports = Container;