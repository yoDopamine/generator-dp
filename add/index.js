'use strict';

var path = require('path'),
    yo = require('yeoman-generator');

module.exports = yo.generators.Base.extend({
    constructor: function(arg, options) {
        yo.generators.Base.apply(this, arguments);

        // this.on('end', function() {
        //     this.installDependencies({
        //         skipInstall: options['skip-install']
        //     });
        // });

        this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
        //this.bwr = JSON.parse(this.readFileAsString(path.join(__dirname, '/templates/bowerrc')));
    },
    askFor: function() {
        var cb = this.async();

        var prompts = [
            {
                type: 'list',
                name: 'type',
                message: 'Component type to add',
                choices: [{
                    'name': 'Stylus',
                    'value': 'stylus'

                },{
                    'name': 'SCSS',
                    'value': 'scss'

                },{
                    'name': 'Coffee',
                    'value': 'coffee'

                },{
                    'name': 'JS',
                    'value': 'js'

                },],
                default: 'stylus'

            },
            {
                type: 'list',
                name: 'behaviour',
                message: 'Is it a module or a layout file?',
                choices: [{
                    'name': 'Module',
                    'value': 'module'

                },{
                    'name': 'Layout',
                    'value': 'layout'

                }],
                default: 'module'

            },
            {
                name: 'name',
                message: 'Name your child:'
            }
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

        if (this.name.length == 0){
            this.log.error('Name plz!');
            cb();
        }

        var extList = {
            stylus: '.styl',
            scss: '.scss',
            coffee: '.coffee',
            js: '.js'
        };

        var prefixList = {
            module: 'm-',
            layout: 'layout-'
        };

        var referenceMarkers = {
            module: '//ModuleInsertReference',
            layout: '//LayoutInsertReference'
        };

        this.log.info('scaffolding...........');
        console.log(this.type, this.behaviour);

        var _sourceBase = 'src/'+this.type+'/'
        var _sourceFile = this.behaviour+extList[this.type];

        var _targetBase = 'src/'+this.type+'/'
        var _targetFile = this.behaviour+'/'+prefixList[this.behaviour]+this.name//+extList[this.type];

        this.log.info(_sourceBase+_sourceFile, _targetBase+_targetFile);
        this.template(_sourceBase+_sourceFile, _targetBase+_targetFile);


        if (this.type == 'stylus' || this.type == 'scss'){
            var _reference = [
                "@import \""+this.behaviour+'s/'+prefixList[this.behaviour]+this.name+extList[this.type]+"\"",
                ""+referenceMarkers[this.behaviour]
            ];

            var _indexFilePath = _targetBase+'main'+extList[this.type];

            this.log.info('Adding reference to: '+_indexFilePath);
            var indexFileContent = this.readFileAsString(_indexFilePath);
                indexFileContent = indexFileContent.replace(referenceMarkers[this.behaviour],_reference.join('\n'));
                this.write(_indexFilePath, indexFileContent);

            cb();
        } else {
            cb();
        }






        //this.template(this.type+'/'+'_bower.json', 'bower.json');

        // this.remote('nDmitry', 'stylus', function(err, remote) {
        //     if (err) {
        //         return cb(err);
        //     }

        //     remote.directory('lib/', path.join(this.path, 'lib/'));
        //     remote.directory('partials/', path.join(this.path, 'partials/'));

        //     var files = this.expandFiles('*.styl', {
        //         cwd: remote.cachePath
        //     });

        //     files.map(function(filename) {
        //         remote.copy(filename, path.join(this.path, filename));
        //     }.bind(this));

        //     cb();
        // }.bind(this));


    }
});
