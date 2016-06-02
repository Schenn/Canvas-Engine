module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: "app",
    cengine: 'app/cengine',
    plugins: "app/jqueryPlugins",
    shell: {
      installLibrary: {
        command: function(lib){
          return "bower install " + lib + ' -S';
        }
      },
      updateLibrary: {
        command: function(lib){
          return "bower update " + lib;
        }
      }
    },
    bower_concat: {
      all:{
        dest: 'js/lib.js'
      }
    },
    uglify: {
      libraries: {
        options: {
          mangle: true,
          compress: true
        },
        files: {
          'js/lib.min.js':'js/lib.js'
        }
      },
      cengine: {
        options: {
          mangle: true,
          compress: true,
          screwIE8: true,
          sourceMap: true,
          quoteStyle: 3
        },
        files: {
          'js/cengine.min.js': [
            '<%= cengine %>/polyfills/**/*.js',
            '<%= cengine %>/jqueryPlugins/**/*.js',
            '<%= cengine %>/*.js',
            '<%= cengine %>/engineParts/*.js',
            '<%= cengine %>/resources/*.js',
            '<%= cengine %>/entities/*.js',
            '<%= cengine %>/components/*.js' ]
        }
      }
    },
    jshint: {
      cengine: ['<%= cengine %>']
    },
    watch: {
      options: {
        livereload:{
          options: {livereload: true},
          files: ["<%= app %>/**/*", 'index.html', 'js/*', 'Gruntfile.js']
        }
      },
      lintAndCompile: {
        files: ['<%= app %>/**/*'],
        tasks: ['jshint', 'uglify']
      }
    },
    jsdoc:{
      dist: {
        src: ['<%= cengine %>/polyfills/**/*.js',
          '<%= cengine %>/jqueryPlugins/**/*.js',
          '<%= cengine %>/*.js',
          '<%= cengine %>/engineParts/*.js',
          '<%= cengine %>/resources/*.js',
          '<%= cengine %>/entities/*.js',
          '<%= cengine %>/components/*.js'
        ],
        options: {
          destination: "<%= cengine %>/doc",
          template: "node_modules/ink-docstrap/template",
          configure: "node_modules/ink-docstrap/template/jsdoc.conf.json",
          pedantic: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

  grunt.registerTask('buildlib', ['bower_concat','uglify:libraries']);

  grunt.registerTask('installLibrary', function(lib){
    grunt.task.run('shell:installLibrary:'+lib);
    grunt.task.run('buildlib');
  });

  grunt.registerTask('updateLibrary', function(lib){
    grunt.task.run('shell:updateLibrary:'+lib);
    grunt.task.run('buildlib');
  });

  grunt.registerTask('compile', ['jshint', 'uglify:cengine']);

  grunt.event.on('lintAndCompile', function(action, filepath) {
    grunt.config('jshint.compiledJS.src', filepath);
  });
};