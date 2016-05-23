module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      glob_to_multiple: {
        files: [
          {
            expand: true,
            src: ['**/*.coffee'],
            dest: '../../tmp/examples/todomvc',
            ext: '.js'
          }
        ]
      }
    },
    browserify: {
      dist: {
        files: {
          'app/index.js': ['../../tmp/examples/todomvc/app/index.js']
        }
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: "Templates",
          processName: function(filePath) {
            return filePath.replace(".hbs", "");
          }
        },
        files: {
          "../../tmp/examples/todomvc/app/templates/index.js": ["app/templates/*.hbs"]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['coffee', 'handlebars', 'browserify']);
};
