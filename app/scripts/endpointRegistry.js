'use strict'

var endpointRegistry = {
	anagrams: {
		url: 'https://stupid-genius.com/anagrams.cgi?{{word}}',
		method: 'get'
	},
	btc: {
		url: 'https://rate.sx/{{cmd}}',
		method: 'get'
	},
	cheat: {
		url: 'https://cheat.sh/{{cmd}}',
		method: 'get',
		headers: {
			'Cache-Control': 'no-cache'
		}
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
	qr: {
		url: 'https://qrenco.de/{{url}}',
		method: 'get'
	},
	weather: {
		url: 'https://wttr.in/{{loc}}',
		method: 'get'
	},
	weather2: {
		url: 'https://v2.wttr.in/{{loc}}',
		method: 'get'
	}
};
