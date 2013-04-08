(function ($, _, exports) {
	var doc = exports.document;
	var Base = exports.Base;
	var Map = exports.Map;
	
	var c = exports.config;
	var m = c.map;
	
	var tmpl = '<div class="main"></div>';
	
	var Main = $.inherit(Base, {
		
		__constructor: function(wrapEl){
			this.__base(tmpl, wrapEl);
			
			this.map = new Map(m.xNum, m.yNum, this.el);
			var clock = new Clock(this.el);
			var rate = new Rate(1);
			var score = new Score(this.el);
			
			
			clock.start();
			rate.start();
			
			$(doc).on('keydown',function(e){
				if(e.keyCode === 40){
					$.publish('keydown.move','down');
				}else if(e.keyCode === 38){
					$.publish('keydown.rotate','up');
				}else if(e.keyCode === 39){
					$.publish('keydown.move','right');
				}else if(e.keyCode === 37){
					$.publish('keydown.move','left');
				}
			});
			
			$.subscribe('game-over', $.proxy(gameOverHandler,this));
		}
	});
	
	function gameOverHandler(){
		console.log('game over');
	}
	
	exports.Main = Main;

})(jQuery, _, window);