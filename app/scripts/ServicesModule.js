// jshint devel:true
'use strict';

var servicesModule = angular.module('ServicesModule', []);
servicesModule.value('DocumentRoot', 'DocumentService:/');
servicesModule.value('BuiltinDocuments', ';grammar.tiny;example.tiny;readme.md');
servicesModule.service('FileService', ['FileSystem', function(fs){
	this.get = function(name){
		return $.ajax({
			url: '/files/'+name,
			async: false,
		}).responseText;
	};
}]);
servicesModule.service('DocumentService', ['DocumentRoot', 'FileService', DocumentService]);
function DocumentService(fsRoot, files){
	if(localStorage[fsRoot]===undefined){
		localStorage[fsRoot] = '';
	}
	var self = this;

	this.create = function(path, doc){
		if(localStorage[path]!==undefined){
			throw 'Can\'t create doc; "{0}" already exists'.format(path);
		}
		localStorage[path] = doc;
		localStorage[fsRoot] += ';'+path;
		// var dirs = path.split(/\//);
	};
	this.read = function(path){
		var doc = localStorage[path];
		if(doc === undefined){
			var file = files.get(path);
			if(file === undefined){
				return 'Document "{{0}}" not found'.format(path);
			}
			else{
				return file;
			}
		}
		return doc;
	};
	this.update = function(path, doc){
		if(localStorage[path]===undefined){
			self.create(path, doc);
		}
		else{
			localStorage[path] = doc;
		}
	};
	this.delete = function(path){
		//TODO remove from dir
		delete localStorage[path];
	};
	this.find = function(target){	//find a given thing
	};
	this.search = function(path, filter){	// search a given location
	};
}
servicesModule.value('BrowserFS', BrowserFS);
servicesModule.service('FileSystem', ['BrowserFS', FileSystem]);
function FileSystem(fs){
	fs.install(window);
	fs.configure({
		fs: 'LocalStorage'
	}, function(error){
		if(error){
			throw error;
		}
	});
}
servicesModule.value('EndpointRegistry', endpointRegistry);
servicesModule.factory('APIClient', ['EndpointRegistry', APIClient]);
