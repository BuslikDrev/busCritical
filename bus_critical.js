// *   Аўтар: "БуслікДрэў" ( https://buslikdrev.by/ )
// *   © 2016-2022; BuslikDrev - Усе правы захаваныя.

var busCritical = {
	'setting':{
		'html_all':false,
		'html_elements':['font-face', 'keyframes', '*', '::after, ::before', ']']
	},
	'status':false,
	'start':function() {
		if (busCritical.status == false) {
			busCritical.status = true;
			window.removeEventListener('load', busCritical.start, {once:true, passive:true});
			window.removeEventListener('pagehide', busCritical.start, {once:true, passive:true});
			window.removeEventListener('scroll', busCritical.start, {once:true, passive:true});
			window.removeEventListener('mouseover', busCritical.start, {once:true, passive:true});
			window.removeEventListener('touchstart', busCritical.start, {once:true, passive:true});
		} else {
			console.log('bus_critical уже работает!');
			return 'bus_critical уже работает!';
		}

		if (typeof window.CustomEvent !== 'function') {
			window.CustomEvent = function(event, params) {
				params = params || {bubbles:false, cancelable:false, detail:null};

				var evt = document.createEvent('CustomEvent');
				evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

				return evt;
			};
		}

		var element = new CustomEvent('busCritical', {bubbles: true});
		document.dispatchEvent(element);
	},
	'ajax':function(url, setting) {
		if (typeof setting['metod'] === 'undefined') {
			setting['metod'] = 'GET';
		}
		if (typeof setting['responseType'] === 'undefined') {
			setting['responseType'] = 'json';
		}
		if (typeof setting['dataType'] === 'undefined') {
			setting['dataType'] = 'text';
		}
		if (typeof setting['data'] === 'undefined') {
			setting['data'] = '';
		}
		if (typeof setting['async'] === 'undefined') {
			setting['async'] = true;
		}
		if (typeof setting['user'] === 'undefined') {
			setting['user'] = null;
		}
		if (typeof setting['password'] === 'undefined') {
			setting['password'] = null;
		}
		if (typeof setting['success'] === 'undefined') {
			setting['success'] = function(json) {};
		}
		if (typeof setting['error'] === 'undefined') {
			setting['error'] = function(error) {};
		}
		if (typeof setting['debug'] === 'undefined') {
			setting['debug'] = false;
		}
		var datanew = null;
		if (setting['data']) {
			if (setting['dataType'] == 'json') {
				datanew = JSON.stringify(setting['data']);
			} else {
				if (typeof FormData !== 'undefined') {
					datanew = new FormData();
					if (typeof setting['data'] == 'object') {
						for (var i in setting['data']) {
							if (typeof setting['data'][i] == 'object') {
								for (var i2 in setting['data'][i]) {
									if (typeof setting['data'][i][i2] == 'object') {
										for (var i3 in setting['data'][i][i2]) {
											datanew.append(i + '[' + i2 + ']' + '[' + i3 + ']', setting['data'][i][i2][i3]);
										}
									} else {
										datanew.append(i + '[' + i2 + ']', setting['data'][i][i2]);
									}
								}
							} else {
								datanew.append(i, setting['data'][i]);
							}
						}
					} else {
						datanew = setting['data'];
					}
				} else {
					datanew = [];
					if (typeof setting['data'] == 'object') {
						for (var i in setting['data']) {
							if (typeof setting['data'][i] == 'object') {
								for (var i2 in setting['data'][i]) {
									if (typeof setting['data'][i][i2] == 'object') {
										for (var i3 in setting['data'][i][i2]) {
											datanew.push(encodeURIComponent(i) + '[' + encodeURIComponent(i2) + ']' + '[' + encodeURIComponent(i3) + ']=' + encodeURIComponent(setting['data'][i][i2][i3]));
										}
									} else {
										datanew.push(encodeURIComponent(i) + '[' + encodeURIComponent(i2) + ']=' + encodeURIComponent(setting['data'][i][i2]));
									}
								}
							} else {
								datanew.push(encodeURIComponent(i) + '=' + encodeURIComponent(setting['data'][i]));
							}
						}
					} else {
						datanew = setting['data'];
					}

					datanew = datanew.join('&').replace(/%20/g, '+');
				}
			}
		}

		var xhr = new XMLHttpRequest();
		xhr.open(setting['metod'], url, setting['async'], setting['user'], setting['password']);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		if (typeof FormData === 'undefined') {
			if (setting['dataType'] == 'json') {
				xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
			} else if (setting['dataType'] == 'text') {
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
			}
		}
		if (setting['responseType']) {
			xhr.responseType = setting['responseType']; //\"text\" – строка,\"arraybuffer\", \"blob\", \"document\", \"json\" – JSON (парсится автоматически).
		}
		if (setting['debug']) {
			console.log('xhr data: ', datanew);
		}
		xhr.send(datanew);
		xhr.onload = function(oEvent) {
			if (xhr.status == 200) {
				return setting['success'](xhr.response, xhr);
			} else {
				var ajaxOptions = setting;
				var thrownError = false;
				return setting['error'](xhr, ajaxOptions, thrownError);
			}
		};

		//return xhr;
	},
	'toUnicodeIcon':function(s, t) {
		if (typeof s != 'string') {
			s = this;
		}
		if (typeof t == 'undefined') {
			t = false;
		}
		var r = '';

		if (t) {
			for (var i = 0; i < s.length; i++) {
				r += s[i].charCodeAt(0).toString(16);
			};
		} else {
			for (var i = 0; i < s.length; i++) {
				r += s[i].charCodeAt(0);
			};
		}

		return '\\' + r;
	},
	'toUnicode':function(s) {
		if (typeof s != 'string') {
			s = this;
		}
		var r = '';

		for (var i = 0; i < s.length; i++) {
			r += '\\u' + s[i].charCodeAt(0).toString(16);
		};

		return r;
	},
	'html':function(element, setting, length) {
		if (typeof setting === 'undefined') {
			setting = {};
		}
		if (typeof setting['all'] === 'undefined') {
			setting['all'] = false;
		}
		var html = {};

		if (element.tagName) {
			html[element.tagName.toLowerCase()] = element.tagName.toLowerCase();
			if (element.id) {
				html['#' + element.id.toLowerCase()] = '#' + element.id.toLowerCase();
			}
			for (var i = 0; i < element.classList.length; i++) {
				html['.' + element.classList[i].toLowerCase()] = '.' + element.classList[i].toLowerCase();
			}
			if (element.children.length) {
				for (var i = 0; i < element.children.length; i++) {
					if (setting['all'] || element.children[i].tagName && element.children[i].offsetTop <= window.innerHeight) {
						var child = busCritical.html(element.children[i], setting);
						for (var i2 in child) {
							html[i2] = child[i2];
						}
					}
				}
			}
		}

		return html;
	},
	'css':function(file) {
		var s, sh, e, c, y, z;
		s = {length:0};
		sh = document.styleSheets;
		z = sh.length;
		for (var i = 0; i < z; i++) {
			if (typeof sh[i].cssRules == 'undefined') {
				sh[i].cssRules = sh[i].rules;
			}
			if (sh[i].cssRules != 'undefined') {
				y = sh[i].cssRules.length;
				for (var i2 = 0; i2 < y; i2++) {
					e = sh[i].cssRules[i2];
					if (e.type == 1 && e.style) {
						c = e.style.getPropertyValue('content');

						if (c && c.indexOf('url') == -1) {
							c = busCritical.toUnicodeIcon(c.replace(/^[\"]+|[\"]+$/g, ''), true);
						}

						if (c != '\\' && c.substring(0, 1) == '\\') {
							/* fix */
							s[s.length++] = e.cssText.replace(/\bcontent: \"(.[^\"]*?)\"/, 'content: "' + c + '"') + '\r\n';
							/* fix */
						} else {
							s[s.length++] = e.cssText + '\r\n';
						}
					} else if (e.type == 4 && e.cssRules) {
						if (e.cssText.indexOf('.') != -1) {
							s[s.length++] = e.cssText + '\r\n';
						}
					} else {
						s[s.length++] = e.cssText + '\r\n';
					}
				}
			}
		}

		return s;
	},
	'critical':function(search) {
		var critical = '';
		var element = document.querySelector(search);

		if (element) {
			// авто - tag, class, id
			var auto = busCritical.html(element, {'all':true});
			// ручное - tag, class, id
			var manual = ['font-face', 'keyframes', '*', '::after, ::before', ']'];

			for (var i in manual) {
				auto[manual[i]] = manual[i];
			}

			// все стили
			var styles = busCritical.css();

			//console.log(styles);
			//console.log(auto);
			//console.log(1 + ' ', critical);

			var x, y, z;
			z = styles.length;
			for (var i = 0; i < z; i++) {
				search = false;
				x = styles[i];

				for (var i2 in auto) {
					y = auto[i2];
					if (x.indexOf(y + ',') != -1 || x.indexOf(y + ':') != -1 || x.indexOf(y + ' ') != -1) {
						search = true;
					}
				}

				if (search) {
					critical += styles[i];
				}
			}

			//console.log(2 + ' ', critical);
		}

		return critical;
	}
};

if (document.readyState == 'loading') {
	window.addEventListener('load', busCritical.start, {once:true, passive:true});
}
if (document.readyState == 'interactive') {
	window.addEventListener('load', busCritical.start, {once:true, passive:true});
}
if (document.readyState == 'complete') {
	window.addEventListener('pagehide', busCritical.start, {once:true, passive:true});
	window.addEventListener('scroll', busCritical.start, {once:true, passive:true});
	window.addEventListener('mouseover', busCritical.start, {once:true, passive:true});
	window.addEventListener('touchstart', busCritical.start, {once:true, passive:true});
}
