module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['dist/angular/angular-min.js'], dest: 'test html/js', filter: 'isFile'},
          {expand: true, flatten: true, src: ['dist/angular-animate/angular-animate.js'], dest: 'test html/js', filter: 'isFile'},
          {expand: true, flatten: true, src: ['dist/bootstrap/dist/js/bootstrap.min.js'], dest: 'test html/js', filter: 'isFile'},
          {expand: true, flatten: true, src: ['dist/jquery/dist/jquery.min.js'], dest: 'test html/js', filter: 'isFile'},
        ],
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['copy']);

};