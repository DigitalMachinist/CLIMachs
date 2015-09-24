/* global module:false */

module.exports = function ( grunt ) {

  // =============
  // Configuration
  // =============

  // Adjust what commands are included by commenting out lines in this array.
  var includedCommands = [
    'conf.js',    // The 'conf' command (recommended)
    'perm.js',    // The 'perm' command (recommended)
    //'cond.js',  // The 'cond' command (optional)
    //'init.js',  // The 'init' command (optional)
    //'stat.js',  // The 'stat' command (optional)
  ];

  // =========================================================================================
  // My advice is to stay away from everything below unless you really know what you're doing.
  // =========================================================================================
  
  grunt.initConfig( {

    pkg: grunt.file.readJSON( 'package.json' ), 

    babel: {
      options: {
        stage: 1
      },
      dist: {
        files: {
          'cache/<%= pkg.name %>.babel.js': 'cache/<%= pkg.name %>.esnext.js'
        }
      },
      jasmine: {
        files: {
          'cache/mocks.babel.js': 'tests/mocks/roll20.js', 
          'cache/specs.babel.js': 'cache/specs.esnext.js'
        }
      }
    },

    clean: {
      cache: [ 'cache' ]
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [ 'core.js', 'cli.js' ]
          .concat( includedCommands )
          .concat( 'index.js' )
          .map( function ( file ) { return 'src/' + file; } ),
        dest: 'cache/<%= pkg.name %>.esnext.js'
      },
      jasmine: {
        src: [ 
          'tests/specs/core.spec.js',
          'tests/specs/cli.spec.js',
          //'tests/specs/conf.spec.js',
          //'tests/specs/perm.spec.js',
          //'tests/specs/init.spec.js',
          //'tests/specs/cond.spec.js',
          //'tests/specs/stat.spec.js',
          //'tests/specs/index.spec.js'
        ],
        dest: 'cache/specs.esnext.js'
      }
    },

    jsdoc: {
      dist: {
        options: {
          destination: 'docs/api',
          template : 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
          configure : 'jsdoc.conf.json'
        },
        src: [ 'src/**/*.js', 'package.json', 'docs/api/README.md' ]
      }
    },

    jasmine: {
      dist: {
        options: {
          specs: [ 'cache/specs.babel.js' ],
          vendor: [ 'cache/mocks.babel.js' ]
        },
        src: [ 'CLIMachs.js' ]
      }
    },

    uglify: {

      beautify: {
        options: {
          beautify: {
            beautify: true,
            width: 100
          },
          banner: '/*! <%= grunt.template.today( "yyyy-mm-dd" ) %> ' + 
            '-- CLIMachs Roll20 Command Framework (v<%= pkg.version %>) ' + 
            '-- See <%= pkg.repository.url %> for the full source code. */\n',
          mangle: true,
          preserveComments: 'some'
        },
        files: {
          'roll20/<%= pkg.name %>.js': [ 'cache/<%= pkg.name %>.babel.js' ]
        }
      },

      minify: {
        options: {
          preserveComments: 'some'
        },
        files: {
          'roll20/<%= pkg.name %>.min.js': [ 'roll20/<%= pkg.name %>.js' ]
        }
      }

    }

  } );

  grunt.loadNpmTasks( 'grunt-babel' );
  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-jasmine' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-jsdoc' );

  grunt.registerTask( 'default', [ 'concat:dist', 'babel:dist', 'uglify:beautify', 'uglify:minify', 'test' ] );
  grunt.registerTask( 'test', [ 'concat:jasmine', 'babel:jasmine', 'jasmine' ] );
};