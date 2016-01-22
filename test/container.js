"use strict";
var Container = require("../lib/Container");

var assert = require('assert');

var mock = function () {
    this._name = '_foo';
    this.setName = function (name) {
        this._name = name;
    };
    this.getName = function () {
        return this._name;
    };
};

var Foo = function () {
    this.name = '_foo';
};

var Bar = function (foo) {
    this.name = 'bar';
    this._foo = foo;
    this.getFoo = function () {
        return this._foo;
    }
};

describe('Container', function() {
    describe("#add()", function () {
        it("Should accept name as a string value", function () {
            var container = new Container();
            // test string name
            var error = false;
            try {
                var name = 'string';
                container.add(name, function () {});
            } catch (err) {
                error = true;
            }
            assert.equal(false, error);
        });
        it ('Should throw a TypeError if name is not a string.', function () {
            var container = new Container();
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
        });
        it("Should throw a TypeError if the dependency is undefined.", function () {
            var container = new Container();
            assert.throws(function () {
                var name = "string";
                var dependency;
                container.add(name, dependency);
            }, function (err) {
                return (err.name == 'TypeError');
            });
        });
        it("Should accept an array of string values as tags", function () {
            var container = new Container();
            var errors = false;
            try {
                var tags = ['tag_a', 'tag_b'];
                container.add('service_with_tags', function () {}, tags);
            } catch (err) {
                errors = true;
            }
            assert.equal(false, errors);
        });
        it("Should throw a TypeError if any tag is not a string", function () {
            var container = new Container();
            assert.throws(function () {
                container.add('tag_is_not_a_string', function () {}, ['string', 1]);
            }, function (err) {
                return (err.name == 'TypeError' && err.message == 'Tag names must be string values.');
            });
        });
        it("Should throw a TypeError if tags is not an array", function () {
            var container = new Container();
            assert.throws(function () {
                container.add('string_tags', function () {}, 'tag');
            }, function (err) {
                return ('TypeError' == err.name && err.message == 'Tags must be an array.');
            }, "tags is a string.");
            assert.throws(function () {
                container.add('number_tags', function () {}, 1);
            }, function (err) {
                return ('TypeError' == err.name && err.message == 'Tags must be an array.');
            }, "tags is a number.");
            assert.throws(function () {
                container.add('object_tags', function () {}, new Object());
            }, function (err) {
                return ('TypeError' == err.name && err.message == 'Tags must be an array.');
            }, "tags is an object.");
            assert.throws(function () {
                container.add('function_tags', function () {}, function () {});
            }, function (err) {
                return ('TypeError' == err.name && err.message == 'Tags must be an array.');
            }, "tags is a function.");
            assert.throws(function () {
                container.add('hash_tags', function () {}, {});
            }, function (err) {
                return ('TypeError' == err.name && err.message == 'Tags must be an array.');
            }, "tags is a hash.");
            assert.throws(function () {
                container.add('boolean_tags', function () {}, false);
            }, function (err) {
                return ('TypeError' == err.name && err.message == 'Tags must be an array.');
            }, "tags is a boolean.");
            assert.throws(function () {
                container.add('null_tags', function () {}, null);
            }, function (err) {
                return ('TypeError' == err.name && err.message == 'Tags must be an array.');
            }, "tags is null.");
        });
    });
    describe('#callable()', function () {
        it("Should throw a TypeError if attempting to create a callable using a non function", function () {
            var container = new Container();
            assert.throws(function () {
                container.callable('string');
            }, function (err) {
                return (err.name == 'TypeError' && err.message == 'The parameter callable must be a function.');
            });
        });
        it("should accept a function as the callable parameter", function () {
            var container = new Container();
            var error = false;
            try {
                container.callable(function () {});
            } catch (err) {
                error = true;
            }
            assert.equal(false, error);
        });
    });
    describe('#factory()', function () {
        it("Should throw a TypeError if attempting to create a factory using a non function", function () {
            var container = new Container();
            assert.throws(function () {
                container.factory('string');
            }, function (err) {
                return (err.name == 'TypeError' && err.message == 'The parameter factory must be a function.');
            });
        });
        it("should accept a function as the factory parameter", function () {
            var container = new Container();
            var error = false;
            try {
                container.factory(function () {});
            } catch (err) {
                error = true;
            }
            assert.equal(false, error);
        });
    });
    describe('#get()', function () {
        it('Should throw SyntaxError when the name parameter is not provided', function () {
            var container = new Container();
            assert.throws(function () {
                container.get();
            }, function (err) {
                return (err.name == 'SyntaxError' && err.message == 'The name parameter is required.');
            });
        });
        it('Should throw RangeError when the name doesn\'t exist', function () {
            var container = new Container();
            // name to test as this appears in the error message
            var name = 'non-existent-name';
            assert.throws(function () {
                container.get(name);
            }, function (err) {
                return (err.name == 'RangeError' && err.message == 'The requested dependency "' + name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
            });
        });
        it('Should return the service object if a service locator function was added', function () {
            var container = new Container();
            container.add('object_factory', function () {
                return new Object();
            });
            var result = container.get('object_factory');
            assert.equal('object', typeof result);
        });
        it('Should return the string value if a string parameter was added', function () {
            var container = new Container();
            container.add('string', 'string_value');
            assert.equal('string_value', container.get('string'));
        });
        it('Should return the numeric value if a number parameter was added', function () {
            var container = new Container();
            container.add('number', 1);
            assert.equal(1, container.get('number'));
        });
        it('Should return the object hash if a hash parameter was added', function () {
            var container = new Container();
            container.add('hash', {
                name: 'name'
            });
            var result = container.get('hash');
            assert.equal('name', result.name);
        });
        it('Should return a cached service object rather than invoke the service locator', function () {
            var container = new Container();
            container.add('mock', function () {
                return new mock();
            });
            var result_one = container.get('mock');
            var result_two = container.get('mock');
            assert.equal(true, (result_one == result_two));
        });
        it('Should return the function that has been wrapped by #callable(callable) before being added', function () {
            var container = new Container();
            container.add('callable', container.callable(function () {
                return '_foo';
            }));
            var result = container.get('callable');
            assert.equal('function', typeof result);
            assert.equal('_foo', result());
        });
        it('Should return a new service object if the function has been wrapped by #factory(factory) before being added', function () {
            var container = new Container();
            var test_function = function () {
                return new mock();
            };
            var factory = container.factory(test_function);
            container.add('factory', factory);
            var result_one = container.get('factory');
            var result_two = container.get('factory');
            assert.equal(true, (result_one != result_two))
        });
        it('Should return an object with all of its dependencies automatically populated', function () {
            var container = new Container();
            container.add('_foo', function () {
                return new Foo();
            });
            container.add('bar', function () {
                return new Bar(container.get('_foo'));
            });
            var expected_bar = container.get('bar');
            var expected_foo = expected_bar.getFoo();
            assert.equal(true, expected_bar instanceof Bar);
            assert.equal(true, expected_foo instanceof Foo);
        });
    });
    describe('#tagged()', function () {
        it("Should return an array of service names tagged by a specific tag", function () {
            var container = new Container();
            container.add('foo', function () {}, ['tagged', 'tag_a']);
            container.add('bar', function () {}, ['tagged', 'tag_b']);
            var tagged = container.tagged('tagged');
            assert.equal(true, Array.isArray(tagged));
            assert.equal(true, tagged.length == 2);
            assert.equal(true, tagged.some(function (value) {
                return (value == 'foo');
            }));
            assert.equal(true, tagged.some(function (value) {
                return (value == 'bar');
            }));
        });
        it("Should throw a TypeError if tag name is not a string", function () {
            var container = new Container();
            assert.throws(function () {
                var tag;
                container.tagged(tag);
            }, function (err) {
                return (err.name == 'TypeError' && err.message == 'tag must be a string.')
            });
            assert.throws(function () {
                var tag = 1;
                container.tagged(tag);
            }, function (err) {
                return (err.name == 'TypeError' && err.message == 'tag must be a string.')
            });
            assert.throws(function () {
                var tag = false;
                container.tagged(tag);
            }, function (err) {
                return (err.name == 'TypeError' && err.message == 'tag must be a string.')
            });
            assert.throws(function () {
                var tag = {};
                container.tagged(tag);
            }, function (err) {
                return (err.name == 'TypeError' && err.message == 'tag must be a string.')
            });
            assert.throws(function () {
                var tag = [];
                container.tagged(tag);
            }, function (err) {
                return (err.name == 'TypeError' && err.message == 'tag must be a string.')
            });
            assert.throws(function () {
                var tag = new Object();
                container.tagged(tag);
            }, function (err) {
                return (err.name == 'TypeError' && err.message == 'tag must be a string.')
            });
            assert.throws(function () {
                var tag = null;
                container.tagged(tag);
            }, function (err) {
                return (err.name == 'TypeError' && err.message == 'tag must be a string.')
            });
        });
        it("Should throw a RangeError if tag name can not be found", function () {
            var container = new Container();
            assert.throws(function () {
                var tag = 'non-existent-tag';
                container.tagged(tag);
            }, function (err) {
                return (err.name == 'RangeError' && err.message == 'tag does not exist.')
            });
        });
    });
    describe('#remove()', function () {
        it("Should remove references to service locators, factories, callables and parameters", function () {
            var container = new Container();
            container.add('factory', container.factory(function () {}));
            container.add('callable', container.callable(function () {}));
            container.add('parameter', 'string');
            container.add('service', function () {});
            var error = false;
            try {
                container.remove('factory');
            } catch (err) {
                error = true;
            }
            assert.equal(false, error);
            var error = false;
            try {
                container.remove('callable');
            } catch (err) {
                error = true;
            }
            assert.equal(false, error);
            var error = false;
            try {
                container.remove('parameter');
            } catch (err) {
                error = true;
            }
            assert.equal(false, error);
            var error = false;
            try {
                container.remove('service');
            } catch (err) {
                error = true;
            }
            assert.equal(false, error);
        });
        it('Should throw SyntaxError when the name parameter is not provided', function () {
            var container = new Container();
            assert.throws(function () {
                container.remove();
            }, function (err) {
                return (err.name == 'SyntaxError' && err.message == 'The name parameter is required.');
            });
        });
        it('Should throw RangeError when the name doesn\'t exist.', function () {
            var container = new Container();
            var non_existent_name = 'non-existent-name';
            assert.throws(function () {
                container.remove(non_existent_name);
            }, function (err) {
                return (err.name == 'RangeError' && err.message == 'The requested dependency "' + non_existent_name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
            });
        });
        it('Should throw a RangeError when #get() is called after service locator is removed', function () {
            var container = new Container();
            var name = 'service-to-remove';
            container.add(name, function () {
                return true;
            });
            assert.equal(true, container.get(name));
            container.remove(name);
            assert.throws(function () {
                container.remove(name);
            }, function (err) {
                return (err.name == 'RangeError' && err.message == 'The requested dependency "' + name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
            });
        });
        it('Should remove associated dependencies from the tags when a dependency is removed', function () {
            var container = new Container();
            // add two services with tags
            container.add('foo', function () {}, ['tagged', 'tag_a']);
            container.add('bar', function () {}, ['tagged', 'tag_b']);
            // remove the foo service
            container.remove('foo');
            // get all the services tagged with "tagged"
            var tagged = container.tagged('tagged');
            // there should only be one value (bar) returned as foo was removed
            assert.equal(true, (tagged.length == 1), "Only one tagged dependency returned");
            // confirm that foo can not be found
            assert.equal(false, tagged.some(function (value) {
                return (value == 'foo');
            }), "Foo not found");
            // confirm that bar was returned
            assert.equal(true, tagged.some(function (value) {
                return (value == 'bar');
            }), "Bar found.");
        });
        it('Should remove the tag if all associated dependencies have been removed', function () {
            var container = new Container();
            // add two services with tags
            container.add('foo', function () {}, ['tagged', 'tag_a']);
            container.add('bar', function () {}, ['tagged', 'tag_b']);
            // remove both the services tagged with 'tagged'
            container.remove('foo');
            container.remove('bar');
            // get all the services tagged with "tagged"
            assert.throws(function () {
                var tagged = container.tagged('tagged');
            }, function (err) {
                return (err.name == 'RangeError' && err.message == 'tag does not exist.')
            });
        });
    });
});