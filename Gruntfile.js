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
          'temp/<%= pkg.name %>.babel.js': 'temp/<%= pkg.name %>.esnext.js'
        }
      }
    },

    clean: {
      temp: [ 'temp' ]
    },

    concat: {
      options: {
        // Define a string to put between each file in the concatenated output.
        separator: ';'
      },
      dist: {
        // The files to concatenate
        src: [ 
          'src/index.js', 
          'src/cli.js',
          'src/conf.js',
          'src/perm.js',
          //'src/init.js',
          //'src/cond.js',
          //'src/stat.js'
        ],
        // The location of the resulting JS file.
        dest: 'temp/<%= pkg.name %>.esnext.js'
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
          '<%= pkg.name %>.js': [ 'temp/<%= pkg.name %>.babel.js' ]
        }
      },

      minify: {
        options: {
          preserveComments: 'some'
        },
        files: {
          '<%= pkg.name %>.min.js': [ '<%= pkg.name %>.js' ]
        }
      }

    }

  } );

  grunt.loadNpmTasks( 'grunt-babel' );
  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );

  grunt.registerTask( 'default', [ 'concat', 'babel', 'uglify:beautify', 'uglify:minify' ] );

};