module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      banner:
        '// <%= pkg.name %>\n' +
        '// ------------------\n' +
        '// v<%= pkg.version %>\n' +
        '//\n' +
        '// Copyright (c) 2012-<%= grunt.template.today("yyyy") %> Mateus Maso\n' +
        '// Distributed under MIT license\n' +
        '//\n' +
        '// <%= pkg.repository.url %>\n' +
        '\n'
    },
    coffee: {
      glob_to_multiple: {
        files: [
          {
            expand: true,
            cwd: 'spec',
            src: ['**/*.coffee'],
            dest: 'spec/temp/',
            ext: '.js'
          },
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.coffee'],
            dest: 'temp/',
            ext: '.js'
          }
        ]
      }
    },
    browserify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': ['temp/**/*.js'],
          'spec/index.js': ['spec/temp/**/*.js']
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    mocha: {
      options: {
        run: true
      },
      test: {
        src: ['spec/**/*.html']
      }
    },
    watch: {
      coffee: {
        files: ['src/**/*.coffee', 'spec/**/*.coffee'],
        tasks: 'coffee'
      },
      browserify: {
        files: ['tmp/**/*.js', 'spec/tmp/**/*.js'],
        tasks: ['browserify', 'uglify']
      }
    },
    clean: ['dist']
  });

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['coffee', 'browserify', 'uglify', 'mocha']);
};
