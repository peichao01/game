(function($, doc){
	var id = 0,
		tempId,
		timeoutId;
	var config = {
		delay: 300,
		interval: 50
	}
	$(doc).on('keypress',function(e){
		id++;
		console.log('keypress');
		//tempId = id;
		timeoutId = setTimeout(function(){
			//if(tempId === id){
			$.publish('holdonEvent.dida');
			timeoutId = setTimeout(arguments.callee, config.interval);
			//}
		},config.delay);
		//console.log(e);
	});
	$(doc).on('keyup',function(e){
		id++;
		console.log('keyup');
		clearTimeout(timeoutId);
	});
})(jQuery, document);

$.subscribe('holdonEvent.dida',function(){
	console.log('dida');
})