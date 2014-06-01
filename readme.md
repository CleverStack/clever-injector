# Cleverstack Injector Module

[![Build Status](http://img.shields.io/travis/CleverStack/clever-injector.svg)](https://travis-ci.org/CleverStack/clever-injector) [![Code Climate](https://codeclimate.com/github/CleverStack/clever-injector.png)](https://codeclimate.com/github/CleverStack/clever-injector) [![Dependency Status](https://david-dm.org/CleverStack/clever-injector.svg?theme=shields.io)](https://david-dm.org/CleverStack/clever-injector) [![devDependency Status](https://david-dm.org/CleverStack/clever-injector/dev-status.svg?theme=shields.io)](https://david-dm.org/CleverStack/clever-injector#info=devDependencies)

![CleverStack Node Seed](http://cleverstack.github.io/assets/img/logos/node-seed-logo-clean.png "CleverStack Node Seed")

NodeJS Dependency Injection for the CleverStack ecosystem, designed to work with or without CleverStack.

## Important
If you are using the CleverStack framework you do not need to install or setup the injector, CleverStack comes out of the box with the injector ready to use.

### Install 
```
npm i clever-injector
```

### Setup injector instance
```
var CleverInjector = require( 'clever-injector' );

// You can add directories so that the injector can try to load the resources by name,
// this example presumes you have a folder called src with a file named Example.js
var injector = CleverInjector( __dirname + '/src', __dirname + '/config );

// You can add instances to the injector like this
injector.instance( 'config', config );
injector.instance( 'models', models );
injector.instance( 'db', db );
```

### Writing files
```
// src/Example.js
module.exports = function( db ) {
   return {};
};
```
### Use injector
```js
injector.inject( function( Example, models, config ) {
   // this function will be called asynchronously after all required modules are initialized and/or loaded.
});
```

For more details take a look at provided [testsuite](test/test.injector.js).
There are all possible use cases.
