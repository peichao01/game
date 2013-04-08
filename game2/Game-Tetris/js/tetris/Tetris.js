(function($, _, exports){
	var TBlock = exports.TBlock;
	var c = exports.config;
	var b = c.block;
	var m = c.map;
	
	var tmpl = '<div class="tetris"></div>';
	
	var kinds = [
		[[1,1],[1,1]],
		[[1,0,0],[1,1,0],[0,1,0]],
		[[0,1,0],[1,1,0],[1,0,0]],
		[[1,1,0],[1,0,0],[1,0,0]],
		[[1,1,0],[0,1,0],[0,1,0]],
		[[0,1,0],[1,1,1],[0,0,0]],
		[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
	];
	
	var generate = function(index){
		_.each(this.kind, $.proxy(function(row, y){
			this.blocks[y] = [];
			_.each(row, $.proxy(function(block, x){
				if(block===1){
					var tb = new TBlock(x, y, this.el, this);
					tb.addColor(index);
					this.blocks[y][x] = tb;
					$.publish('tetris.add-tblock', tb);
				}else{
					this.blocks[y][x] = false;
				}
			},this));
		},this));
	}
	
	var keyDownHandler = function(direction){
		//this.downkeyIsDown = true;
		if(!this.shouldStop){
			if(direction === 'up'){
				this.rotate();
			}else{
				this.move(direction);
			}
		}
	}
	
	var id = 0;
	
	var Tetris = $.inherit(Base, {
		__constructor: function(x, y, wrapEl){
			this.__base(tmpl, wrapEl);
			
			this.id = 'tetris-' + (id++);
			
			this.shouldStop = false;
			this.blocks = [];
			
			this.index = Math.floor(Math.random() * kinds.length);
			this.kind = kinds[this.index];
			
			
			if(x && y && wrapEl){
				this.init(x, y, wrapEl);
			}
			
			$.subscribe('rate.dida', $.proxy(function(){
				if(!this.shouldStop){
					this.move('down');
				}
			},this));
			$.subscribe('keydown.move', $.proxy(keyDownHandler, this));
			$.subscribe('keydown.rotate', $.proxy(keyDownHandler, this));
		},
		init: function(x, y, wrapEl){
			//若在new构造函数时参数不足，则，手动init，填充足够的参数来初始化
			this.setX(x);
			this.setY(y);
			this.appendTo(wrapEl);
			//generate需要在有了 x，y 之后才行
			$.proxy(generate, this)(this.index);
		},
		move: function(direction){
			if(!this.can(direction)) return;
			
			if(direction === 'left'){
				this.setX(this.getX() - 1);
			}else if(direction === 'right'){
				this.setX(this.getX() + 1);
			}else if(direction === 'down'){
				this.setY(this.getY() + 1);
			}
			$.publish('tetris.move',direction);
		},
		rotate: function(){
			//var newBlocks = [];
			var len = this.getWidth();
			_.each(this.blocks, $.proxy(function(row, y){
				_.each(row, $.proxy(function(tblock, x){
					if(!tblock) return;
					var newX = len - 1 - tblock.y;
					var newY = tblock.x;
					tblock.setX(newX);
					tblock.setY(newY);
				},this));
			},this));
		},
		can: function(direction){
			var can = true;
			var outCeil = false;
			
			out_loop:
			for(var i=0,len1=this.blocks.length; i<len1; i++){
				var row = this.blocks[i];
				in_loop:
				for(var j=0,len2=row.length; j<len2; j++){
					var tblock = row[j];
					
					if(!tblock) continue;
					
					if(tblock.globalY <= 0) outCeil = true;
					
					var s = tblock.getSibling(direction);
					if(s === false || (s.tetris && s.tetris !== this)){
						can = false;
						break out_loop;
					}
					//else if(s === 'a-way' || s.tetris === this){can = true;}
				}
			}
			
			if(direction === 'down' && can === false){
				this.shouldStop = true;
				$.publish('tetris.someone-stop', this);
			}
			
			if(can === false && outCeil === true){
				$.publish('game-over');
			}
			
			return can;
		},
		each: function(fn){
			_.each(this.blocks, $.proxy(fn,this));
		},
		setX: function(x){
			this.x = x;
			
			this.$el.css({left: b.width * x});
			
			return this;
		},
		setY: function(y){
			this.y = y;
			
			this.$el.css({top: b.height * y});
			
			return this;
		},
		getX: function(){
			return this.x;
		},
		getY: function(){
			return this.y;
		},
		getWidth: function(){
			return this.kind[0].length;
		},
		getHeight: function(){
			return this.kind.length;
		}
	});
	
	exports.Tetris = Tetris;
	
})(jQuery, _, window);