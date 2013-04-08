(function ($, global) {
	var exports = global['Tetris'] = {};
	
	var Tetris = function () {
		this.element = $('<div class="tetris"></div>').prependTo(global.body);
	}


	exports.create = function () {
		return new Tetris();
	}
})(jQuery, global);