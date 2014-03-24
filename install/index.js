//http://stackoverflow.com/questions/20721060/yeoman-call-sub-generator-with-user-supplied-arguments
'use strict';

var path = require('path'),
	yo = require('yeoman-generator');

module.exports = yo.generators.Base.extend({
	askFor: function() {
		var cb = this.async();

		var prompts = [
			{
				type: 'list',
				name: 'selectedComponent',
				message: 'Which component would you like to install?',
				choices: [
				// {
				//     'name': 'Dopamine (latest w/ gulp compiler)',
				//     'value': 'Dopamine'

				// },
				{
					'name': 'Stylus',
					'value': 'dp-stylus'

				},
				// {
				//     'name': 'Stylus - Extended',
				//     'value': 'dp-stylus-extended'

				// },
				{
					'name': 'Sass',
					'value': 'dp-scss'

				}],
				default: 'Dopamine'

			},
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

		this.log.info('Fetching '+this.selectedComponent+' from the outer space...Yes, it\'s magic.');

		// this.extensionMap = {
		// 	{'dp-stylus'}
		// };
		this.lib = this.selectedComponent.split('-')[1];
		this.path = 'src/'+this.lib+'/';


		// this.installDopamine = function(remote, finish){
		//     console.log ('installDopamine()');

		//     remote.directory('src/', path.join(this.path, 'src/'));

		//     // var files = this.expandFiles('*.{styl,scss}', {
		//     var files = this.expandFiles(['*.*', '!'], {
		//         cwd: remote.cachePath
		//     });

		//     files.map(function(filename) {
		//         remote.copy(filename, path.join(this.path, filename));
		//     }.bind(this));


		//     finish();
		// };

		this.installStylus = function(remote, finish){
			console.log ('installStylus()');
			remote.directory('layout/', path.join(this.path, 'layout/'));
			remote.directory('mixins/', path.join(this.path, 'mixins/'));
			remote.directory('modules/', path.join(this.path, 'modules/'));
			remote.directory('site/', path.join(this.path, 'site/'));

			var files = this.expandFiles('*.{styl,scss}', {
				cwd: remote.cachePath
			});

			files.map(function(filename) {
				remote.copy(filename, path.join(this.path, filename));
			}.bind(this));

			finish();
		};


		this.remote('yoDopamine', this.selectedComponent, function(err, remote) {
			if (err) {
				return cb(err);
			}

			switch (this.selectedComponent){
				case 'dp-stylus'    : this.installStylus(remote, cb); break;
				case 'Dopamine'     : this.installDopamine(remote, cb); break;
				default				: cb(); break;
			}




		}.bind(this));
	}
});
