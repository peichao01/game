(function($,exports){
	var game = {};
	var config = {
		colNum: 50,
		rowNum: 30,
		maxFoodNumAtOneTime: 3,
		failedMsg: '很遗憾，请再接再厉。',
		winMsg: '恭喜你通关了！'
	};
	var doc = exports.document;
	
	var snake;
	var clock;
	var info;
	var rate;
	var foods = [];
	
	var level = 10;
	
	game.init = function(colNum, rowNum){
	
		config.colNum = colNum || config.colNum;
		config.rowNum = rowNum || config.rowNum;
		config.blockWidth = Block.getWidth();
		config.blockHeight = Block.getHeight();
		
		config.maxFoodNumAtOneTime = 3;
	}
	
	$.subscribe('Snake.game-start', gamestartHandler);
	$.subscribe('Snake.game-over', gameoverHandler);
	$.subscribe('Snake.game-win', gameoverHandler);
	
	$.subscribe('Snake.play', playHandler);
	$.subscribe('Snake.pause', pauseHandler);
	
	$.subscribe('Snake.go-up', goupHandler);
	$.subscribe('Snake.go-right', gorightHandler);
	$.subscribe('Snake.go-down', godownHandler);
	$.subscribe('Snake.go-left', goleftHandler);
	
	$.subscribe('Snake.rate', rateHandler);
	$.subscribe('Snake.run', runHandler);
	
	$.subscribe('Snake.eat-food', eatfoodHandler);
	$.subscribe('Snake.upgrade', upgradeHandler);
	
	
	
	var gamePart;
	var infoPart;
	
	function gamestartHandler(){
		var c = config;
		$('body').empty().html('<div class="Snake clear"><h2>Snake</h2><div class="game-part" style="width:'+(c.colNum*c.blockWidth)+
			'px;height:'+(c.rowNum*c.blockHeight)+'px;"></div><div class="other"><div class="info-part"></div>'+'<div class="pause">暂停</div>'+
			'<div class="operations"><div class="up">'+
			'↑</div><div class="right">→</div><div class="down">↓</div><div class="left">←</div></div></div></div>');
			
		gamePart = $('.game-part');
		infoPart = $('.info-part');
		
		snake = new Snake(config.colNum, config.rowNum, gamePart);
		clock = new Clock(infoPart);
		info = new Information(infoPart, level);
		rate = new Rate(level);
		initFoods();
		bindGlobalEvent();
		
		clock.start();
		rate.start();
	}
	function gameoverHandler(info){
		$.publish('Snake.pause');
		unbindGlobalEvent();
		$('.Snake').css('opacity',0.5).after('<div><p>'+(info.msg==='game-win'?config.winMsg:config.failedMsg)+'</p><button id="again">Again</button></div>');
		
		console.log('Game Over');
	}
	function upgradeHandler(){
		console.log('upgrade');
	}
	
	function playHandler(){
		clock.start();
		rate.start();
		
		console.log('play');
	}
	function pauseHandler(){
		clock.pause();
		rate.pause();
		
		console.log('pause');
	}
	
	function rateHandler(){
		snake.run();
	
		//console.log('rate');
	}
	
	function runHandler(nextStepBlock){
		var n = nextStepBlock;
		if(!isInGamePanel(n.x, n.y) || isBody(n.x, n.y)){
			$.publish('Snake.game-over', {'msg':'game-over'});
		}else{ 
			var food = isFood(n.x, n.y);
			if(food){
				$.publish('Snake.eat-food', {
					'food': food
				});
			}
		}
		//console.log(nextStepBlock);
	}
	
	function goupHandler(){
		snake.setDirection('up');
		
		console.log('up');
	}
	function gorightHandler(){
		snake.setDirection('right');
		
		console.log('right');
	}
	function godownHandler(){
		snake.setDirection('down');
	
		console.log('down');
	}
	function goleftHandler(){
		snake.setDirection('left');
	
		console.log('left');
	}
	
	function eatfoodHandler(info){
		foods = _.filter(foods, function(food){
			return food.id !== info.food.id;
		});
		info.food.destroy();
		
		snake.addTail();
		
		addFood();
		//console.log('eatFood');
	}
	
	
	
	
	function initFoods(){
		addFood();
	}
	function bindGlobalEvent(){
		$('.pause').on('click',function(e){
			if($.trim($(this).text())==='暂停'){
				$.publish('Snake.pause');
				$(this).text('继续');
			}else if($.trim($(this).text())==='继续'){
				$.publish('Snake.play');
				$(this).text('暂停');
			}
		});
		
		$(doc).on('keydown',function(e){
			if(e.keyCode === 38){
				$.publish('Snake.go-up');
			}else if(e.keyCode === 39){
				$.publish('Snake.go-right');
			}else if(e.keyCode === 40){
				$.publish('Snake.go-down');
			}else if(e.keyCode === 37){
				$.publish('Snake.go-left');
			}
		});
	
		$('.operations').on('click',function(e){
			if($(e.target).hasClass('up')){
				$.publish('Snake.go-up');
			}else if($(e.target).hasClass('right')){
				$.publish('Snake.go-right');
			}else if($(e.target).hasClass('down')){
				$.publish('Snake.go-down');
			}else if($(e.target).hasClass('left')){
				$.publish('Snake.go-left');
			}
		});
	}
	function unbindGlobalEvent(){
		$('.pause').off('click');
		$(doc).off('keydown');
		$('.operations').off('click');
	}
	
	
	
	
	
	function addFood(){
		var food;
		var x = Math.floor(Math.random()*config.colNum);
		var y = Math.floor(Math.random()*config.rowNum);
		if(!isBody(x,y) && !isFood(x, y)){
			food = new Food(x, y, gamePart);
			foods.push(food);
			//console.log(food);
		}else{
			arguments.callee();
		}
		
	}
	function isInGamePanel(x, y){
		return x>=0 && x<config.colNum && y>=0 && y<config.rowNum;
	}
	function isBody(x, y){
		return !!snake.getBody(x, y);
	}
	function isFood(x, y){
		var _food;
		$.each(foods, function(index,food){
			if(food.x === x && food.y === y){
				_food = food;
				return false;
			}
		});
		return _food;
	}
	
	
	
	
	
	Function.prototype.getProto = function(object){
		for(var key in object){
			if(!this.prototype[key]){
				this.prototype[key] = object[key];
			}
		}
	}
	
	
	
	
	exports.game = game;
})(jQuery, window)