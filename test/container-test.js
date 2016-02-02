"use strict";

var Container = require("../lib/container");
var MemoryStore = require('../lib/memory-store');
var TagStore = require('../lib/tag-store');
var WrapperFactory = require('../lib/wrapper-factory');
var Wrapper = require('../lib/wrapper');

describe('Container', function() {
    describe('#service()', function () {
        var container = null;
        beforeEach(function() {
            container = new Container(new MemoryStore(), new MemoryStore(), new TagStore(), new WrapperFactory());
        });
        afterEach(function() {
            container = null;
        });
        it("Should throw a TypeError if attempting to create a service using a non function", function () {
            var test = function () {
                container.service('string');
            };
            expect(test).toThrowError(TypeError, 'The service must be a function.');
        });
        it("Should return a wrapper that contains the correct values", function () {
            var result = container.service(function () {
                return 'string';
            });
            expect(result instanceof Wrapper).toBe(true);
            expect(result.getType()).toBe('service');
            expect(typeof result.getValue()).toBe('function');
            expect(result.getValue()()).toBe('string');
            expect(result.isServiceLocator()).toBe(true);
            expect(result.isParameter()).toBe(false);
            expect(result.isFactory()).toBe(false);
        });
    });
    describe('#parameter()', function () {
        var container = null;
        beforeEach(function() {
            container = new Container(new MemoryStore(), new MemoryStore(), new TagStore(), new WrapperFactory());
        });
        afterEach(function() {
             container = null;
        });
        it("Should return a wrapper that contains the correct values", function () {
            var result = container.parameter(function () {
                return 'string';
            });
            expect(result instanceof Wrapper).toBe(true);
            expect(result.getType()).toBe('parameter');
            expect(typeof result.getValue()).toBe('function');
            expect(result.getValue()()).toBe('string');
            expect(result.isServiceLocator()).toBe(false);
            expect(result.isParameter()).toBe(true);
            expect(result.isFactory()).toBe(false);
        });
    });
    describe('#factory()', function () {
        var container = null;
        beforeEach(function() {
            container = new Container(new MemoryStore(), new MemoryStore(), new TagStore(), new WrapperFactory());
        });
        afterEach(function() {
            container = null;
        });
        it("Should throw a TypeError if attempting to create a factory using a non function", function () {
            var test = function () {
                container.factory('string');
            };
            expect(test).toThrowError(TypeError, 'The factory must be a function.');
        });
        it("should accept a function as the factory parameter", function () {
            var test = function () {
                container.factory(function () {});
            };
            expect(test).not.toThrowError();
        });
        it("should return a wrapper that contains the correct value", function () {
            var result = container.factory(function () {
                return new Object();
            });
            expect(result instanceof Wrapper).toBe(true);
            expect(result.getType()).toBe('factory');
            expect(typeof result.getValue()).toBe('function');
            expect(result.isServiceLocator()).toBe(false);
            expect(result.isParameter()).toBe(false);
            expect(result.isFactory()).toBe(true);
        });
     });
    describe("#add()", function () {
        var container = null;
        beforeEach(function() {
            container = new Container(new MemoryStore(), new MemoryStore(), new TagStore(), new WrapperFactory());
        });
        afterEach(function() {
            container = null;
        });
        it ('Name should throw a TypeError if not a string', function () {
            // test object
            var names = [
                new Object(),
                true,
                null,
                undefined,
                1.1,
                []
            ];
            names.forEach(function (value) {
                var test = function () {
                    var name = value;
                    container.add(name, {});
                };
                expect(test).toThrowError(TypeError, 'Name must be a string');
            });
        });
        it("Should accept name as a string value", function () {
            // test string name
            var test = function () {
                container.add('string', function () {});
            };
            expect(test).not.toThrowError("Name must be a string.");
        });
        it('Should accept a function as a dependency', function () {
            var test = function () {
                container.add("function", function () {});
            };
            expect(test).not.toThrowError();
        });
        it('Should accept #service result as an object type', function () {
            var test = function () {
                container.add("service", container.service(function () {}));
            };
            expect(test).not.toThrowError();
        });
        it('Should accept #parameter result as an object type', function () {
            var test = function () {
                container.add("parameter", container.parameter(function () {}));
            };
            expect(test).not.toThrowError();
        });
        it('Should accept #factory result as an object type', function () {
            var test = function () {
                container.add("factory", container.factory(function () {}));
            };
            expect(test).not.toThrowError();
        });
        it("Should throw a TypeError if the dependency is undefined.", function () {
            var test = function () {
                var name = "string";
                var dependency;
                container.add(name, dependency);
            };
            expect(test).toThrowError(TypeError, "Dependency is undefined");
        });
        it("Should throw a TypeError if tags is not an array", function () {
            // test object
            var tag_types = [
                new Object(),
                true,
                null,
                1.1
            ];
            tag_types.forEach(function (tags, index, self) {
                var test = function () {
                    container.add('test_' + index, {}, tags);
                };
                expect(test).toThrowError(TypeError, 'Tags must be an array.');
            });
        });
        it("Should not raise any errors if tags is undefined", function () {
            var test = function () {
                var tags = undefined;
                container.add('test', {}, tags);
            };
            expect(test).not.toThrowError();
        });
        it("Should not raise any errors if tags is an empty array", function () {
            var test = function () {
                var tags = [];
                container.add('test', {}, tags);
            };
            expect(test).not.toThrowError();
        });
        it("Should throw a TypeError if any tag is not a string", function () {
            var tag_values = [
                new Object(),
                true,
                null,
                1.1
            ];
            tag_values.forEach(function (tag_value, index, self) {
                var test = function () {
                    var tags = [tag_value, 'string'];
                    container.add('test', {}, tags);
                };
                expect(test).toThrowError(TypeError, 'Tag defined at index 0 must be string value.');
            });
        });
        it("Should accept an array of string values as tags", function () {
            var test = function () {
                var tags = ['one', 'two', 'three'];
                container.add('test', {}, tags);
            };
            expect(test).not.toThrowError();
        });
    });
    describe('#tagged()', function () {
        var container = null;
        beforeEach(function() {
            container = new Container(new MemoryStore(), new MemoryStore(), new TagStore(), new WrapperFactory());
        });
        afterEach(function() {
            container = null;
        });
        it("Should throw a TypeError if tag name is not a string", function () {
            var tag_names_to_test = [
                undefined,
                [],
                1.1,
                {},
                function () {},
                true,
                {}
            ];
            tag_names_to_test.forEach(function (tag_name, index, self) {
                var test = function () {
                    container.tagged(tag_name)
                };
                expect(test).toThrowError(TypeError, 'tag must be a string.');
            });
        });
        it("Should return an empty array if tag name can not be found", function () {
            var tag = 'non-existent-tag';
            var result = container.tagged(tag);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
        it("Should return an array of service names tagged by a specific tag", function () {
            container.add('foo', function () {}, ['tagged', 'tag_a']);
            container.add('bar', function () {}, ['tagged', 'tag_b']);
            var tagged = container.tagged('tagged');
            expect(Array.isArray(tagged)).toBe(true);
            expect(tagged.length).toBe(2);
        });
    });
    describe('#get()', function () {
        var container = null;
        beforeEach(function() {
            container = new Container(new MemoryStore(), new MemoryStore(), new TagStore(), new WrapperFactory());
        });
        afterEach(function() {
            container = null;
        });
        it('Should throw SyntaxError when the name parameter is not provided', function () {
            var test = function () {
                container.get();
            };
            expect(test).toThrowError(SyntaxError, 'The name parameter is required.');
        });
        it('Should throw RangeError when the name doesn\'t exist', function () {
            var name = 'non-existent-name';
            var test = function () {
                container.get(name);
            };
            expect(test).toThrowError(RangeError, 'The requested dependency "' + name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
        });
        it('Should throw an exception if the service locator does not return a value', function () {
            container.add('service_locator', function () {});
            var test = function () {
                var result = container.get('service_locator');
            };
            expect(test).toThrowError(TypeError, 'The service locator \'service_locator\' does not return a value.');
        });
        it('Should return the service object if a service locator function was added', function () {
            container.add('service_locator', function () {
                return new Object();
            });
            var result = container.get('service_locator');
            expect(typeof result).toBe('object');
        });
        it('Should return the string value if a string parameter was added', function () {
            container.add('string', 'string_value');
            var result = container.get('string');
            expect(typeof result).toBe('string');
            expect(result).toBe('string_value');
        });
        it('Should return the numeric value if a number parameter was added', function () {
            container.add('number', 1);
            var result = container.get('number');
            expect(typeof result).toBe('number');
            expect(result).toBe(1);
        });
        it('Should return the object hash if a hash parameter was added', function () {
            container.add('hash', {
                name: 'name'
            });
            var result = container.get('hash');
            expect(typeof result).toBe('object');
            expect(result.name).toBe('name');
        });
        it('Should return a cached service object rather than invoke the service locator', function () {
            container.add('object', function () {
                return new Object();
            });
            var result_one = container.get('object');
            var result_two = container.get('object');
            expect((result_one == result_two)).toBe(true);
        });
        it('Should return the function that has been wrapped by #parameter() before being added', function () {
            container.add('callable', container.parameter(function () {
                return '_foo';
            }));
            var result = container.get('callable');
            expect(typeof result).toBe('function');
            expect(result()).toBe('_foo');
        });
        it('Should return a new service object if the function has been wrapped by #factory before being added', function () {
            var test_function = function () {
                return new Object();
            };
            var factory = container.factory(test_function);
            container.add('factory', factory);
            var result_one = container.get('factory');
            var result_two = container.get('factory');
            expect((result_one != result_two)).toBeTruthy();
        });
        it("Should inject the container into any service locator or factory", function () {
            container.add('injected_container', function (c) {
                return (c instanceof Container);
            });
            var result = container.get('injected_container');
            expect(result).toBe(true);
        });
        it('Should return an object with all of its dependencies automatically populated', function () {
            var Foo = function () {};
            Foo.prototype.getMessage = function () {
                return "foo";
            };
            var Bar = function (foo) {
                this._foo = foo;
            };
            Bar.prototype.getMessage= function () {
                return this._foo.getMessage();
            };
            Bar.prototype.getFoo = function () {
                return this._foo;
            };
            container.add('foo', function () {
                return new Foo();
            });
            container.add('bar', function (c) {
                return new Bar(c.get('foo'));
            });
            var expected_bar = container.get('bar');
            var expected_foo = expected_bar.getFoo();
            expect(expected_bar instanceof Bar).toBe(true);
            expect(expected_foo instanceof Foo).toBe(true);
            expect(expected_bar.getMessage()).toBe('foo');
        });
    });
    describe('#remove()', function () {
        var container = null;
        beforeEach(function() {
            container = new Container(new MemoryStore(), new MemoryStore(), new TagStore(), new WrapperFactory());
        });
        afterEach(function() {
            container = null;
        });
        it('Should throw SyntaxError when the name parameter is not provided', function () {
            var test = function () {
                container.remove();
            };
            expect(test).toThrowError(SyntaxError, 'The name parameter is required.');
        });
        it('Should throw RangeError when the name doesn\'t exist.', function () {
            var non_existent_name = 'non-existent-name';
            var test = function () {
                container.remove(non_existent_name);
            };
            expect(test).toThrowError(RangeError, 'The requested dependency "' + non_existent_name + '" has not been registered. Try checking spelling or correct use of upper and lower case characters.');
        });
        it("Should remove references to service locators, cached service objects, factories, callables and parameters", function () {
            container.add('factory', container.factory(function () {
                return {};
            }));
            container.add('parameter', container.parameter(function () {}));
            container.add('parameter', 'string');
            container.add('service', function () {
                // make sure our service locator returns a value or else it will throw an error when we call it
                // and the container tries to add an undefined response to the cache.
                return {
                    object: 'object_to_cache'
                };
            });// make sure we cache a result so we can see in code coverage if this branch is called
            var result = container.get('service');
            container.remove('factory');
            container.remove('parameter');
            container.remove('service');
            var test_factory = function () {
                container.get('factory');
            };
            var test_parameter = function () {
                container.get('parameter');
            };
            var test_service = function () {
                container.get('service');
            };
            expect(test_factory).toThrowError(RangeError);
            expect(test_parameter).toThrowError(RangeError);
            expect(test_service).toThrowError(RangeError);
        });
        it('Should remove associated dependencies from the tags when a dependency is removed', function () {
            // add two services with tags
            container.add('foo', function () {}, ['tagged', 'tag_a']);
            container.add('bar', function () {}, ['tagged', 'tag_b']);
            // remove the foo service
            container.remove('foo');
            // get all the services tagged with "tagged"
            var tagged = container.tagged('tagged');
            // there should only be one value (bar) returned as foo was removed
            expect(tagged.length).toBe(1);
            // confirm that foo can not be found
            expect(tagged).not.toContain('foo');
            expect(tagged).toContain('bar');
        });
        it('Should remove the tag if all associated dependencies have been removed', function () {
            // add two services with tags
            container.add('foo', function () {}, ['tagged', 'tag_a']);
            container.add('bar', function () {}, ['tagged', 'tag_b']);
            // remove both the services tagged with 'tagged'
            container.remove('foo');
            container.remove('bar');
            // get all the services tagged with "tagged"
            var tagged = container.tagged('tagged');
            expect(Array.isArray(tagged)).toBe(true);
            expect(tagged.length).toBe(0);
        });
    });
});