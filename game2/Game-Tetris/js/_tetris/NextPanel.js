(function ($, global) {
	exports = global['NextPanel'] = {};


	function NextPanel(panelName, tetris) {
		global.extend(arguments.callee, new global.InfoPanel.create(panelName, tetris));
		this.element = $('<div class="next-panel"><h3>' + panelName + '</h3><div class="show-area"></div></div>');
	}
	
	//NextPanel.prototype = new parent();



	exports.create = function (panelName, tetris) {
		return new NextPanel(panelName, tetris);
	};

})(jQuery, global);