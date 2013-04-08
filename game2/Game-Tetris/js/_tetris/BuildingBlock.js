(function ($, exports) {
	exports = exports['BuildingBlock'] = {};

	var config = {
		//destroyTime: 10
	};

	function BuildingBlock(panel) {
		//this.element = $('<div class="block"><b></b></div>').appendTo(panel.element);
	}




	exports.create = function () {
		return new BuildingBlock();
	};

})(jQuery, global);