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
            cwd: 'src',
            src: ['**/*.coffee'],
            dest: 'lib/',
            ext: '.js'
          }
        ]
      }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: [
          'lib/hipbone.js',
          'lib/hipbone/ajax.js',
          'lib/hipbone/module.js',
          'lib/hipbone/mapping.js',
          'lib/hipbone/accessor.js',
          'lib/hipbone/validation.js',
          'lib/hipbone/computed_attribute.js',
          'lib/hipbone/model.js',
          'lib/**/*.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
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
    clean: ['dist']
  });

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['coffee', 'concat', 'uglify', 'mocha']);
};
