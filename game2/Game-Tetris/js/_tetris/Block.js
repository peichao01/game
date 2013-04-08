(function ($, exports) {
	exports = exports['Block'] = {};

	var config = {
		destroyTime: 10
	};

	function Block(panel) {
		this.element = $('<div class="block"><b></b></div>').appendTo(panel.element);
	}
	Block.prototype.destroy = function () {
		this.element.animate({ 'opacity': 0 }, config.destroyTime, $.proxy(function () {
			this.element.remove();
		},this));
	}





	exports.Class = Block;

})(jQuery, global);