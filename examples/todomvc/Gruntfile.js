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
            dest: 'temp/',
            ext: '.js'
          }
        ]
      }
    },
    concat: {
      dist: {
        src: [
          'temp/todomvc.js',
          'temp/initializers/*.js',
          'temp/locales/*.js',
          'temp/models/*.js',
          'temp/collections/*.js',
          'temp/routes/*.js',
          'temp/views/*.js',
          'temp/templates.js'
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
          "temp/templates.js": ["todomvc/templates/*.hbs"]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['coffee', 'handlebars', 'concat']);
};
