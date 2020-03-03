$(function() {
	$('body').terminal(function(input, terminal){
		terminal.echo('Begin core dump');
		var prng = uheprng();
		var dump = '';
		for(var i=0;i<5000;++i){
			dump+=prng(1000);
		}
		terminal.echo(dump);
	},{
		prompt: '>',
		greetings: 'Stupid Genius Software\nThis site under construction.  Please visit: https://apps.stupid-genius.com'
	});
});
