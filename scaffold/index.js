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

		// this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
		// this.bwr = JSON.parse(this.readFileAsString(path.join(__dirname, '/templates/bowerrc')));
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
		var cb = this.async();
		this.path = ''; // project root

		/*
		 * Grab Dopamine base project from GitHub
		 */
		console.log ('Checkout Dopamine base..');
		this.remote('zsitro', 'webpack-multipage-website-boilerplate', function(err, remote) {
			if (err) {
				return cb(err);
			}

			remote.directory('src/', path.join(this.path, 'src/'));
			remote.directory('dist/', path.join(this.path, 'dist/'));

			var files = this.expandFiles('**', { cwd: remote.cachePath, dot: true });

			files.map(function(filename) {
				remote.copy(filename, path.join(this.path, filename));
			}.bind(this));

			cb();

		}.bind(this));

		this.log.info('Renaming project in gulpfile to: '+this.projectName);
		var _gulpfilePath = 'gulpfile.js';
		var _gulpFileContent = this.readFileAsString(_gulpfilePath);
			_gulpFileContent = _gulpFileContent
				.replace('/__multipageBoilerplate__/g', this.projectName);
			this.write(_gulpfilePath, _gulpFileContent);

		/*
		 * Create folder for webfonts
		 */
		// this.mkdir('fonts'); // Refactored, via github

		/*
		 * Create folder for sprites and images
		 */
		// this.mkdir('src/images/sprites/2x'); // Refactored, via github
		this.template('dopamine.json', 'dopamine.json');
		this.template('_humans.txt', 'humans.txt');

	}
});
