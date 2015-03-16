'use strict';

var async = require('async')
  , path = require('path')
  , _ = require('underscore')
  , FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
  , FN_ARG_SPLIT = /,/
  , FN_ARG = /^\s*(_?)(\S+?)\1\s*$/
  , STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

// Helper method used to get the current stack trace
function stacktrace() {
    return new Error().stack.split('\n').splice(2);
}

function injector( factoriesDirs ) {
    var self = this;

    if ( !(self instanceof injector) ) {
        return new injector( Array.prototype.slice.call( arguments ) );
    }

    if ( !_.isArray( factoriesDirs ) ) {
        factoriesDirs = arguments;
    }

    this._inherited = {
        instances: {},
        factories: {},
        callbacks: {},
        factoriesDirs: factoriesDirs
    };
    this._locals = {};


    this.inject = function( fn, locals, cb ) {
        var stack = stacktrace()
          , i;

        if ( typeof( locals ) === 'function' ) {
            cb = locals;
            locals = undefined;
        }

        if ( !locals ) {
            i = self;
        } else {
            i = injector();
            i._inherited = self._inherited;
            i._locals = _.extend( {}, self._locals, i._locals, locals );
        }

        return i._inject( fn, function( err, ret ) {
            if ( !err ) {
                return cb && cb( ret );
            }

            stack = stack.splice(1);
            var txtStack = stack.join('\n');

            var err2 = new Error( 'Error during injection\n' + txtStack + '\n\nOriginal error was ' + err );
            err2.cause = err;
            err2.injectStack = stack;
            throw err2;
        });
    };

    this.inject.__defineGetter__( 'instances', function() {
        return _.extend( {}, self._inherited.instances, self._locals );
    });

    this._locals[ 'inject' ] = this.inject;
};

injector.prototype.instance = function( name, obj ) {
    this._inherited.instances[ name ] = obj;
};

injector.prototype.getInstance = function( name ) {
    return this._inherited.instances[ name ];
};

injector.prototype.factory = function( name, factory) {
    this._inherited.factories[ name ] = factory;
};

injector.prototype._inject = function( fn, cb ) {
    var self = this
      , names = []
      , fnText = fn.toString().replace( STRIP_COMMENTS, '' )
      , argDecl = fnText.match( FN_ARGS )
      , ret
      , done = function( err ) {
            cb && cb(err, ret);
        };

    argDecl[ 1 ].split( FN_ARG_SPLIT ).forEach( function( arg ) {
        arg.replace( FN_ARG, function( all, underscore, name ) {
            names.push( name );
        });
    });

    async.map(
        names,
        function( name, cb ) {
            var instance;
            if ( name === 'callback' ) {
                instance = done;
                done = null;
            } else {
                instance = self._locals[ name ];
                if ( !instance ) {
                    instance = self._inherited.instances[ name ];
                }
            }
            if ( instance ) {
                return cb( null, instance );
            }

            var callbacks = self._inherited.callbacks[ name ];
            if ( !callbacks ) {
                callbacks = self._inherited.callbacks[ name ] = [];
                callbacks.push( cb );
                self._resolve( name, self._resolved.bind( self ) );
            } else {
                callbacks.push( cb );
            }

        },
        function( err, instances ) {
            if ( err ){
                return cb && cb( err );
            }
            ret = construct( fn, instances );
            done && done();
        }
    );
};

injector.prototype._resolve = function( name, cb ) {
    var factory = this._inherited.factories[ name ]
      , factoriesDirs = this._inherited.factoriesDirs;

    if ( factory ) {
        delete this._inherited.factories[ name ];
    } else {
        for ( var i = 0; i < factoriesDirs.length; i++ ) {
            var factoryDir = factoriesDirs[ i ];
            try {
                factory = require( path.join( factoryDir, name ) );
                break;
            } catch ( err ) {}
        }

        if ( !factory ) {
            if ( name[0] !== '$' ) {
                return cb( new Error( "can't find factory for " + name ), name );
            } else {
                return cb( null, name, null );
            }
        }
    }

    this._inject( factory, function( err, instance ) {
        cb( err, name, instance );
    });
};

injector.prototype._resolved = function( err, name, instance ) {
    var callbacks = this._inherited.callbacks[ name ];

    this._inherited.instances[ name ] = instance;
    callbacks.forEach(function( cb ) {
        cb( err, instance );
    });
    delete this._inherited.callbacks[ name ];
};

function construct( constructor, args ) {
    function Ctor() {
        return constructor.apply( this, args );
    }
    Ctor.prototype = constructor.prototype;
    return new Ctor();
}

module.exports = injector;
