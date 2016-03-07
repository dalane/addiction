# A Dependency Injection Container for Node.js Applications

This is a small dependency injection container for Node.js that was cobbled together in order to practice node.js, 
debugging and unit testing, etc of javascript applications. It was inspired by the Pimple PHP dependency injection 
container.

## Dependency Injection

### What is dependency injection?

Often, developers will create required service objects within the client object.

```javascript
// The client object Foo needs the Bar service object and creates it in the constructor
var Foo = function () {
    this.bar = new Bar();
};
```

However, using dependency injection the creation of the service object is done outside of the client and then 
"injected" into the client either through the constructor ("constructor injection") or a setter ("setter injection").

```javascript
// the client object Foo needs the Bar service object. Bar is created outside Foo and then injected using 
// a constructor parameter
var Foo = function (bar) {
    this.bar = bar;
};

var bar = new Bar();
var foo = new Foo(bar);
```

### Why use dependency injection?

The reason why you should use dependency injection is that it offers: flexibility, reusability and testability.

#### Flexibility

Your objects are no longer bound to one explicit class. As your application evolves you can provide whatever service object you want (as long as it 
implements the same interface that the client object depends on).

#### Reusability

Service objects can be easily reused, we can decide to use the same instance of an object or create a new instance as
required for the client use case.

#### Testability

Injected dependencies improve the testability of classes through unit testing. The goal of unit testing is to test each
part of the program in isolation to show that it is working correctly. It allows you to find problems early and test
any changes to the code haven't introduced any problems. Since we're testing a single part of the program typically
fake dependencies (stubs and mocks) are used and these are injected into the code being tested. By using fake
dependencies we're reducing the chance of any side effects that might be caused by other libraries being introduced
into the test.

### Using a dependency injection container

When all service locators are defined and retrieved using a dependency injection container all of the dependencies 
for a program are automatically managed whenever the program is run.

## Installing

Installation via [NPM](https://www.npmjs.com) is recommended as follows.

```shell
npm install @dalane/node-di --save
```

You can run the unit tests

```shell
npm test
```

And run the (very) basic example app found in "example/main.js".

```shell
npm start
```

This will output to the command line "Hello World from Foo!". A quick look around the files (starting with main.js)
will give an idea of how to use the container.

## Usage

The dependency injection container can be used to:
 
- add service locators (functions that return service objects);
- add parameters;
- obtain service objects; and
- retrieve stored parameters.

It is suggested that the dependency injection container is populated with the service locators and parameters in a single
location. An example would be to use a "dependencies.js" file where you define all of your object dependencies and then require in your
main application file.

```javascript
// dependencies.js

var nodeDi = require('@dalane/node-di');
var container = nodeDi.getContainer();

// register service locators and parameters
...

module.exports = container;
```

With all of your dependencies mapped in the container you could write your application so that you can simply do this...

```javascript
var container = require('./path/to/dependencies.js');
var application = container.get('my-application');
application.run();
```

### Adding service locators

Service objects are obtained through service locators. These service locators are functions that return a service 
object.

```javascript
var foo_locator = function () {
    // include the require statement here so that the reference is only loaded when the function is invoked
    var Foo = require('./path/to/foo');
    // the service locator returns the created service object
    return new Foo();
};
container.add('foo', foo_locator);
```

Service locators can be explicitly added to the container as well using the #service wrapper function.

```javascript
container.add('foo', container.service(foo_locator));
```

### Obtaining service objects

Obtaining a service object is simply a matter of calling the #get() method with the name of the service locator provided as the parameter.

```javascript
var foo = container.get('foo');
```

or

```javascript
var foo = container.foo;
```

The first time a service object is requested it will be invoked and the result will be cached. Subsequent requests
will return the cached value (making it a singleton). To return a newly created service object for every request, the service 
locator needs to be first added using the #factory() wrapper before being added to the container.

```javascript
// wrap the service locator using #factory()
var factory = container.factory(function () {
    var Bar = require('./path/to/bar');
    return new Bar();
});
// add the factory to the container
container.add('bar', factory);
```

### Using service objects

To use dependency injection, you need to write your object prototypes appropriately. Service objects can be obtained
using the method #get().

```javascript
var service_object = container.get('name_of_your_service');
```

Which can then injected into each client object using either constructor injection.

```javascript
// bar.js with constructor injection of the service object Foo
module.exports = function (foo) {
    this._foo = foo;
};

// dependencies.js
container.add('bar', function (c) {
    var Bar = require('./path/to/bar');
    // use #get() to obtain the service object Foo and inject using the constructor
    return new Bar(c.get('foo'));
});
```

Or setter injection.

```javascript
// bar.js with setter injection of the service object Foo
module.exports = function () {
    this._foo;
    this.setFoo = function (foo) {
        this._foo = foo;
    };
};

// dependencies.js
container.add('bar', function (c) {
    var Bar = require('./path/to/bar');
    var bar = new Bar();
    // use #get() to obtain the service object Foo and inject using the setter #setFoo()
    bar.setFoo(c.get('foo');
    return bar;
});
```

The container is automatically passed to factory and service locators. You can use it by simply including a function
parameter as in the example above (the parameter "c" is the container).

### Parameters

Parameters can be added to the container too.

```javascript
// string
container.add('author', 'Dalane Consulting Ltd');
// numeric
container.add('max_login_attempts', 5);
// boolean
container.add('dev-mode', true);
// object hash
container.add('config', {
    website: 'http://www.dalane.co.uk'
});
```

Functions can also be added as parameters. However, to prevent them from being invoked by the container they need to be
added using the parameter wrapper.

```javascript
// wrap the function to be returned as a parameter using #parameter()
container.add('function_as_parameter', container.parameter(function () {
    // do something
});
```

Parameters are obtained from the container also using the #get() method.

### Tagging

It is possible to add tags to service locators, parameters and factories. Simply include an array of tag names
when adding the dependency to the container.

```javascript
container.add('foo', foo_locator, ['tag_1', 'tag_2']);
```

To retrieve a list of dependencies by tag simply use the #tagged method which will return an array.

```javascript
var array_of_dependency_names = container.tagged('tag_1');
// returns ['foo']
```

##About us

We are [Dalane Consulting Ltd](http://www.dalane.co.uk). A project management consulting firm based in the United 
Kingdom developing tools for our own and our clients use.
