# Cleverstack Injector Module

[![NPM version](https://badge.fury.io/js/clever-injector.png)](http://badge.fury.io/js/clever-injector) [![GitHub version](https://badge.fury.io/gh/cleverstack%2Fclever-injector.png)](http://badge.fury.io/gh/cleverstack%2Fclever-injector) [![Dependency Status](https://david-dm.org/CleverStack/clever-injector.png)](https://david-dm.org/CleverStack/clever-injector) [![devDependency Status](https://david-dm.org/CleverStack/clever-injector/dev-status.png)](https://david-dm.org/CleverStack/clever-injector#info=devDependencies) [![Code Climate](https://codeclimate.com/github/CleverStack/clever-injector.png)](https://codeclimate.com/github/CleverStack/clever-injector) 
[![Build Status](https://secure.travis-ci.org/CleverStack/clever-injector.png?branch=master)](https://travis-ci.org/CleverStack/clever-injector) 
[![Coverage](https://codeclimate.com/github/CleverStack/clever-injector/coverage.png)](https://codeclimate.com/github/CleverStack/clever-injector) [![NPM downloads](http://img.shields.io/npm/dm/clever-injector.png)](https://www.npmjs.org/package/clever-injector) 

![CleverStack Node Seed](http://cleverstack.github.io/assets/img/logos/node-seed-logo-clean.png "CleverStack Node Seed")

NodeJS Dependency Injection for the CleverStack ecosystem, designed to work with or without CleverStack.

## Important
If you are using the CleverStack framework you do not need to install or setup the injector, CleverStack comes out of the box with the injector ready to use.

### Features
1. Non-blocking and fully async
2. Load's resources based upon name for you and injects dependencies
3. Will never load the same resource more than once, it uses the one singular instance for all dependencies

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

// You can get instances like this
var config = injector.getInstance( 'config' );

// You can inject functions and name them like this
injector.inject( 
	function( config, models ) {
	    return {}; // Return whatever resource you are defining
	},
	function( Resource ) {
		injector.instance( 'Resource', Resource );
	}
);
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
