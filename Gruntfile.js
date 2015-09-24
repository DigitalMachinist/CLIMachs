/* global module:false */

module.exports = function ( grunt ) {

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
          'cache/mocks.babel.js': 'spec/mocks.js', 
          'cache/specs.babel.js': 'cache/specs.esnext.js'
        }
      }
    },

    clean: {
      cache: [ 'cache' ]
    },

    concat: {
      options: {
        // Define a string to put between each file in the concatenated output.
        separator: ';'
      },
      dist: {
        src: [ 
          'src/core.js',
          'src/cli.js',
          'src/conf.js',
          'src/perm.js',
          //'src/init.js',
          //'src/cond.js',
          //'src/stat.js',
          'src/index.js'
        ],
        dest: 'cache/<%= pkg.name %>.esnext.js'
      },
      jasmine: {
        src: [ 
          'spec/core.spec.js',
          'spec/cli.spec.js',
          //'spec/conf.spec.js',
          //'spec/perm.spec.js',
          //'spec/init.spec.js',
          //'spec/cond.spec.js',
          //'spec/stat.spec.js',
          //'spec/index.spec.js'
        ],
        dest: 'cache/specs.esnext.js'
      }
    },

    jsdoc: {
      dist: {
        src: [ 'src/**/*.js', 'package.json', 'docs/api/README.md' ],
        options: {
          destination: 'docs/api',
          cachelate : 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/cachelate',
          configure : 'jsdoc.conf.json'
        }
      }
    },

    jasmine: {
      dist: {
        src: [ 'CLIMachs.js' ],
        options: {
          specs: [ 'cache/specs.babel.js' ],
          vendor: 'cache/mocks.babel.js'
        }
      }
    },

    uglify: {

      beautify: {
        options: {
          // The banner is inserted at the top of the output.
          banner: '/*! <%= grunt.template.today( "yyyy-mm-dd" ) %> ' + 
            '-- CLIMachs Roll20 Command Framework (v<%= pkg.version %>) ' + 
            '-- See <%= pkg.repository.url %> for the full source code. */\n',
          beautify: {
            beautify: true,
            width: 100
          },
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
          'roll20/<%= pkg.name %>.min.js': [ '<%= pkg.name %>.js' ]
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