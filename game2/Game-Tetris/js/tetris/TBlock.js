(function($, _, exports){
	var Base = exports.Base;
	var c = exports.config;
	var b = c.block;
	
	var tmpl = '<div class="tblock"></div>';
	var colors = ['red','green','blue','purple','sky','yellow','olive'];
	
	var tetrisMoveHandler = function(direction){
		this.globalX = this.x + this.tetris.x;
		this.globalY = this.y + this.tetris.y;
	}
	
	var TBlock = $.inherit(Block, {
		__constructor: function(x, y, wrapEl, tetris){
			this.__base(x, y, wrapEl, tmpl);
			
			this.globalX = x + tetris.x;
			this.globalY = y + tetris.y;
			//console.log(x,tetris);
			//console.log(this.globalX, this.globalY);
			this.tetris = tetris;
			
			this.setX(x);
			this.setY(y);
			
			$.subscribe('tetris.move',$.proxy(tetrisMoveHandler, this));
			$.subscribe('map.tblock-go-destroy',$.proxy(this.destroy, this));
		},
		addColor: function(index){
			this.$el.addClass(colors[index]);
		},
		getTetris: function(){
			return this.tetris;
		},
		getSibling: function(direction){
			$.publish('tblock.sibling-check', {tblock: this, direction: direction});
			
			return this.sibling;
		},
		setX: function(x){
			this.__base(x);
			this.$el.css({left: x * b.width});
		},
		setY: function(y){
			this.__base(y);
			this.$el.css({top: y * b.height});
		},
		destroy: function(e){
			var tb = e.tblock;
			if(tb !== this) return;
			
			$.publish('tblock.destroy-start', this);
			this.$el.animate({opacity:0},$.proxy(function(){
				$.publish('tblock.destroy-finish', {tblock: this, rowNum: e.rowNum});
				this.$el.remove();
			},this));
			$.publish('tblock.destroy', this);
			delete this;
		}
	});
	
	exports.TBlock = TBlock;
	
})(jQuery, _, window);