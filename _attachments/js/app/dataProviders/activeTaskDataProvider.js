var ActiveTasksDataProvider = Rx.Observable.create(function (observer) {
    // Yield a single value and complete
    // observer.onNext(42);
    // observer.onCompleted();
    var i = 0;
    timeoutHandler = setInterval(function(){
			getActiveTasks();
	},5000);
    // Any cleanup logic might go here
    return function () {
        // clearInterval(timeoutHandler);
        // console.log('disposed');
    };

    function getActiveTasks(){
		$.couch.activeTasks({
			success:function(oData){
				observer.onNext(oData);
			},
			error:function(oData){
				observer.onError(oData);
			}
		});
	}
}).publish();
ActiveTasksDataProvider.connect();
