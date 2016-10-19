module.exports = function(grunt) {

    grunt.initConfig({

        projectName: 'contested-regions',

        uglify: {
            build: {
                src: 'src/js/<%= projectName %>.js',
                dest: 'dist/<%= projectName %>.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify']);

}
