module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: 'js/*.js',
        dest: 'js/*-full.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= concat.dist.dest %>.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: true,
        reporterOutput: ''
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      },
      dist: {
        src: 'js/*.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    sass: {
      options: {
        style: 'compact',
        unixNewlines: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'css/',
          src: ['**/*.sass'],
          dest: 'css/',
          ext: '.css'
        }]
      }
    },
    postcss: {
      options: {
        map: {
          inline: false
        },
        processors: [
          require('pixrem')(),
          require('autoprefixer')({browsers: ['>5%', 'last 10 versions', 'Firefox ESR']}),
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'css/',
          src: ['**/*.css'],
          dest: 'dist/css/',
          ext: '.css'
        }]
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      cssfiles: {
        files: ['css/**/*.sass', 'css/**/*.css'],
        tasks: ['sass', 'postcss']
      },
      js: {
        files: ['js/*.js'],
        tasks: ['jshint:dist']
      }
    }
  });

  // These plugins provide necessary tasks.
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');

  // Default task.
  grunt.registerTask('css', ['watch:cssfiles']);
  grunt.registerTask('js', ['watch:js']);
  grunt.registerTask('default', ['watch']);

};
