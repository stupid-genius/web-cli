'use strict'

var endpointRegistry = {
	anagrams: {
		url: 'https://stupid-genius.com/anagrams.cgi?{{word}}',
		method: 'get'
	},
	ipinfo: {
		url: 'https://ipinfo.io/{{ip}}',
		method: 'jsonp'
	},
	passgen: {
		url: 'https://stupid-genius.com/passgen.cgi',
		method: 'get'
	},
	qotd: {
		url: 'https://stupid-genius.com/qotd.cgi',
		method: 'get'
	},
	weather: {
		url: 'https://wttr.in/{{loc}}',
		method: 'get'
	}
};
