"use strict";

const Container = require('./container');
const MemoryStore = require('./memory-store');
const Tags = require('./tag-store');
const WrapperFactory = require('./wrapper-factory');

var NodeDi = function () {
    /**
     * Holds the instantiated Container singleton
     * @type {null}
     * @private
     */
    this._container = null;
};

/**
 * A factory that returns a new container
 * @returns {Container}
 */
NodeDi.prototype.getContainer = function () {
    return new Container(new MemoryStore(), new MemoryStore(), new Tags(), new WrapperFactory());
};

/**
 * A factory that returns a container singletone
 */
NodeDi.prototype.getSingleton = function () {
    if (this._container === null) {
        this._container = new Container(new MemoryStore(), new MemoryStore(), new Tags(), new WrapperFactory());
    }
    return this._container;
};

/**
 * Export the instantiated factory
 * @type {NodeDi}
 */
module.exports = new NodeDi();
