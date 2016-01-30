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
Container.prototype._dependencies = {
    _wrappers: {},
    add: function (name, value) {
        this._wrappers[name] = value;
    },
    get: function (name) {
        return this._wrappers[name];
    },
    remove: function (name) {
        if (this.doesExist(name)) {
            delete this._wrappers[name];
        }
    },
    doesExist: function (name) {
        return (name in this._wrappers);
    },
    doesNotExist: function (name) {
        return !this.doesExist(name);
    }
};

/**
 * A hash containing all of the instantiated service objects
 * @type {{}}
 * @private
 */
Container.prototype._cache = {
    _service_objects: {},
    doesExist: function (name) {
        return (name in this._service_objects);
    },
    add: function (name, object) {
        this._service_objects[name] = object;
    },
    remove: function (name) {
        if (this.doesExist(name)) {
            delete this._service_objects[name];
        }
    },
    find: function (name) {
        return this._service_objects[name];
    }
};

Container.prototype._tags = {
    _tags: {},
    add: function (name, tags) {
        this._tags[name] = tags;
    },
    hasTags: function (name) {
        return (name in this._tags);
    },
    findByTag: function (tag) {
        var result = [];
        for (var name in this._tags) {
            if (this._tags.hasOwnProperty(name)) {
                var search_result = this._tags[name].some(function (item, index, self) {
                    return (item === tag);
                });
                if (search_result) {
                    result.push(name);
                }
            }
        }
        return result;
    },
    remove: function (name) {
        if (this.hasTags(name)) {
            delete this._tags[name];
        }
    }
};

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

Container.prototype._wrapper = function (type, value) {
    const FACTORY = 'factory';
    const PARAMETER = 'parameter';
    const SERVICE = 'service';
    this._type = type;
    this._value = value;
    this.getType = function () {
        return this._type;
    };
    this.getValue = function () {
        return this._value;
    };
    this.isServiceLocator = function () {
        return (this._type == SERVICE);
    };
    this.isParameter = function () {
        return (this._type == PARAMETER);
    };
    this.isFactory = function () {
        return (this._type == FACTORY);
    };
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
        wrapper = new this._wrapper('service', dependency);
    } else if (dependency instanceof this._wrapper /* typeof dependency == 'object' && name in dependency == 'wrapper' */) {
        wrapper = dependency;
    } else {
        wrapper = new this._wrapper('parameter', dependency);
    }
    this._dependencies.add(name, wrapper);
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
    if (this._dependencies.doesNotExist(name)) {
        throw new RangeError('The requested dependency "' + name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
    }
    var dependency = this._dependencies.get(name);
    if (dependency.isFactory()) {
        // get the factory function, and invoke with container as an argument
        return dependency.getValue()(container);
    }
    if (dependency.isServiceLocator()) {
        if (this._cache.doesExist(name)) {
            return this._cache.find(name);
        }
        var service_locator = dependency.getValue();
        var service_object = service_locator(container);
        this._cache.add(name, service_object);
        return service_object;
    }
    return dependency.getValue();
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
    if (this._dependencies.doesNotExist(name)) {
        throw new RangeError('The requested dependency "' + name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
    }
    // delete from the dependencies hash
    this._dependencies.remove(name);
    // if it's been cached then remove the cache object
    if (this._cache.doesExist(name)) {
        this._cache.remove(name);
    }
    // if it's been tagged then remove it from the collection of tags
    if (this._tags.hasTags(name)) {
        this._tags.remove(name);
    }
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
 *
 * @param service {function}
 * @returns {Container._wrapper}
 */
Container.prototype.service = function (service) {
    return new this._wrapper('service', service);
};

/**
 * Wraps a function and protects it from being invoked by the container so that the function itself can be returned.
 * @param parameter {*}
 * @returns {Container._wrapper}
 */
Container.prototype.parameter = function (parameter) {
    return new this._wrapper('parameter', parameter);
};

/**
 * Wraps a function as a factory so tht the container will invoke the function everytime instead of returning a cached
 * result.
 * @param factory {function}
 * @returns {Container._wrapper}
 */
Container.prototype.factory = function (factory) {
    if (!(typeof factory == 'function')) {
        throw new TypeError('The factory must be a function.')
    }
    return new this._wrapper('factory', factory);
};

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