'use strict'

var endpointRegistry = {
	anagrams: {
		url: 'https://stupid-genius.com/cgi-bin/anagrams.cgi',
		method: 'get'
	},
	ipinfo: {
		url: 'https://ipinfo.io/{{ip}}',
		method: 'get'
	},
	passgen: {
		url: 'https://stupid-genius.com/cgi-bin/passgen.cgi',
		method: 'get'
	},
	weather: {
		url: 'https://wttr.in/{{loc}}',
		method: 'get'
	}
};
