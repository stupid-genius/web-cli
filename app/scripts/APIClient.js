'use strict';
/*
    This constructor is intended to create a client that is bound to a set
    of HTTP endpoints
*/
function APIClient(registry){
    if(!(this instanceof APIClient)){
        return new APIClient(registry);
    }

    this.get = (function(container){
        return function(entry, config){
            $.ajax({
                url: container.interpolate(entry.url, config),
                method: 'get',
                headers: entry.headers?container.interpolate(entry.headers, config):undefined,
                success: config.success,
                error: config.error
            });
        };
    })(this);
    this.post = (function(container){
        return function(entry, config){
			var settings = {};
			if(config.ext){
				var ext = config.ext;
				delete config.ext;
				$.extend(settings, ext);
			}
			$.extend(settings, {
				url: container.interpolate(entry.url, config),
				method: 'post',
				headers: entry.headers?container.interpolate(entry.headers, config):undefined,
				/*contentType: false,
				processData: false,*/
				success: config.success,
				error: config.error
			});
			if(entry.body){
				if(settings.headers && settings.headers['Content-Type'] === 'application/x-www-form-urlencoded'){
					settings.data = $.param(container.interpolate(entry.body, config));
				}
				else{
					settings.data = JSON.stringify(container.interpolate(entry.body, config));
				}
			}
            $.ajax(settings);
        };
    })(this);
    this.put = (function(container){
        return function(entry, config){
            $.ajax({
                url: container.interpolate(entry.url, config),
                method: 'put',
                headers: entry.headers,
                success: config.success,
                error: config.error
            });
        };
    })(this);
    this._delete = (function(container){
        return function(entry, config){
            $.ajax({
                url: container.interpolate(entry.url, config),
                method: 'delete',
                headers: entry.headers,
                success: config.success,
                error: config.error
            });
        };
    })(this);
    this.custom = (function(container){
		return function(entry, config){
			var merged = $.extend(true, {}, entry, config.ajaxConfig);
			merged.url = container.interpolate(entry.url, config);
			$.ajax(merged);
		};
	})(this);
    this.xhr = (function(container){
        return function(entry, config){
            var req = new XMLHttpRequest();
            req.open(config.method, container.interpolate(entry.url, config));
			req.responseType = 'arraybuffer';
			req.onload = function(){
				config.success(req.response);
			};
			req.send();
        };
    })(this);

	this.interpolate = function interpolator(template, model){
        if(template instanceof Object){
            var interpolated;
            if(template instanceof Array){
                interpolated = [];
            }
            else{
                interpolated = {};
            }
            for(var o in template){
                interpolated[o] = interpolator(template[o], model);
            }
            return interpolated;
        }
        else{
            return template.replace(/\{\{(.+?)\}\}/g, function(match, br){
                return model[br] || '';
            });
        }
	};

    var client = {};

    for(var key in registry){
		Object.defineProperty(client, key, {
			value: (function(container, entry){
				return function(config){
					container[entry.method].call(client, entry, config||{});
				};
			})(this, registry[key]),
			enumerable: true
		});
    }

    return client;
}
