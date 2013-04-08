(function ($, global) {
	var exports = global['PlayPanel'] = {};

	var PlayPanel = function (tetris) {
		this.element = $('<div class="play-panel"></div>').prependTo(tetris.element);
	}


	exports.create = function (tetris) {
		return new PlayPanel(tetris);
	}
})(jQuery, global);