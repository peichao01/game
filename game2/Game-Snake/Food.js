(function($,exports){
	var config = {
		defaultColor: '#00b200'
	}
	
	var Food = $.inherit(Block, {
		__constructor: function (x, y, boardView, color){
			this.__base(x, y, boardView);
			this.setColor(color);
		},
		setColor: function(color){
			this.element.css('background-color', color|| config.defaultColor);
		},
		destroy: function(){
			this.element.remove();
			delete this;
		}
	});
	
	exports.Food = Food;
})(jQuery, window)