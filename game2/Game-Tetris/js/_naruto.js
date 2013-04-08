//模块加载机制...失败，无法保证同步，加载始终异步...
//用法：
//define('tetris.Next', function (require, exports) {
//	var Tetris = require('tetris.Tetris');

//	function Next (){
//	}

//	exports.create = function (props) {
//		return new Next(props);
//	}
//	exports.Next = Next;
//});

(function (exports) {
	var global = {},
        loaded = {},
        doc = exports.document,
        config = {
        	base: 'js/'
        };


	(function (exports) {
		var utils = (exports.utils = {});

		function parsePath(path) {
			return path.split('.');
		}

		function each(obj, fn) {
			if (obj.each) {
				return fn.each(fn);
			}
			if (typeof obj === 'object') {
				if (obj.length) {
					for (var i = 0, l = obj.length; i < l; i++) {
						fn.call(obj, obj[i], i);
					}
				} else {
					for (var key in obj) {
						fn.call(obj, obj[key], key);
					}
				}
			}
		}

		function loadJS(url, onload) {
			var script = doc.createElement('script');
			script.src = url;
			script.onload = onload;
			doc.head.appendChild(script);
		}

		utils.parsePath = parsePath;
		utils.each = each;
		utils.loadJS = loadJS;
	})(global);







	(function (exp) {
		var utils = exp.utils;

		function require(path) {
			var rel = '',
        		requireObject;
			try {
				requireObject = eval('loaded.' + path);
				if (requireObject === undefined) throw new Error('the JS file was not loaded.');
			} catch (err) {
				path = utils.parsePath(path);
				utils.each(path, function (ns, i) {
					rel += '.' + ns;
					if (!eval('loaded' + rel)) {
						eval('loaded' + rel + '={}');
						if (i === this.length - 1) {
							utils.loadJS(config.base + path.join('/') + '.js', function () {
								requireObject = eval('loaded' + rel + '={}');
							});
						}
					}
				});
			}
			return eval('loaded' + rel);
		}

		//require('tetris.Tetris');
		//console.log(loaded);



		function define(name, fn) {
			var exp = eval('loaded.' + name) || eval('loaded.' + name + '={}');
			fn.call(global, require, exp);
		}

		exp.require = require;
		exp.define = define;
	})(global);



	exports.global = {};
	exports.require = global.require;
	exports.define = global.define;
})(window);