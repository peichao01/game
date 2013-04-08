(function($,exports){
	
	//1.Clock
	function Clock(wraper){
		this.element = $('<p>用时：<span>0</span></p>').appendTo(wraper);
		this.id;
	}
	Clock.prototype.start = function(){
		$.publish('Snake.clock-start', {'time':this.get()});
		this.id = setTimeout($.proxy(function(){
			var justnow = this.get();
			this.set(justnow+1);
			
			$.publish('Snake.second');
			
			this.id = setTimeout($.proxy(arguments.callee,this),1000);
		},this),1000);
	}
	Clock.prototype.pause = function(){
		$.publish('Snake.clock-pause', {'time':this.get()});
		clearTimeout(this.id);
	}
	Clock.prototype.stop = function(){
		$.publish('Snake.clock-stop', {'time':this.get()});
		clearTimeout(this.id);
		this.set(0);
	}
	Clock.prototype.get = function(){
		return parseInt(this.element.children('span').text());
	}
	Clock.prototype.set = function(second){
		this.element.children('span').text(second);
		return this;
	}
	
	//2.固定频率发布事件(前进)
	var rateConfig = {
		level:{
			'1':200,
			'2':180,
			'3':160,
			'4':140,
			'5':120,
			'6':100,
			'7':80,
			'8':60,
			'9':50,
			'10':40
		}
	}
	function Rate(level){
		this.setLevel(level);
		this.id;
	}
	Rate.prototype.start = function(){
		this.id = setInterval($.proxy(function(){
			$.publish('Snake.rate');
		},this),this.rate);
		/*this.id = setTimeout($.proxy(function(){
			$.publish('Snake.rate');
			this.id = setTimeout($.proxy(arguments.callee,this),this.rate);
		},this),this.rate);*/
	}
	Rate.prototype.pause = function(){
		//clearTimeout(this.id);
		clearInterval(this.id);
	}
	Rate.prototype.stop = function(){
		clearInterval(this.id);
	}
	Rate.prototype.setLevel = function(level){
		this.rate = rateConfig['level'][level];
	}
	
	//function 
	
	
	exports.Clock = Clock;
	exports.Rate = Rate;
})(jQuery, window)