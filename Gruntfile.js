/* global module:false */

module.exports = function ( grunt ) {

  grunt.initConfig( {

    pkg: grunt.file.readJSON( 'package.json' ), 

    babel: {
      options: {
        comments: false,
        sourceMap: false,
        stage: 1
      },
      dist: {
        files: {
          '<%= concat.dist.dest %>': '<%= concat.dist.dest %>'
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
          'scripts/index.js', 
          'scripts/cli/cli.js'
        ],
        // The location of the resulting JS file.
        dest: 'temp/<%= pkg.name %>.js'
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
          '<%= pkg.name %>.js': [ '<%= concat.dist.dest %>' ]
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

  grunt.registerTask( 'default', [ 'concat', 'babel', 'uglify:beautify', 'uglify:minify', 'clean' ] );

};