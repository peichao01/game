(function($, exports){
	var Grid = function(){
		this.cache = [];
		this.turnoveredBomb = [];
		this.bombNum = 0;
		this.allblockNum = 0;
		this.element = document.createElement('div');
		
		$.subscribe('Bomb.scanaround.begin', $.proxy(this.scanaround ,this));
		$.subscribe('Bomb.left-click',$.proxy(turnoverOneBomb, this));
	};
	
	var gl = exports.Config.level;
	
	Grid.prototype.init = function(level){
		this.bombNum = gl[level]['bomb'];
		this.allblockNum = Math.pow(gl[level]['grid'],2);
		this.cache = randomGenerate(gl[level]['grid'], gl[level]['bomb']);
		this.element.className = 'map map'+level;
	}
	Grid.prototype.appendTo = function(wrapElem){
		this.each(function(bomb){
			this.element.appendChild(bomb.element);
		});
		wrapElem.appendChild(this.element);
	}
	Grid.prototype.scanaround = function(bomb){
		var coordinate = getSiblings.call(this,bomb),
			c = coordinate, a = this.cache, r = [],
			bombCount = 0;
		for(var i=c.x-1;i<=c.x+1;i++){
			for(var j=c.y-1;j<=c.y+1;j++){
				if(i>=0 && j>=0 && i<a.length && j<a[0].length && a[i][j]!==bomb){
					//(a[i][j]).test();
					bombCount += (a[i][j]).isBomb ? 1 : 0;
					r.push(a[i][j]);
				}
			}
		}
		
		$.publish('Bomb.scanaround.finish',{
			'self':bomb,
			'siblings':r,
			'x':c.x,
			'y':c.y,
			'id':bomb.id,
			'bombCount':bombCount
		});
	}
	Grid.prototype.explode = function(){
		this.each(function(bomb){
			bomb.explode();
		});
	}
	Grid.prototype.frozen = function(){
		this.each(function(bomb){
			bomb.frozen();
		});
	}
	Grid.prototype.each = function(fn){
		var i,j,l,m;
		loop1:
		for(i=0,l=this.cache.length;i<l;i++){
			loop2:
			for(j=0,m=this.cache[i]['length'];j<m;j++){
				if(fn.call(this, this.cache[i][j], i, j) === false){
					//console.log('the loop1 was breaked');
					break loop1;
				}
			}
		}
	}
	Grid.prototype.gamewin = function (){
		this.frozen();
	}
	Grid.prototype.gamefailed = function(){
		this.explode();
		this.frozen();
	}
	
	
	
	
	
	Grid.create = function(level){
		var g = new this();
		g.init(level);
		return g;
	}
	
	
	
	
	function turnoverOneBomb(bomb){
		//this 被 proxy 到 Grid 的实例上面了
		this.turnoveredBomb.push(bomb);
		_.uniq(this.turnoveredBomb);
		
		if(this.turnoveredBomb.length === this.allblockNum - this.bombNum){
			$.publish('Bomb.win');
		}
	}
	function getSiblings(bomb){
		//this 被 proxy 到 Grid 的实例上面了
		var coordinate = {};
		this.each(function(_bomb, x, y){
			if(bomb.id ===  _bomb.id){
				coordinate.x = x;
				coordinate.y = y;
				return false;
			}
		});
		return coordinate;
	}
	function randomGenerate(grid, bomb){
		var arr = [],arr1 = [],i,j,l;
		for(i=0,l=grid*grid; i<l; i++){
			var isBomb = --bomb >= 0 ? true : false;
			arr1.push(exports.Bomb.create(isBomb));
		}
		arr1 = randomArray(arr1);
		
		for(i=0;i<grid;i++){
			arr[i] = [];
			for(j=0;j<grid;j++){
				arr[i][j] = arr1.shift();
			}
		}
		
		return arr;
	}
	function randomArray(array){
		var arr=[];
		for(var i=0,l=array.length;i<l;i++){
			var index = Math.floor(Math.random()*array.length);
			arr.push(get(index));
		}
		return arr;
		
		function get(index){
			var r = array.slice(index,index+1);
			array = (array.slice(0,index)).concat(array.slice(index+1));
			return r[0];
		}
	}
	
	
	
	
	
	exports.Grid = Grid;
})(jQuery, Scan)