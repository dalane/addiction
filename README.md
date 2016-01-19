# node-ioc-container
A small dependency injection container for Node.js quickly cobbled together after spending a little bit of time using require statements and realising that I could end up in dependency hell pretty quickly. It was inspired by the Pimple PHP dependency injection container.

## Installing
node-ioc-container will be setup as an NPM package and when available will be installed via NPM.

## Usage

Suggested approach is to create a file called "dependencies.js" and in it map all of the dependencies your project has.

** Note, this package is in development and not available on NPM yet.**

```javascript
// dependencies.js
var container = require('dalane-node-ioc-container');

container.add('foo', function () {
  return new Foo();
});

container.add('bar', function () {
  // return a new Bar object that uses constructor injection for its Foo dependency
  return new Bar(container.get('foo'));
});
```

** Note, this package is in development and not available on NPM yet.**
