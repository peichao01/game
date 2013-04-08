(function($, _, exports){
	var c = exports.config;
	var b = c.block;
	var m = c.map;
	var Base = exports.Base;
	var Block = exports.Block;
	
	var tmpl = '<div class="map clear"></div>';
	
	var setWH = function(){
		this.$el.width(b.width * m.xNum).height(b.height * m.yNum);
	}
	
	var addTBHandler = function(tblock){
		this.tblocks.push(tblock);
	}
	var destroyTBHandler = function(tblock){
		this.tblocks = _.filter(this.tblocks, function(tb){ return tb.id !== tblock.id; });
	}
	var getSliblingHandler = function(e){
		var tb = e.tblock;
		var dir = e.direction;
		
		if(dir === 'left'){
			var x = tb.globalX - 1;
			var y = tb.globalY;
			
			if(x<0) return tb.sibling = false;
		}else if(dir === 'right'){
			var x = tb.globalX + 1;
			var y = tb.globalY;
			
			if(x>=this.xNum) return tb.sibling = false;
		}else if(dir === 'down'){
			var x = tb.globalX;
			var y = tb.globalY + 1;
			
			if(y>=this.yNum) return tb.sibling = false;
		}
		tb.sibling = _.find(this.tblocks, function(_tb){ return _tb.globalX === x && _tb.globalY === y; }) || 'a-way';
	}
	var tetrisStopHandler = function(){
		//1. 生成新的 方块
		var t = new Tetris();
		var x = Math.floor((this.xNum - t.getWidth())/2);
		var y = -t.getHeight();
		t.init(x, y, this.el);
		
		t.can('down');
		
		this.tetris = t;
		
		//2. 判断是否有成行的
		//2.1 首先按行数分组
		_.each(this.tblocks,$.proxy(function(tblock){
			if(tblock.hadinRow) return;
			if(tblock.globalY < 0) return;
			
			tblock.hadinRow = true;
			this.rows[tblock.globalY][tblock.globalX] = tblock;
		},this));
		//console.log(this.rows);
		var destroy_rows = 0;
		_.each(this.rows, $.proxy(function(row, index){
			//console.log(_.compact(row,_.identity).length, m.xNum);
			if(_.compact(row,_.identity).length === m.xNum){
				//console.log('row destroy', index, row);
				destroy_rows++;
				$.publish('map.destroy',{row:row, index:index});
			}
		},this));
		if(destroy_rows>0){
			$.publish('map.add-score', {destroy_rows: destroy_rows, wrapEl: this.el});
		}
	}
	
	var destroyRowHandler = function(e){
		var row = e.row;
		var index = e.index;
		
		//重新调整 行数组
		for(var i=index; i>0; i--){
			this.rows[i] = this.rows[i-1];
		}
		
		//销毁块
		_.each(row, $.proxy(function(tblock){
			//tblock.destroy();
			$.publish('map.tblock-go-destroy',{tblock:tblock, rowNum: index});
		},this));
	}
	
	var destroyTBFinishHandler = function(e){
		var index = e.rowNum;
		var tblock = e.tblock;
		
		this.destroyed.push(tblock.id);
		//重新调整 tblocks
		this.tblocks = _.without(this.tblocks, tblock);
		
		if(this.destroyed.length !== m.xNum) return;
		
		this.destroyed = [];
		
		//销毁行上面的行整体下移一格
		_.each(this.tblocks, $.proxy(function(tblock){
			if(tblock.globalY > index) return;
			tblock.setY(tblock.getY() + 1);
			tblock.globalY += 1;
		},this));
		
		console.log(this.tblocks.length,this.tblocks);
		console.log(this.rows.length,this.rows);
	}
	
	var Map = $.inherit(Base, {
		__constructor: function(xNum, yNum, wrapEl){
			this.__base(tmpl, wrapEl);
			
			this.xNum = xNum;
			this.yNum = yNum;
			
			this.tblocks = [];
			
			this.rows = [];//按行来分组
			for(var i=0;i<yNum; i++){
				this.rows[i] = [];
			}
			
			this.destroyed = [];//已销毁的块，暂时保存
			
			var map = [];
			
			for(var y=0;y<yNum;y++){
				map[y] = [];
				for(var x=0;x<xNum;x++){
					map[y][x] = new Block(x, y, this.el);
				}
			}
			
			this.map = map;
			$.proxy(setWH, this)();
			
			$.subscribe('tblock.sibling-check', $.proxy(getSliblingHandler,this));
			$.subscribe('tblock.destroy-finish', $.proxy(destroyTBFinishHandler,this));
			$.subscribe('map.destroy', $.proxy(destroyRowHandler,this));
			$.subscribe('tetris.add-tblock', $.proxy(addTBHandler,this));
			
			$.subscribe('clock.start', $.proxy(tetrisStopHandler,this));
			$.subscribe('tetris.someone-stop', $.proxy(tetrisStopHandler,this));
		},
		getBlockByXY: function(x, y){
			return this.map[y][x];
		},
		getBlockById: function(id){
			return _.find(_.flatten(this.map), function(block){
				return block.id === id;
			});;
		},
		getRow: function(index){
			return this.map[index];
		}
	});
	
	exports.Map = Map;
	
})(jQuery, _, window)