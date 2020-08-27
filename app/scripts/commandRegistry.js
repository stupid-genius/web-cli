/*
 *	IDEAS
 *	- chmod, crontab code/decode
 *	- area code lookup
 *	- dict
 */
var commandRegistry = function(APIClient, DocumentService, builtin){
	var registry = {
		anagram: function(queryWord){
			var term = this;
			return new Promise(function(resolve, reject){
				APIClient.anagrams({
					word: queryWord,
					success: function(res){
						var response = eval(res);
						for(var word in response){
							term.echo(response[word]);
						}
						resolve();
					},
					error: function(error){
						resolve(error);
					}
				});
			});
		},
		api: function(){
			this.echo(JSON.stringify(APIClient));
			return 'API Client - load registry from DocumentService';
		},
		/*ascii: function(){
			var arr = [[1,2,3,4,5], ["lorem", "ipsum", "dolor", "sit", "amet"]];
			return ascii_table(arr, true);
		},*/
		cas: function(){
			var Alg = Algebrite;
			this.push([{
				'exit': function(){
					this.echo('exiting');
					this.pop();
				}
			}, function(expr){
				this.echo(Alg.run(expr));
			}], {
				name: 'jscas',
				prompt: 'cas> ',
				keymap: {
					'CTRL+C': function(){
						this.echo('exiting');
						this.pop();
					}
				}
			});
			return '';
		},
		cat: function(){
			if(arguments.length<1){
				return 'usage: cat <filename>';
			}
			var doc = DocumentService.read(arguments[0]);
			return doc;
		},
		date: function(){
			return Date();
		},
		dm42: function(){
			return 'DM42 editor';
		},
		download: function(){
			return 'file download; uses DocumetService';
		},
		endec: function(url){
			return decodeURI(url);
		},
		help: function(){
			this.echo('Available commands:');
			var cmds = Object.keys(registry);
			for(var cmd in cmds){
				this.echo(cmds[cmd]);
			}
			return '';
		},
		hot: function(){
			return 'Hands On Table (reads from DocumentService)';
		},
		ip: function(ip){
			return new Promise(function(resolve, reject){
				APIClient.ipinfo({
					ip: ip,
					success: function(res){
						resolve(res);
					}
				});
			});
		},
		js: function(){
			var mainTerm = this;
			this.push([registry, function(command){
				try{
					var result = window.eval(command);
					if(result !== undefined){
						this.echo(new String(result));
					}
				}
				catch(e){
					this.error(new String(e));
				}
			}], {
				name: 'js',
				prompt: 'js> ',
				greeting: 'FYI: this doesn\'t really work well',
				keymap: {
					'CTRL+C': function(){
						this.echo('exiting');
						this.pop();
					}
				}
			});
			return '';
		},
	    jsci: function(){
			var args = [].slice.call(arguments);
			var switchPat = /^\-(\w+).*/;
			var i = 0;
			while(switchPat.test(args[i])){
				var switchArg = args[i++].replace(switchPat, '$1');
				switch(switchArg){
				case 'h':
				case '-help':
					return 'usage: jsci [-o <output file>][-r][-l] <grammar> <source>';
				case 'o':
					args.outputFile = args[i++];
					break;
				case 'r':
				case '-run':
					args.immediate = true;
					break;
				case 'l':
				case '-ls':
					args.listing = true;
					break;
				default:
					return 'unrecognized switch';
				}
			}
			var grammarPath = args[i++];
			var sourcePath = args[i++];

			try{
				var grammar = DocumentService.read(grammarPath);
				var parser = new jsci(grammar);
				if(args.listing){
					this.echo(parser.toString());
				}
				var source = DocumentService.read(sourcePath);
				var out = parser.parse(source)+'return "";';
				if(args.outputFile){
					DocumentService.update(args.outputFile, out);
				}
				if(args.immediate){
					var prog = new Function(out);
					this.push(function(input, term){
						term.echo(prog.call(term, input));
						term.pop();
					});
					this.exec('', true);
				}
				return out;
			}
			catch(e){
				console.error('jsci: ', e);
				return 'jsci error';
			}
	    },
		json: function(){
			return 'JSON editor, formatter, validator';
		},
		login: function(){
			return 'built-in login';
		},
		lookup: function(){
			return 'generate lookup tables for ASCII, Unicode';
		},
		ls: function(){
			return (localStorage['DocumentService:/']+builtin).split(/;/).filter(function(e){return e!==''});
		},
		man: function(){
			return 'display man page for commands';
		},
		md: function(){
			return 'MarkDown viewer (reads from DocumentService)';
		},
		passgen: function(){
			return new Promise(function(resolve, reject){
				APIClient.passgen({
					success: function(res){
						resolve(res);
					}
				});
			});
		},
		prng: function(max){
			return uheprng()(max);
		},
		qotd: function(){
			return new Promise(function(resolve, reject){
				APIClient.qotd({
					success: function(res){
						resolve(res);
					}
				});
			});
		},
		tex: function(){
			return 'TeX viewer (reads from DocumentService)';
		},
		time: function(){
			var date = new Date();
			return date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+':'+date.getMilliseconds();
		},
		url: function(){
			return 'URL shortener';
		},
	    vim: function(){
			var path = [].slice.call(arguments).join(' ');
			this.mode('editor', path);
			return '';
	    },
		weather: function(location){
			var term = this;
			return new Promise(function(resolve, reject){
				APIClient.weather({
					loc: location,
					success: function(res){
						var response = $(res)
						resolve(response);
					},
					error: function(msg){
						reject(JSON.stringify(msg));
					}
				});
			});
		}
	};
	return registry;
};
