"use strict"

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
Container.prototype._created_objects = {};

/**
 * A hash table containing a list of the created dependencies and a count of the number of times they have been called
 * @type {{}}
 * @private
 */
Container.prototype._retrieval_counter = {};

/**
 * Add a dependency to the container that can later be retrieved by name. The dependency can be a value, object or a
 * factory function that returns an object
 * @param name
 * @param dependency
 */
Container.prototype.add = function (name, dependency) {
    this._dependencies[name] = dependency;
};

/**
 * If the dependency was registered as a factory function then the created object will be returned, otherwise the value will be returned.
 * @param name
 * @returns {*}
 */
Container.prototype.get = function (name) {
    // the name property is required
    if (name === undefined) {
        throw new SyntaxError('The name parameter is required.');
    }
    // check if the named dependency exists
    if (!(name in this._dependencies)) {
        throw new RangeError('The requested dependency "' + name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
    }
    // check to see if the dependency has been created before. This allows us to not waste memory creating objects that we don't need
    // and not create a new object each time
    if (!(name in this._created_objects)) {
        // if the requested dependency is a function (i.e. a factory function) then invoke the function or else simply return the dependency
        this._created_objects[name] = (typeof this._dependencies[name] == 'function') ? this._dependencies[name]() : this._dependencies[name];
    }
    // update the retrieval counter by adding in 1 if this is the first time or incrementing the counter if the value already exists
    this._retrieval_counter[name] = (!(name in this._retrieval_counter)) ? 1 : this._retrieval_counter[name] + 1;
    // return the requested dependency from the _created_objects hash
    return this._created_objects[name];
};

Container.prototype.log = function () {
    console.log(this._retrieval_counter);
};

module.exports = Container;