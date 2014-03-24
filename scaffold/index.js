'use strict';

var path = require('path'),
    yo = require('yeoman-generator');


module.exports = yo.generators.Base.extend({
    constructor: function(arg, options) {
        yo.generators.Base.apply(this, arguments);

        this.on('end', function() {
            this.installDependencies({
                skipInstall: options['skip-install']
            });
        });

        this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
        this.bwr = JSON.parse(this.readFileAsString(path.join(__dirname, '/templates/bowerrc')));
    },

    askFor: function() {
        var cb = this.async();

        var prompts = [
            {
                name: 'projectName',
                message: 'Project Name',
                default: path.basename(process.cwd())
            },
            // {
            //     name: 'lang',
            //     message: 'Project Language',
            //     default: 'en'
            // }
        ];

        this.prompt(prompts, function(props) {
            for (var prop in props) {
                if (props.hasOwnProperty(prop)) {
                    this[prop] = props[prop];
                }
            }

            cb();
        }.bind(this));

    },

    scaffold: function() {
        /*
         * Grab Dopamine base project from GitHub
         */
        // this.directory('src/', 'src/');

        console.log ('Checkout Dopamine base..');
        this.remote('yoDopamine', 'Dopamine', function(err, remote) {
            if (err) {
                return cb(err);
            }

            remote.directory('src/', path.join(this.path, 'src/'));

            var files = this.expandFiles(['*.*', '!dopamine.json'], {
                cwd: remote.cachePath
            });

            files.map(function(filename) {
                remote.copy(filename, path.join(this.path, filename));
            }.bind(this));

            cb();

        }.bind(this));


        /*
         * Create folder for webfonts
         */
        // this.mkdir('fonts'); // Refactored, via github

        /*
         * Create folder for sprites and images
         */
        // this.mkdir('src/images/sprites/2x'); // Refactored, via github

        // this.copy('_gitignore', '.gitignore'); // Refactored, via github
        // this.copy('editorconfig', '.editorconfig'); // Refactored, via github
        // this.copy('jshintrc', '.jshintrc'); // Refactored, via github
        // this.copy('bowerrc', '.bowerrc'); // Refactored, via github

        this.template('dopamine.json', 'dopamine.json');
        // this.template('_bower.json', 'bower.json'); // Refactored, via github
        // this.template('_package.json', 'package.json'); // Refactored, via github
        // this.template('_gulpfile.js', 'gulpfile.js'); // Refactored, via github
        this.template('_humans.txt', 'humans.txt');

    }
});
