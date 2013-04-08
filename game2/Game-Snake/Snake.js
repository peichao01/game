(function($,exports){
	var config = {
		'length': 6,
		'direction':{
			'up':1,
			'right':2,
			'down':3,
			'left':4
		}
	}
	var gameBoard = {};
	
	function Snake(boardWidth, borderHeight, borderView){
		gameBoard.width = boardWidth;
		gameBoard.height = borderHeight;
		gameBoard.view = borderView;
	
		this.body = [];
		this.init();
		this.setDirection('right');
		
		//console.log(this.body);
	}
	
	Snake.prototype.init = function(){
		//默认初始化一条蛇
		for(var i=config.length-1;i>=0;i--){
			this.body.push(new Block(i, 0, gameBoard.view));
		}
	}
	Snake.prototype.run = function(){
		this.each(function(body, i, prevBody){
			if(prevBody){
				body.setPos(prevBody.previousX, prevBody.previousY);
			}else{
				var nextStep = this.getNextStep();
				
				$.publish('Snake.run', nextStep);
				
				body.setPos(nextStep.x, nextStep.y);
			}
		});
	}
	Snake.prototype.getNextStep = function(){
		var head = this.body[0];
		var x,y;
		if(this.direction==='up'){
			x = head.x; y = head.y - 1;
		}else if(this.direction==='right'){
			x = head.x + 1; y = head.y;
		}else if(this.direction==='down'){
			x = head.x; y = head.y + 1;
		}else if(this.direction==='left'){
			x = head.x - 1; y = head.y;
		}
		return {'x':x,'y':y};
	}
	Snake.prototype.setDirection = function(direction){
		var head = this.body[0];
		if(direction==='up'){
			this.direction = (!this.getBody(head.x, head.y - 1)) ? direction : this.direction;
		}else if(direction==='right'){
			this.direction = (!this.getBody(head.x + 1, head.y)) ? direction : this.direction;
		}else if(direction==='down'){
			this.direction = (!this.getBody(head.x, head.y + 1)) ? direction : this.direction;
		}else if(direction==='left'){
			this.direction = (!this.getBody(head.x - 1, head.y)) ? direction : this.direction;
		}
	}
	Snake.prototype.getDirection = function(){
		return this.direction;
	}
	Snake.prototype.getBody = function(x, y){
		var _body;
		this.each(function(body){
			if(body.x === x && body.y === y){
				_body = body;
				return false;
			}
		});
		return _body;
	}
	Snake.prototype.addTail = function(){
		var pre = _.last(this.body);
		var newTail = new Block(pre.x, pre.y, gameBoard.view);
		
		this.body.push(newTail);
	}
	Snake.prototype.each = function(fn){
		for(var i=0,l=this.body.length;i<l;i++){
			if(fn.call(this, this.body[i], i, this.body[i-1]) === false)
				break;
		}
	}
	
	exports.Snake = Snake;
})(jQuery, window)