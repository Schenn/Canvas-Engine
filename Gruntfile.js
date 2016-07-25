module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

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
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          "app/cengine/es6/engineParts/utilities.js": "<%= cengine %>/engineParts/utilities.js",
          "app/cengine/es6/engineParts/propertyDefinitions.js": "<%= cengine %>/engineParts/propertyDefinitions.js",
          "app/cengine/es6/resources/SpriteSheet.js": "<%= cengine %>/resources/SpriteSheet.js",
          "app/cengine/es6/engineParts/ResourceManager.js": "<%= cengine %>/engineParts/ResourceManager.js",
          "app/cengine/es6/components/Component.js": "<%= cengine %>/components/Component.js",
          "app/cengine/es6/components/ImageWrapper.js": "<%= cengine %>/components/ImageWrapper.js",
          "app/cengine/es6/components/KeyPress.js": "<%= cengine %>/components/KeyPress.js",
          "app/cengine/es6/components/Mouse.js": "<%= cengine %>/components/Mouse.js",
          "app/cengine/es6/components/Movement.js": "<%= cengine %>/components/Movement.js",
          "app/cengine/es6/components/PointPlotter.js": "<%= cengine %>/components/PointPlotter.js",
          "app/cengine/es6/components/Renderer.js": "<%= cengine %>/components/Renderer.js",
          "app/cengine/es6/components/SpriteSheetWrapper.js": "<%= cengine %>/components/SpriteSheetWrapper.js",
          "app/cengine/es6/components/Text.js": "<%= cengine %>/components/Text.js",
          "app/cengine/es6/components/TileMap.js": "<%= cengine %>/components/TileMap.js",
          "app/cengine/es6/components/Timer.js": "<%= cengine %>/components/Timer.js",
          "app/cengine/es6/ComponentList.js" : "<%= cengine %>/ComponentList.js",
          "app/cengine/es6/entities/Entity.js": "<%= cengine %>/entities/Entity.js",
          "app/cengine/es6/entities/Rect.js": "<%= cengine %>/entities/Rect.js",
          "app/cengine/es6/entities/Image.js": "<%= cengine %>/entities/Image.js",
          "app/cengine/es6/entities/Label.js": "<%= cengine %>/entities/Label.js",
          "app/cengine/es6/entities/Line.js": "<%= cengine %>/entities/Line.js",
          "app/cengine/es6/entities/Sprite.js": "<%= cengine %>/entities/Sprite.js",
          "app/cengine/es6/entities/Animator.js": "<%= cengine %>/entities/Animator.js",
          "app/cengine/es6/entities/AnimatedSprite.js": "<%= cengine %>/entities/AnimatedSprite.js",
          "app/cengine/es6/entities/Button.js": "<%= cengine %>/entities/Button.js",
          "app/cengine/es6/entities/MobileSprite.js": "<%= cengine %>/entities/MobileSprite.js",
          "app/cengine/es6/entities/TileMap.js": "<%= cengine %>/entities/TileMap.js",
          "app/cengine/es6/EntityList.js" : "<%= cengine %>/EntityList.js",
          "app/cengine/es6/engineParts/EntityTracker.js": "<%= cengine %>/engineParts/EntityTracker.js",
          "app/cengine/es6/engineParts/EntityManager.js": "<%= cengine %>/engineParts/EntityManager.js",
          "app/cengine/es6/CanvasEngine.js" : "<%= cengine %>/CanvasEngine.js"
        }
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
          'js/cengine-plugins.min.js': [
            '<%= cengine %>/polyfills/**/*.js',
            '<%= cengine %>/jqueryPlugins/**/*.js']
        }
      }
    },
    jshint: {
      cengine: ['<%= cengine %>'],
      options:{
        esversion: 6,
        ignores: ["<%=cengine %>/doc"]
      }
    },
    watch: {
      options: {
        livereload:{
          options: {livereload: true},
          files: ['index.html', 'js/*', 'Gruntfile.js']
        }
      },
      lint: {
        files: ["<%= cengine %>/components/*",
          "<%= cengine %>/engineParts/*",
          "<%= cengine %>/entities/*",
          "<%= cengine %>/resources/*",
          "<%= cengine %>/*.js"
          ],
        tasks: ['jshint']
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

  grunt.registerTask("babelfy", ["babel"]);

  grunt.registerTask('buildlib', ['bower_concat','uglify:libraries']);

  grunt.registerTask('installLibrary', function(lib){
    grunt.task.run('shell:installLibrary:'+lib);
    grunt.task.run('buildlib');
  });

  grunt.registerTask('updateLibrary', function(lib){
    grunt.task.run('shell:updateLibrary:'+lib);
    grunt.task.run('buildlib');
  });

  grunt.registerTask('compile', ['jshint', "babel"]);

  grunt.event.on('lint', function(action, filepath) {
    grunt.config('jshint.compiledJS.src', filepath);
  });
};