(function($,exports){
	var Scan = {
		gameStart: false,
		gameOver: false,
		init: function(level, wrapElem){
			wait('Bomb','Grid','Info','Resource','Config',$.proxy(function(){
				this.level = level;
				this.wrapElem = wrapElem;
				
				this.grid = this.Grid.create(level);
				this.grid.appendTo(wrapElem);
				
				this.Info.init();
				
				$.subscribe('Bomb.left-click',$.proxy(bombclickHandler, this));
				$.subscribe('Bomb.failed', $.proxy(gamefailed,this));
				$.subscribe('Bomb.win', $.proxy(gamewin,this));
			},this));
		}
	};
	
	function bombclickHandler(){
		if(!this.gameStart){
			this.gameStart = true;
			$.publish('Bomb.game-start');
		}
	}
	function gamefailed(){
		this.grid.gamefailed();
		this.Info.clock.stop();
		$(this.wrapElem).append('<p>很遗憾，你被炸碎了...<button id="again">再玩一次</button></p>');
	}
	function gamewin(){
		this.grid.gamewin();
		this.Info.clock.stop();
		$(this.wrapElem).append('<p>恭喜！！你赢了~~<button id="again">再玩一次</button></p>');
	}
	
	exports.Scan = Scan;
})(jQuery, window);