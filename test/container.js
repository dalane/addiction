var Container = require("../lib/Container");

var assert = require('assert');

var mock = function () {
    this._name = 'foo';
    this.setName = function (name) {
        this._name = name;
    };
    this.getName = function () {
        return this._name;
    };
};

describe('Container', function() {
    var container = new Container();
    describe("#add(name, dependency)", function () {
        it ('Should throw a TypeError if name is not a string.', function () {
            // test object
            assert.throws(function () {
                var name = new Object();
                container.add(name, {});
            }, function (err) {
                return (err.name == 'TypeError');
            });
            // test function
            assert.throws(function () {
                var name = function () {};
                container.add(name, {});
            }, function (err) {
                return (err.name == 'TypeError');
            });
            // test boolean
            assert.throws(function () {
                var name = true;
                container.add(name, {});
            }, function (err) {
                return (err.name == 'TypeError');
            });
            // test null
            assert.throws(function () {
                var name = null;
                container.add(name, {});
            }, function (err) {
                return (err.name == 'TypeError');
            });
            // test undefined
            assert.throws(function () {
                var name;
                container.add(name, {});
            }, function (err) {
                return (err.name == 'TypeError');
            });
            // test number
            assert.throws(function () {
                var name = 1;
                container.add(name, {});
            }, function (err) {
                return (err.name == 'TypeError');
            });
            // test string
            var error = false;
            try {
                var name = 'string';
                container.add(name, {});
            } catch (err) {
                var error = true;
            }
            assert.equal(false, error);
        });
        it("Should throw a TypeError if dependency is undefined.", function () {
            // TODO write test for missing dependency parameter
            assert.throws(function () {
                var name = "string";
                var dependency;
                container.add(name, dependency);
            }, function (err) {
                return (err.name == 'TypeError');
            });
        });
    });
    describe('#callable(callable)', function () {
        it("Should throw a TypeError if attempting to create a callable using a non function.", function () {
            assert.throws(function () {
                container.callable('string');
            }, function (err) {
                return (err.name == 'TypeError');
            });
        });
        it("should accept a function as the callable parameter", function () {
            var error = false;
            try {
                container.callable(function () {});
            } catch (err) {
                error = true;
            }
            assert.equal(false, error);
        });
    });
    describe('#factory(factory)', function () {
        it("Should throw a TypeError if attempting to create a factory using a non function.", function () {
            assert.throws(function () {
                container.callable('string');
            }, function (err) {
                return (err.name == 'TypeError');
            });
        });
        it("should accept a function as the factory parameter", function () {
            var error = false;
            try {
                container.factory(function () {});
            } catch (err) {
                error = true;
            }
            assert.equal(false, error);
        });
    });
    describe('#get(name)', function () {
        it('Should throw SyntaxError when the name parameter is not provided.', function () {
            assert.throws(function () {
                container.get();
            }, function (err) {
                return (err.name == 'SyntaxError');
            });
        });
        it('Should throw RangeError when the name doesn\'t exist.', function () {
            assert.throws(function () {
                container.get('non-existent-name');
            }, function (err) {
                return (err.name == 'RangeError');
            });
        });
        it('Should return the result of a function set using #add().', function () {
            container.add('object_factory', function () {
                return new Object();
            });
            var result = container.get('object_factory');
            assert.equal('object', typeof result);
        });
        it('Should return the string value if the dependency was added as a string.', function () {
            container.add('string', 'string_value');
            assert.equal('string_value', container.get('string'));
        });
        it('Should return the numeric value if the dependency was added as a number.', function () {
            container.add('number', 1);
            assert.equal(1, container.get('number'));
        });
        it('Should return the object hash if the dependency was added as a hash.', function () {
            container.add('hash', {
                name: 'name'
            });
            var result = container.get('hash');
            assert.equal('name', result.name);
        });
        it('Should return the same object that has already been created rather than create a new object', function () {
            container.add('mock', function () {
                return new mock();
            });
            var result_one = container.get('mock');
            var result_two = container.get('mock');
            assert.equal(true, (result_one == result_two));
        });
        it('Should return a callable function that has been wrapped by #callable(callable) before being added.', function () {
            container.add('callable', container.callable(function () {
                return 'foo';
            }));
            var result = container.get('callable');
            assert.equal('function', typeof result);
            assert.equal('foo', result());
        });
        it('Should return a new object if the function has been wrapped by #factory(factory) before being added.', function () {
            var test_function = function () {
                return new mock();
            };
            var factory = container.factory(test_function);
            container.add('factory', factory);
            var result_one = container.get('factory');
            var result_two = container.get('factory');
            assert.equal(true, (result_one != result_two))
        });
    });
});