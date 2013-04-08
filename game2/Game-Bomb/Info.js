(function($, exports){
	var Info = {
		init: function(){
			this.clock = new Clock();
			this.counter = new Counter();
		}
	};
	
	
	
	function Clock(){
		this.element = $('<p>时间：<span>0</span></p>')[0];
		exports.wrapElem.appendChild(this.element);
		$.subscribe('Bomb.game-start',$.proxy(function(){
			this.start();
		},this));
	}
	Clock.prototype.start = function(){
		this.timeid = setTimeout($.proxy(function(){
			var second = parseInt($(this.element).children('span').text());
			$(this.element).children('span').text(++second);
			
			this.timeid = setTimeout($.proxy(arguments.callee,this),1000);
		},this),1000);
	}
	Clock.prototype.stop = function(){
		clearTimeout(this.timeid);
	}
	
	
	
	function Counter(){
		this.element = $('<p>剩余：<span>' + exports.Config.level[exports.level]['bomb'] + '</span></p>')[0];
		exports.wrapElem.appendChild(this.element);
		$.subscribe('Bomb.flag-add',$.proxy(function(){
			var count = this.getCount()
			this.setCount(++count);
		},this));
		$.subscribe('Bomb.flag-sub',$.proxy(function(){
			var count = this.getCount()
			this.setCount(--count);
		},this));
	}
	Counter.prototype.getCount = function(){
		return parseInt($(this.element).children('span').text());
	}
	Counter.prototype.setCount = function(count){
		$(this.element).children('span').text(count);
	}
	
	
	
	function Submit(gameInfo){
		var html = '<div id="submit-part"><h2>提交到服务器，与网友大比拼</h2><p>请输入您的姓名：<input type="text" name="username" /></p>'+
					'<p>共用时间：' + gameInfo.time + '</p><button id="submit">立即提交</button><button id="cancel">算了，下次再说</button></div>';
		this.element = $(html)[0];
		$('#submit').on('click',$.proxy(this.submit,this));
		$('#cancel').on('click',$.proxy(this.cancel,this));
	}
	Submit.prototype.submit = function(){
		//$.getJSON(exports.config
		console.log('submit to the server');
	}
	Submit.prototype.cancel = function(){
		$(this.element).remove();
	}
	
	
	
	
	exports.Info = Info;
})(jQuery, Scan)