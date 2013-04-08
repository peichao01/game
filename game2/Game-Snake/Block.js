(function($,exports){
	var config = {
		height:10,
		width:10
	};
	
	var id = 0;
	
	var Block = $.inherit({
		__constructor: function (x, y, boardView){
			this.element = $('<div style="width:'+(config.width-2)+'px;height:'+(config.height-2)+'px;'+
					'border-width:1px;"></div>');
			this.id = id++;
			
			this.setPos(x, y);
			this.element.appendTo(boardView);
		},
		setPos: function(x, y){
			this.previousX = this.x;
			this.previousY = this.y;
			this.x = x;
			this.y = y;
			
			this.element.css({'left':x*config.width,'top':y*config.height});
		},
		getPos: function(){
			return {
				'previousX': this.previousX,
				'previousY': this.previousY,
				'x': this.x,
				'y': this.y
			}
		}
	},{
		getWidth: function(){
			return config.width;
		},
		getHeight: function(){
			return config.height;
		}
	});
	
	exports.Block = Block;
})(jQuery, window)