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
        src: '*.js',
        dest: '*-full.js'
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
        src: 'scoreboard.js'
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
          src: ['*.scss', '*.sass'],
          dest: './',
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
          src: ['./*.css'],
          dest: './',
          ext: '.css'
        }]
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      },
      cssfiles: {
        files: ['*.sass', '*.css', 'scoreboard.js'],
        tasks: ['sass', 'postcss', 'jshint:dist']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');

  // Default task.
  grunt.registerTask('project', ['watch:cssfiles']);
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};
