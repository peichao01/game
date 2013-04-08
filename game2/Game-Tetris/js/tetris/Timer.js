(function($,exports){
	
	var Base = exports.Base;
	var c = exports.config;
	var r = c.rate;
	
	var tmpl = '<p>用时：<span>0 时 0 分 0 秒</span></p>';
	var level = 1;
	
	//1.Clock
	var intervalStart = function(){
		this.id = setTimeout($.proxy(function(){
			var justnow = this.get();
			this.set(justnow+1);
			
			$.publish('second');
			
			this.id = setTimeout($.proxy(arguments.callee,this),1000);
		},this),1000);
	}
	
	var Clock = $.inherit(Base, {
		__constructor: function(wrapEl){
			this.__base(tmpl, wrapEl);
			this.time = 0;
			
			this.set(this.time);
		},
		start: function(){
			$.publish('clock.start', {'time':this.get()});
			$.proxy(intervalStart, this)();
		},
		restart: function(){
			$.publish('clock.restart', {'time':this.get()});
			$.proxy(intervalStart, this)();
		},
		pause: function(){
			$.publish('clock.pause', {'time':this.get()});
			clearTimeout(this.id);
		},
		stop: function(){
			$.publish('clock.stop', {'time':this.get()});
			clearTimeout(this.id);
			this.set(0);
		},
		get: function(){
			//return parseInt(this.element.children('span').text());
			return this.time;
		},
		set: function(second){
			var h = Math.floor(second/60/60);
			var m = Math.floor((second - h*60*60) / 60);
			var s = second % 60;
			this.$el.children('span').text(h + ' 时 ' + m + ' 分 ' + s + ' 秒');
			this.time = second;
			return this;
		}
	});
	
	//2.固定频率发布事件(前进)	
	var Rate = $.inherit(Base, {
		__constructor: function(level){
			this.setLevel(level);
		},
		start: function(){
			this.id = setInterval($.proxy(function(){
				$.publish('rate.dida');
			},this),this.rate);
		},
		pause: function(){
			clearInterval(this.id);
		},
		stop: function(){
			clearInterval(this.id);
		},
		setLevel: function(_level){
			level = _level;
			this.rate = r[level];
		}
	});
	
	
	exports.Clock = Clock;
	exports.Rate = Rate;
	exports.getLevel = function(){
		return level;
	}
})(jQuery, window)