(function($, exports){
	var id = 0;
	var Bomb = function(isBomb){
		this.element = document.createElement('div');
		this.isBomb = isBomb;
		this.id = id++;
		this.flaged = false;
		this.isTurnover = false;
		
		var elem = $(this.element);
		elem.add
		elem.on('click',$.proxy(function(e){
			if(e.which == 1 && !this.flaged){//左键
				$.publish('Bomb.left-click', this);
			}else if(e.which == 2){//中键
				$.publish('Bomb.flag-click', this);
			}
		},this));
		elem.on('mouseenter',function(e){
			elem.addClass('hover');
		});
		elem.on('mouseleave',function(e){
			elem.removeClass('hover');
		});
	};
	
	Bomb.prototype.selfCheck = function(){
		if(this.isBomb){
			$.publish('Bomb.failed', this);
			console.log('BOMB!!!');
		}else{
			this.isTurnover = true;
			$.publish('Bomb.scanaround.begin', this);
		}
	}
	Bomb.prototype.turnover = function(bombCount){
		if(!this.flaged){
			$(this.element).addClass('turnover').html('<span>' + (bombCount===0 ? '' : bombCount) + '</span>');
		}
	}
	Bomb.prototype.flag = function(){
		if(this.isTurnover)
			return;
			
		if(this.flaged){
			$.publish('Bomb.flag-add', this);
			$(this.element).empty();
		}else{
			$.publish('Bomb.flag-sub', this);
			$(this.element).html('<img src="'+exports.Resource.flagSrc+'" />');
		}
		this.flaged = !this.flaged;
	}	
	Bomb.prototype.explode = function(){
		if(this.isBomb){
			$(this.element).html('<img src="'+exports.Resource.bombSrc+'" />');
		}
	}
	Bomb.prototype.frozen = function(){
		var elem = $(this.element);
		elem.css('opacity','0.3').off('click').off('mouseenter').off('mouseleave');
	}
	Bomb.prototype.test = function(){
		$(this.element).addClass('test');
	}
	
	
	
	
	
	Bomb.create = function(isBomb){
		return new this(isBomb);
	}
	
	$.subscribe('Bomb.left-click',function(bomb){
		bomb.selfCheck();
	});
	$.subscribe('Bomb.flag-click',function(bomb){
		bomb.flag();
	});
	//$.subscribe('Bomb.scanaround.finish', $.proxy(scanaroundFinishHandler,this));
	$.subscribe('Bomb.scanaround.finish', scanaroundFinishHandler);
	
	function scanaroundFinishHandler(e){
		//this 被 proxy 为 Bomb 的实例
		
		//if(e.id === this.id){
			//console.log(e);
			e.self.turnover(e.bombCount);
			if(e.bombCount === 0){
				_.each(e.siblings, function(siblingbomb){
					if(!siblingbomb.isBomb && !siblingbomb.isTurnover)
						$.publish('Bomb.left-click', siblingbomb);
				});
			}
			/*
			this.turnover(e.bombCount);
			if(e.bombCount !== 0){
				_.each(e.siblings, function(siblingbomb){
					if(!this.isBomb){
						//$.publish('Bomb.scanaround.begin', siblingbomb);
					}
				});
			}*/
		//}
	}
	

	exports.Bomb = Bomb;
})(jQuery, Scan)