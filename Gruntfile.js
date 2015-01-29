module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-broccoli');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-qunit-junit');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        broccoli: {
            config: './Brocfile.js',
            debug: {
                dest: 'app',
                port: 3000,
                host: '0.0.0.0'
            },
            public: {
                dest: 'app'
            }
        },
        copy: {
            finalize: {
                files: [{
                    expand: true,
                    cwd: 'app',
                    src: '**/lxexport*',
                    dest: 'dist'
                }]
            }
        },
        qunit: {
            all: ['src/test/index.html']
        },
        qunit_junit: {
            options: {
                dest: 'build/'
            }
        }
    });

    grunt.registerTask('default', 'build:public');

    grunt.registerTask('build:debug', ['broccoli:debug:build', 'qunit_junit', 'qunit']);
    grunt.registerTask('build:public', ['broccoli:public:build', 'qunit_junit', 'qunit', 'copy:finalize']);

    grunt.registerTask('watch:debug', ['broccoli:debug:watch']);

    grunt.registerTask('server:debug', ['broccoli:debug:serve']);
    grunt.registerTask('server:public', ['broccoli:public:serve']);
};
