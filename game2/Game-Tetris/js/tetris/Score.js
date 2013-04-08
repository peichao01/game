(function($,exports){
	
	var Base = exports.Base;
	var c = exports.config;
	var s = c.score;
	
	var tmpl = '<p class="score">得分：<span>0</span></p>';
	var fxTmpl = '<div class="fx-score">+ <b><%= addScore %></b></div>';
	
	var Score = $.inherit(Base, {
		__constructor: function(wrapEl){
			this.__base(tmpl, wrapEl);
			this.set(0);
			
			$.subscribe('map.add-score', $.proxy(this.add,this));
		},
		get: function(){
			return this.score;
		},
		add: function(e){
			var destroy_rows = e.destroy_rows;
			var wrapEl = e.wrapEl;
			
			var level = exports.getLevel();
			var score = s[level][destroy_rows] * destroy_rows;
			console.log(score);
			
			this.set(this.get() + score);
			
			var fxS = $(_.template(fxTmpl, {addScore: score}));
			fxS.appendTo(wrapEl).animate({
				top: -20,
				opacity: 0
			},1500);
		},
		set: function(score){
			this.score = score;
			this.$el.children('span').text(score);
		}
	});
	
	exports.Score = Score;
})(jQuery, window)