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
            dest: 'tmp/spec',
            ext: '.js'
          },
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.coffee'],
            dest: 'lib/',
            ext: '.js'
          }
        ]
      }
    },
    browserify: {
      options: {
        banner: '<%= meta.banner %>',
        exclude: ["underscore", "jquery", "handlebars"],
        alias: {
          'jquery': './shims/jquery.js',
          'underscore': './shims/underscore.js',
          'handlebars': './shims/handlebars.js'
        }
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': ['shim/**/*.js', 'lib/index.js'],
          'spec/index.js': ['tmp/spec/index.js'],
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
    mocha_phantomjs: {
      options: {
        reporter: 'spec'
      },
      all: ['spec/**/*.html']
    },
    watch: {
      coffee: {
        files: ['src/**/*.coffee', 'spec/**/*.coffee'],
        tasks: 'coffee'
      },
      browserify: {
        files: ['lib/**/*.js'],
        tasks: ['browserify', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['coffee', 'browserify', 'uglify', 'mocha_phantomjs']);
};
