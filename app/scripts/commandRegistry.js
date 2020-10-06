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
		btc: function(cmd){
			return new Promise(function(resolve, reject){
				APIClient.btc({
					cmd: cmd,
					success: function(res){
						var response = $(res)
						resolve(response);
					},
					error: function(msg){
						reject(JSON.stringify(msg));
					}
				});
			});
			
		},
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
		cs: function(){
			var cmd = [].slice.call(arguments);
			return new Promise(function(resolve, reject){
				APIClient.cheat({
					cmd: cmd.join(' '),
					success: function(res){
						var response = $(res)
						resolve(response);
					},
					error: function(msg){
						reject(JSON.stringify(msg));
					}
				});
			});
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
		endec: function(s, input){
			switch(s){
				case 'url':
					return decodeURI(input);
				case 'html':
					return decodeHtml(input);
			}
		},
		fpga: function(){
			return 'fpga programming interface';
		},
		help: function(){
			var args = [].slice.call(arguments);
			if(args.length<1){
				this.echo('Available commands:');
				var cmds = Object.keys(registry);
				for(var cmd in cmds){
					this.echo(cmds[cmd]);
				}
			}else{
				return 'Display help for {{0}}'.format(args[0]);
			}
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
		qr: function(url){
			return new Promise(function(resolve, reject){
				APIClient.qr({
					url: url,
					success: function(res){
						var response = $(res)
						resolve(response);
					},
					error: function(msg){
						reject(JSON.stringify(msg));
					}
				});
			});
		},
		test: function(){
			//this.echo('[[b;red;white]hello world]');
			//this.echo('[[@;;;;https://placekitten.com/300/300]]');
			var img = `[[@;;;;${png}]]`;
			console.log(img);
			this.echo(img);
			//this.echo('A\x08AB\x08BC\x08C');
			//this.echo('\x1b[31mHello\x1b[m, ANSI!');
			this.echo('blarg');
			return new Promise(function(resolve){
				resolve();
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
				APIClient.weather2({
					loc: location,
					success: function(res){
						var response = $(res);
						resolve(response);
					},
					error: function(msg){
						reject(JSON.stringify(msg));
					}
				});
			});
		},
		weather2: function(){
			var term = this;
			return new Promise(function(resolve, reject){
				APIClient.weatherTest({
					success: function(res){
						var response = res;
						var seq = response.split(/;/)
						var data = seq[3].split(/:/)[1];
						var png = `data:image/png;base64,${data}`;
						var img = `[[@;;;;${png}]]`;
						console.log(png);
						term.echo(img);
						resolve();
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
var png = 'data:image/png;base64,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'
