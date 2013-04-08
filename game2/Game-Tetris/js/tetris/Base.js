(function ($, _, exports) {

	var Base = $.inherit({
		__constructor: function(tmpl, wrapEl, json){
			this.$el = $(_.template(tmpl, json||{}));
			this.el = this.$el.get(0);
			
			if(wrapEl) this.appendTo(wrapEl);
		},
		appendTo: function(wrapEl){
			this.$el.appendTo(wrapEl);
			return this;
		}
	});
	
	exports.Base = Base;

})(jQuery, _, window);