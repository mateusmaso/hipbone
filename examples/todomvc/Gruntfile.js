module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      glob_to_multiple: {
        files: [
          {
            expand: true,
            cwd: 'coffee',
            src: ['**/*.coffee'],
            dest: 'js/',
            ext: '.js'
          }
        ]
      }
    },
    concat: {
      dist: {
        src: [
          'js/todomvc.js',
          'js/initializers/*.js',
          'js/locales/*.js',
          'js/models/*.js',
          'js/collections/*.js',
          'js/routes/*.js',
          'js/views/*.js'
        ],
        dest: 'application.js'
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
          "templates.js": "js/templates/application.hbs"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['handlebars', 'coffee', 'concat']);
};
