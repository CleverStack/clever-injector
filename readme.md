# Cleverstack Injector Module

[![NPM version](https://badge.fury.io/js/clever-injector.png)](http://badge.fury.io/js/clever-injector) [![GitHub version](https://badge.fury.io/gh/cleverstack%2Fclever-injector.png)](http://badge.fury.io/gh/cleverstack%2Fclever-injector) [![Dependency Status](https://david-dm.org/CleverStack/clever-injector.png)](https://david-dm.org/CleverStack/clever-injector) [![devDependency Status](https://david-dm.org/CleverStack/clever-injector/dev-status.png)](https://david-dm.org/CleverStack/clever-injector#info=devDependencies) [![Code Climate](https://codeclimate.com/github/CleverStack/clever-injector.png)](https://codeclimate.com/github/CleverStack/clever-injector) 
[![Build Status](https://secure.travis-ci.org/CleverStack/clever-injector.png?branch=master)](https://travis-ci.org/CleverStack/clever-injector) 
[![Coverage](https://codeclimate.com/github/CleverStack/clever-injector/coverage.png)](https://codeclimate.com/github/CleverStack/clever-injector) [![NPM downloads](http://img.shields.io/npm/dm/clever-injector.png)](https://www.npmjs.org/package/clever-injector) 

![CleverStack Node Seed](http://cleverstack.github.io/assets/img/logos/node-seed-logo-clean.png "CleverStack Node Seed")

NodeJS Dependency Injection for the CleverStack ecosystem, designed to work with or without CleverStack.

## Important
If you are using the CleverStack framework you do not need to install or setup the injector, CleverStack comes out of the box with the injector ready to use.

### Features
1. Simple, declarative dependency injection.
2. Lightning-fast and fully asynchronous. (non-blocking).
3. Will never load the same resource more than once.
4. Load's resources (from multiple directories) based upon filename for you, then resolves & injects dependencies automatically. (even if your depedencies have dependencies of their own).
5. Ability to create Child Containers. (Container Hierarchy, child/sub injectors).
7. Optional Dependencies. (with the $ suffix).
8. Supports Factories for automatic Service creation. (with the Factory suffix).

### Introduction
If you are building complex applications it can become very difficult to load files (often multiple times across multiple files), manage object lifetimes, loading/resolution of dependencies (etc)... Which can be very complex for large applications or as applications grow.

With CleverInjector, you create a container and tell it where to find files, and register any factories/services/resources that are available (that can't be resolved by filename). 

Then when you define files, you should export a function with it's dependencies as named arguments, these will be resolved and injected automatically for you. (even if those depedencies have dependencies of their own), and finally you should (inside that function) add new instances to the injector.


### Install 
```
npm i clever-injector
```

### Setup injector container
```
var CleverInjector = require('clever-injector');

// You can add directories so that the injector can try to load the resources by name,
// this example presumes you have a folder called src with a file named Example.js
var injector = CleverInjector(__dirname + '/src', __dirname + '/config);

// You can add instances to the injector like this
injector.instance('config', config);
injector.instance('models', models);
injector.instance('db', db);

// You can get instances like this
var config = injector.getInstance('config');

// You can inject functions and name them like this
injector.inject( 
	function(config, models) {
	    return {}; // Return whatever resource you are defining
	},
	function(Resource) {
		injector.instance('Resource', Resource);
	}
);
// Which yield's being able to get them like this
var Resource = injector.getInstance('Resource');
```

### Writing files
```
// src/Example.js
module.exports = function( db ) {
   return {};
};
```

### Using injector.inject()
```js
injector.inject( function( Example, models, config ) {
   // this function will be called asynchronously after all required modules are initialized and/or loaded.
});
```

For more details take a look at provided [testsuite](test/test.injector.js).
There are all possible use cases.
