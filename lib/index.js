"use strict";

const Container = require('./container');
const MemoryStore = require('./memory-store');
const Tags = require('./tag-store');
const WrapperFactory = require('./wrapper-factory');

var JavascriptDi = function () {
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
JavascriptDi.prototype.getContainer = function () {
    return new Container(new MemoryStore(), new MemoryStore(), new Tags(), new WrapperFactory());
};

/**
 * A factory that returns a container singleton
 */
JavascriptDi.prototype.getSingleton = function () {
    if (this._container === null) {
        this._container = new Container(new MemoryStore(), new MemoryStore(), new Tags(), new WrapperFactory());
    }
    return this._container;
};

/**
 * Export the instantiated factory
 * @type {JavascriptDi}
 */
module.exports = new JavascriptDi();
