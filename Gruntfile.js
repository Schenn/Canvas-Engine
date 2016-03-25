module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: "app",
    plugins: "plugins",
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
      }
    },
    watch: {
      options: {
        livereload:{
          options: {livereload: true},
          files: ["<%= app %>", 'index.html', 'app/**/*.html']
        }
      },
      lintAndCompile: {
        files: ['<%= app %>/**/*','<%= plugins %>/**/*'],
        tasks: ['jshint', 'uglify']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

  grunt.registerTask('buildlib', ['bower_concat','uglify:libraries']);

  //grunt.registerTask('compile', ['jshint', 'uglify']);

  grunt.event.on('lintAndCompile', function(action, filepath) {
    grunt.config('jshint.compiledJS.src', filepath);
  });
};