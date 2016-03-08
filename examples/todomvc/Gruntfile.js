module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      glob_to_multiple: {
        files: [
          {
            expand: true,
            cwd: 'todomvc',
            src: ['**/*.coffee'],
            dest: 'tmp/',
            ext: '.js'
          }
        ]
      }
    },
    concat: {
      dist: {
        src: [
          'tmp/templates.js',
          'tmp/todomvc.js',
          'tmp/initializers/*.js',
          'tmp/locales/*.js',
          'tmp/models/*.js',
          'tmp/collections/*.js',
          'tmp/routes/*.js',
          'tmp/views/view.js',
          'tmp/views/*.js'
        ],
        dest: 'todomvc.js'
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: "HandlebarsTemplates",
          processName: function(filePath) {
            return filePath.replace(".hbs", "");
          }
        },
        files: {
          "tmp/templates.js": ["todomvc/templates/*.hbs"]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['coffee', 'handlebars', 'concat']);
};
