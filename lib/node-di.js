"use strict";

var NodeDi = function () {
    /**
     * Holds the instantiated Container singleton
     * @type {null}
     * @private
     */
    this._container = null;
};

/**
 * A factory that returns a container singleton
 * @returns {Container}
 */
NodeDi.prototype.getContainer = function (containerStore) {
    var Container = require('./container');
    var MemoryStore = require('./memory-store');
    var Tags = require('./tag-store');
    var WrapperFactory = require('./wrapper-factory');
    if (this._container == null) {
        this._container = new Container(new MemoryStore(), new MemoryStore(), new Tags(), new WrapperFactory());
    }
    return this._container;
};

/**
 * Export the instantiated factory
 * @type {NodeDi}
 */
module.exports = new NodeDi();