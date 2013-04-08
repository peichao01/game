(function ($, exports) {
	exports = exports['InfoPanel'] = {};

	function InfoPanel(paneName, tetris) {
		this.tetris = tetris;
		this.element = $('<div class="info-panel"><h3>' + paneName + '</h3><p></p></div>');
	}
	InfoPanel.prototype.set = function (content) {
		this.element.children('p').text(content);
	}
	InfoPanel.prototype.get = function () {
		this.element.children('p').text();
	}
	InfoPanel.prototype.append = function () {
		this.element.appendTo(this.tetris.element);
	}




	exports.create = function (paneName, tetris) {
		return new InfoPanel(paneName, tetris);
	}

})(jQuery, global);