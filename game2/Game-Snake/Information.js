(function($,exports){
	var config = {
		score:{
			'1':10,
			'2':12,
			'3':14,
			'4':16,
			'5':18,
			'6':20,
			'7':23,
			'8':26,
			'9':30,
			'10':35
		},
		//超过分数则晋级
		maxScore:{
			'1':150,
			'2':350,
			'3':600,
			'4':900,
			'5':1250,
			'6':1650,
			'7':2100,
			'8':2600,
			'9':3150,
			'10':4000
		}
	}
	function Information(wraper, level){
		level = level || 1;
		this.eatNum = 0;
		this.element = $('<p>得分：<span class="score">' + (level === 1 ? 0 : config.maxScore[level-1]) + 
					'</span><br>等级：<span class="level">' + level + '</span></p>').appendTo(wraper);
		
		$.subscribe('Snake.eat-food', $.proxy(eatFoodHandler, this));
		$.subscribe('Snake.upgrade', $.proxy(upgradeHandler, this));
	}
	Information.prototype.getScore = function(){
		return parseInt(this.element.children('.score').text());
	}
	Information.prototype.setScore = function(score){
		this.element.children('.score').text(score);
		return this;
	}
	Information.prototype.getLevel = function(){
		return parseInt(this.element.children('.level').text());
	}
	Information.prototype.setLevel = function(level){
		this.element.children('.level').text(level);
		return this;
	}
	
	function eatFoodHandler(info){
		//this被代理为具体的单独的 实例对象
		var level = this.getLevel();
		var score = this.getScore() + config.score[level];
		this.setScore(score);
		
		if(score >= config.maxScore[level]){
			var nextLevel = parseInt(level) + 1;
			if(!config.maxScore[nextLevel]){
				$.publish('Snake.game-win', {'msg': 'game-win'});
			}else{
				$.publish('Snake.upgrade', {'level': nextLevel});
			}
		}
	}
	function upgradeHandler(info){
		//this被代理为具体的单独的 实例对象
		this.setLevel(info.level);
	}
	
	exports.Information = Information;
})(jQuery, window)