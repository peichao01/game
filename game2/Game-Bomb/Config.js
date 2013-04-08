(function($, exports){
	var Config = {
		level:{
			'1':{
				'grid':9,
				'bomb':10
			},
			'2':{
				'grid':16,
				'bomb':40
			},
			'3':{
				'grid':20,
				'bomb':80
			}
		},
		serverUrl:'server.php'
	}
	
	exports.Config = Config;
})(jQuery, Scan)