function StringScanner(a){if(void 0===a||"string"!=typeof a)throw"Illegal argument";var b,c={},d=0;this.addToken=function(a,b){if(void 0!==c[a])throw"Token already added.";c[a]=b},this.hasNext=function(){b=null;var a=!1,d=Object.keys(c);for(var e in d)if(!/^&/.test(d[e])&&this.hasNextExp(c[d[e]])){b=d[e],a=!0;break}if(!a)for(var e in d)if(/^&/.test(d[e])&&this.hasNextExp(c[d[e]])){b=d[e],a=!0;break}return a},this.hasNextPat=function(a){return this.hasNextExp(c[a])},this.hasNextExp=function(b){var c=!1,e=new RegExp("^"+b);return d<a.length&&e.test(a.substring(d))&&(c=!0),c},this.peek=function(){var e=new RegExp("^"+c[b]);return a.substring(d).match(e)[0]},this.next=function(){return this.nextExp(c[b])},this.nextPat=function(a){return this.nextExp(c[a])},this.nextExp=function(){var b=this.peek();return d+=b.length,/^\s+/.test(a.substring(d))&&(d+=a.substring(d).match(/^\s+/)[0].length),b},Object.defineProperties(this,{curToken:{get:this.peek}}),this.toJSON=function(){return c}}function jsci(a){function b(a,b){var c=!1;if(console.log("matching: {{0}}, token: {{1}}, def: {{2}}".format(a,b,l[b])),a.match(new RegExp(l[b]))&&(console.log("{{0}} matches {{1}}".format(l[b],a)),c=!0,"$"===b.charAt(0)))for(var d in m)if(a.match(new RegExp("^"+m[d]+"$"))){console.log("{{0}} is reserved: {{1}}".format(a,m[d])),c=!1;break}return c}function c(a){var b=!1;for(var c in k)if(k[c]===a){console.log("{{0}} is non-terminal".format(a)),b=!0;break}return b}function d(a){var b=!1,c=Object.keys(l);for(var d in c)if(null!==a.match(new RegExp(l[c[d]]))){console.log("{{0}} is terminal".format(a)),b=!0;break}return b}function e(a,c){var d,e,h=j[a];console.log("choices for {{0}}: {{1}}".format(a,JSON.stringify(h)));for(var i in h){try{var k=f(h[i].rule);console.log("first tokens: {{0}}".format(k));for(var l in k)if("&"===k[l]&&(e=h[i]),b(c,k[l])){console.log("{{0}} matched {{1}}".format(k[l],c)),d=h[i];break}}catch(m){console.error(m)}if(d)break;var n=g(a);console.log("follow tokens: {{0}}".format(n));for(var l in n)if("&"===n[l]&&(e=h[i]),b(c,n[l])){d=h[i];break}}return d||(d=e),d}function f(a){var b=[],e=a[0];if(c(e)){var g=j[e];for(var h in g){for(var i,k=0;k<g[h].rule.length&&(i=f(g[h].rule.slice(k)),"&"===i[0]);++k);for(var k in i)b.push(i[k])}}else{if(!d(e))throw'First("{{0}}") contains an unknown symbol.'.format(a);b.push(e)}return b}function g(a){var b=[];if(a===i)b.push(n);else for(var c in k){var d=j[k[c]];for(var e in d)for(var h=0;h<d[e].rule.length-1;++h)if(d[e].rule[h]===a){var l=f(d[e].rule.slice(h+1));0===l.length&&(l=g(k[c]));for(var m in l)b.push(l[m]);break}}return b}var h=JSON.parse(a,function(a,b){return"semantics"===a?new Function("stack",b):b}),i=h.start,j=h.productions,k=Object.keys(j),l=h.tokens,m=Object.keys(l).filter(function(a){return"$"!==a.charAt(0)}).map(function(a){return l[a]}),n="$";this.parse=function(a){console.log(a);var f,g=new StringScanner(a),h=[],j=[],k=Object.keys(l);for(var m in k)g.addToken(k[m],l[k[m]]);for(console.log(JSON.stringify(g,null,"	")),h.push(i);g.hasNext();){console.log("[|||] stack: {{0}}; curToken: {{1}}".format(h,g.curToken));var o=h.pop();if("&"!==o)if(c(o)){var p=e(o,g.curToken);if(void 0===p)throw"Parse error: no rule for {{0}} that produces {{1}}".format(o,g.curToken);for(var q=p.rule.length-1;q>=0;--q)h.push(p.rule[q]);j.push(p.semantics),console.log("found production for non-terminal {{0}} -> {{1}}".format(o,p.rule))}else{if(!d(o)||!b(g.curToken,l[o]))throw"Parse error: syntax error near {{0}}".format(o);console.log("consuming terminal {{0}}".format(g.curToken)),j.push(g.curToken),g.next()}else console.log("epsilon")}for(;h.length>0;){var o=h.pop();if("&"!==o){if(!c(o))break;var p=e(o,n);if(void 0===p)throw"Parse error: no rule for {{0}}".format(o);for(var q=p.rule.length-1;q>=0;--q)h.push(p.rule[q]);j.push(p.semantics)}}if(0!==h.length)throw"Syntax error";var r=j.shift();return f=r(j)},this.toString=function(){var a="Start: {{0}}\n".format(i);return a+="Reserved:\n"+m.map(function(a){return"	{{0}}\n".format(a)}).join(""),a+=Object.keys(l).reduce(function(a,b){return a+"	{{0}}: {{1}}\n".format(b,l[b])},"Terminals:\n"),a+=Object.keys(k).reduce(function(a,b){return a+"	{{0}}: {{1}}\n".format(b,k[b])},"Non-terminals:\n"),a+=Object.keys(j).reduce(function(a,b){return j[b].reduce(function(a,c){return a+"	{{0}} -> {{1}}\n".format(b,JSON.stringify(c,function(a,b){return"semantics"===a?b.toString():b}))},a)},"Productions:\n")}}function APIClient(a,b){if(!(this instanceof APIClient))return new APIClient(a,b);this.get=function(a){return function(b,c){$.ajax({url:a.interpolate(b.url,c),method:"get",headers:b.headers?a.interpolate(b.headers,c):void 0,success:c.success,error:c.error})}}(this),this.post=function(a){return function(b,c){var d={};if(c.ext){var e=c.ext;delete c.ext,$.extend(d,e)}$.extend(d,{url:a.interpolate(b.url,c),method:"post",headers:b.headers?a.interpolate(b.headers,c):void 0,success:c.success,error:c.error}),b.body&&(d.data=d.headers&&"application/x-www-form-urlencoded"===d.headers["Content-Type"]?$.param(a.interpolate(b.body,c)):JSON.stringify(a.interpolate(b.body,c))),$.ajax(d)}}(this),this.put=function(a){return function(b,c){$.ajax({url:a.interpolate(b.url,c),method:"put",headers:b.headers,success:c.success,error:c.error})}}(this),this._delete=function(a){return function(b,c){$.ajax({url:a.interpolate(b.url,c),method:"delete",headers:b.headers,success:c.success,error:c.error})}}(this),this.custom=function(a){return function(b,c){var d=$.extend(!0,{},b,c.ajaxConfig);d.url=a.interpolate(b.url,c),$.ajax(d)}}(this),this.xhr=function(a){return function(b,c){var d=new XMLHttpRequest;d.open(c.method,a.interpolate(b.url,c)),d.responseType="arraybuffer",d.onload=function(){c.success(d.response)},d.send()}}(this),this.interpolate=function e(a,b){if(a instanceof Object){var c;c=a instanceof Array?[]:{};for(var d in a)c[d]=e(a[d],b);return c}return a.replace(/\{\{(.+?)\}\}/g,function(a,c){return b[c]||""})};var c={};for(var d in a)Object.defineProperty(c,d,{value:function(a,b){return function(d){a[b.method].call(c,b,d||{})}}(this,a[d]),enumerable:!0});return c}function DocumentService(a,b){void 0===localStorage[a]&&(localStorage[a]="");var c=this;this.create=function(b,c){if(void 0!==localStorage[b])throw'Can\'t create doc; "{0}" already exists'.format(b);localStorage[b]=c,localStorage[a]+=";"+b},this.read=function(a){var c=localStorage[a];if(void 0===c){var d=b.get(a);return void 0===d?'Document "{{0}}" not found'.format(a):d}return c},this.update=function(a,b){void 0===localStorage[a]?c.create(a,b):localStorage[a]=b},this["delete"]=function(a){delete localStorage[a]},this.find=function(){},this.search=function(){}}function FileSystem(a){a.install(window),a.configure({fs:"LocalStorage"},function(a){if(a)throw a})}function Executor(a,b){return this.exec=function(c,d){var e=c.trim().split(/\s+/),f=/^\.\/(.+)/,g=e[0];if(f.test(g)){var h=g.replace(f,"$1");g=new Function(b.read(h))}else g=a[g];if("function"!=typeof g)return e[0]+": no such command";var i=g.apply(d,e.slice(1));return i instanceof Promise?i:void d.echo(i instanceof Object?JSON.stringify(i,null,1):i)},this}var endpointRegistry={anagrams:{url:"https://stupid-genius.com/cgi-bin/anagrams.cgi",method:"get"},ipinfo:{url:"https://ipinfo.io/{{ip}}",method:"get"},passgen:{url:"https://stupid-genius.com/cgi-bin/passgen.cgi",method:"get"},weather:{url:"https://wttr.in/{{loc}}",method:"get"}},commandRegistry=function(a,b,c){var d={anagram:function(){return new Promise(function(b){a.anagrams({success:function(a){b(a)},error:function(a){b(a)}})})},api:function(){return this.echo(JSON.stringify(a)),"API Client - load registry from DocumentService"},cas:function(){var a=Algebrite;return this.push([{exit:function(){this.echo("exiting"),this.pop()}},function(b){this.echo(a.run(b))}],{name:"jscas",prompt:"cas> ",keymap:{"CTRL+C":function(){this.echo("exiting"),this.pop()}}}),""},cat:function(){if(arguments.length<1)return"usage: cat <filename>";var a=b.read(arguments[0]);return a},date:function(){return Date()},dm42:function(){return"DM42 editor"},endec:function(){return"encode/decode ascii, base64, hex, keyboard/scan, phone number, png, url"},help:function(){this.echo("Available commands:");var a=Object.keys(d);for(var b in a)this.echo(a[b]);return""},hot:function(){return"Hands On Table (reads from DocumentService)"},ip:function(b){return new Promise(function(c){a.ipinfo({ip:b,success:function(a){c(a)}})})},js:function(){return this.push([d,function(a){try{var b=window.eval(a);void 0!==b&&this.echo(new String(b))}catch(c){this.error(new String(c))}}],{name:"js",prompt:"js> ",greeting:"FYI: this doesn't really work well",keymap:{"CTRL+C":function(){this.echo("exiting"),this.pop()}}}),""},jsci:function(){for(var a=[].slice.call(arguments),c=/^\-(\w+).*/,d=0;c.test(a[d]);){var e=a[d++].replace(c,"$1");switch(e){case"h":case"-help":return"usage: jsci [-o <output file>][-r][-l] <grammar> <source>";case"o":a.outputFile=a[d++];break;case"r":case"-run":a.immediate=!0;break;case"l":case"-ls":a.listing=!0;break;default:return"unrecognized switch"}}var f=a[d++],g=a[d++];try{var h=b.read(f),i=new jsci(h);a.listing&&this.echo(i.toString());var j=b.read(g),k=i.parse(j)+'return "";';if(a.outputFile&&b.update(a.outputFile,k),a.immediate){var l=new Function(k);this.push(function(a,b){b.echo(l.call(b,a)),b.pop()}),this.exec("",!0)}return k}catch(m){return console.error("jsci: ",m),"jsci error"}},json:function(){return"JSON editor, formatter, validator"},login:function(){return"built-in login"},lookup:function(){return"generate lookup tables for ASCII, Unicode"},ls:function(){return(localStorage["DocumentService:/"]+c).split(/;/).filter(function(a){return""!==a})},md:function(){return"MarkDown viewer (reads from DocumentService)"},passgen:function(){return new Promise(function(b){a.passgen({success:function(a){b(a)}})})},prng:function(a){return uheprng()(a)},tex:function(){return"TeX viewer (reads from DocumentService)"},url:function(){return"URL shortener"},vim:function(){var a=[].slice.call(arguments).join(" ");return this.mode("editor",a),""},weather:function(b){return new Promise(function(c,d){a.weather({loc:b,success:function(a){var b=$(a);c(b)},error:function(a){d(JSON.stringify(a))}})})}};return d},servicesModule=angular.module("ServicesModule",[]);servicesModule.config(["$sceDelegateProvider",function(a){var b=a.resourceUrlWhitelist();for(var c in endpointRegistry)b.push(endpointRegistry[c].url.replace(/\{\{(.+?)\}\}/g,"**"));a.resourceUrlWhitelist(b)}]),servicesModule.value("DocumentRoot","DocumentService:/"),servicesModule.value("BuiltinDocuments",";grammar.tiny;example.tiny;readme.md"),servicesModule.service("FileService",["FileSystem",function(){this.get=function(a){return $.ajax({url:"/files/"+a,async:!1}).responseText}}]),servicesModule.service("DocumentService",["DocumentRoot","FileService",DocumentService]),servicesModule.value("BrowserFS",BrowserFS),servicesModule.service("FileSystem",["BrowserFS",FileSystem]),servicesModule.value("EndpointRegistry",endpointRegistry),servicesModule.factory("APIClient",["EndpointRegistry","$http","$sceDelegate",APIClient]);var terminalModule=angular.module("TerminalModule",["ServicesModule"]);terminalModule.controller("ConsoleController",["$scope","ExecutorService","DocumentService",function(a,b,c){function d(a,b){a.openNotification('<span style="color: red">'+b+"</span>",{bottom:!0,duration:4999})}var e=$("#terminal"),f={prompt:"> ",name:"terminal",greetings:"Stupid Genius Software",checkArity:!1};e.terminal=e.terminal(b.exec,f),e.terminal.focus(!0),e.terminal.stdout=e.terminal.echo,e.terminal.stdin=window.prompt,e.terminal.mode=function(b){var d=[].slice.call(arguments,1);a.$apply(function(){var f=e.terminal;switch(a.mode=b,a.mode){case"editor":f.pause();var h="";if(void 0!==d[0]&&""!==d[0])try{h=c.read(d)}catch(i){return f.resume(),delete a.mode,void f.echo(i)}g.setSession(ace.createEditSession(h)),g.getSession().setUseWrapMode(!0);default:f.resume()}})};var g=ace.edit("aceEditor");g.setTheme("ace/theme/terminal"),g.setKeyboardHandler("ace/keyboard/vim"),ace.config.loadModule("ace/keyboard/vim",function(a){var b=a.CodeMirror.Vim;b.defineEx("ls","ls",function(a){d(a,"list")}),b.defineEx("write","w",function(a,b){if(void 0===b.args)return void d(a,"usage: <path>");var e=g.getValue();c.update(b.args,e),d(a,"saved")}),b.defineEx("open","o",function(a){d(a,"open")}),b.defineEx("quit","q",function(){g.setSession(),e.terminal.mode()})})}]),terminalModule.service("ExecutorService",["commandRegistry","DocumentService",Executor]),terminalModule.factory("commandRegistry",["APIClient","DocumentService","BuiltinDocuments",commandRegistry]),String.prototype.format||(String.prototype.format=function(){var a=arguments;return this.replace(/{{(\d+)}}/g,function(b,c){return a[c]||""})});