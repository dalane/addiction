"use strict";

var NodeDi = function () {};

var container = null;

NodeDi.prototype.getContainer = function () {
    var Container = require('./container');
    var MemoryStore = require('./memory-store');
    var Tags = require('./tag-store');
    var WrapperFactory = require('./wrapper-factory');
    if (container == null) {
        container = new Container(new MemoryStore(), new MemoryStore(), new Tags(), new WrapperFactory());
    }
    return container;
};

module.exports = new NodeDi();