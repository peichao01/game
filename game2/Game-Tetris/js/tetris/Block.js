(function($, _, exports){
	var Base = exports.Base;
	
	var _tmpl = '<div class="block" data-x="<%= x %>" data-y="<%= y %>"></div>';
	
	var id = 0;
	
	var Block = $.inherit(Base, {
		__constructor: function(x, y, wrapEl, tmpl){
			this.__base(tmpl||_tmpl, wrapEl, {x: x, y: y});
			
			this.x = x;
			this.y = y;
			this.id = id++;
		},
		getX: function(){
			return this.x;
		},
		getY: function(){
			return this.y;
		},
		setX: function(x){
			this.x = x;
		},
		setY: function(y){
			this.y = y;
		},
		getXY: function(){
			return { x: this.getX(), y: this.getY() };
		},
		setXY: function(x, y){
			this.setX(x);
			this.setY(y);
		}
	});
	
	exports.Block = Block;
	
})(jQuery, _, window);