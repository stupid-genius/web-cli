// jshint devel:true
'use strict';

var terminalModule = angular.module('TerminalModule', ['ServicesModule']);

terminalModule.controller('ConsoleController', ['$scope', 'ExecutorService', 'DocumentService', function($scope, executor, DocumentService){
	var terminalPanel = $('#terminal');
	var settings = {
		prompt: '> ',
		name: 'terminal',
		greetings: 'Stupid Genius Software',
		checkArity: false
		/*keypress: function(e) {
			if (e.which === 96) {
				// return false;
			}
		}*/
	};
	terminalPanel.terminal = terminalPanel.terminal(executor.exec, settings);
    terminalPanel.terminal.focus(true);

	terminalPanel.terminal.stdout = terminalPanel.terminal.echo;
	terminalPanel.terminal.stdin = window.prompt;
	terminalPanel.terminal.mode = function(mode){
		var args = [].slice.call(arguments, 1);
		$scope.$apply(function(){
			var term = terminalPanel.terminal;
			$scope.mode = mode;
			switch($scope.mode){
				case 'editor':
					term.pause();
					var doc = '';
					if(args[0]!==undefined && args[0]!==''){
						try{
							doc = DocumentService.read(args);
						}
						catch(e){
							term.resume();
							delete $scope.mode;
							term.echo(e);
							return;
						}
					}
					editor.setSession(ace.createEditSession(doc));
					editor.getSession().setUseWrapMode(true);
					// editor.focus();	// this seems to cause the terminal to focus as well
				default:
					term.resume();
					// term.focus(true);	// this seems to do nothing
			}
		});
	};

	function vimNotify(cm, text){
		cm.openNotification('<span style="color: red">' + text + '</span>', {bottom: true, duration: 4999});
	}
	var editor = ace.edit('aceEditor');
	editor.setTheme('ace/theme/terminal');
	editor.setKeyboardHandler('ace/keyboard/vim');
	ace.config.loadModule('ace/keyboard/vim', function(module){
		var vim = module.CodeMirror.Vim;
		vim.defineEx('ls', 'ls', function(cm, input){
			vimNotify(cm, 'list');
		});
		vim.defineEx('write', 'w', function(cm, input){
			if(input.args===undefined){
				vimNotify(cm, 'usage: \<path\>');
				return;
			}
			var doc = editor.getValue();
			DocumentService.update(input.args, doc);
			vimNotify(cm, 'saved');
		});
		vim.defineEx('open', 'o', function(cm, input){
			vimNotify(cm, 'open');
		});
		vim.defineEx('quit', 'q', function(cm, input){
			editor.setSession();
			terminalPanel.terminal.mode();
		});
	});
}]);

terminalModule.service('ExecutorService', ['commandRegistry', 'DocumentService', Executor]);
function Executor(registry, DocumentService){
	this.exec = function(input, terminal){
		var terms = input.trim().split(/\s+/);
		var progPat = /^\.\/(.+)/;
		var cmd = terms[0];
		if(progPat.test(cmd)){
			var prog = cmd.replace(progPat, '$1');
			cmd = new Function(DocumentService.read(prog));
		}
		else{
			cmd = registry[cmd];
		}
		if(typeof(cmd)!=='function'){
			return terms[0]+': no such command';
		}

		// possible dependency injection
		//var args = /^function\s*\(\s*(.*)\s*\)(?=\s*\{)/.exec(cmd.toString())[1].split(/\s*,\s*/);

		/*
		 *   TODO ideas
		 *   - ability to run scripts (fs, localstorage, url)
		 *   - implement better built-in cmds
		 *   - can I spawn Executors in WebWorkers?
		 */

		var response = cmd.apply(terminal, terms.slice(1));
		if(response instanceof Promise){
			return response;
			/*response.then(function(resp){
				if(resp instanceof Object){
					terminal.echo(JSON.stringify(resp, null, 1));
				}
				else{
					terminal.echo(resp);
				}
			});*/
		}else{
			if(response instanceof Object){
				terminal.echo(JSON.stringify(response, null, 1));
			}
			else{
				terminal.echo(response);
			}
		}
	};

	return this;
}
terminalModule.factory('commandRegistry', ['APIClient', 'DocumentService', 'BuiltinDocuments', commandRegistry]);

if(!String.prototype.format){
    String.prototype.format = function(){
      var args = arguments;
      return this.replace(/{{(\d+)}}/g, function(match, number){
        return args[number] || '';
      });
    };
}
