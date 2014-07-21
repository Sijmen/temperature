Rx.Observable.fromCouchDB = function (couchDB) {
	var observable = Rx.Observable.create(function (observer) {
		var bChangesRunning = false;
		var oChangeHandler = null;
		$.couch.db(couchDB.name).info({
			success: function(data) {
				recentUpdateSeq = data.update_seq-50;

				var oOptions = {
					feed:"normal",
					since:recentUpdateSeq,
					include_docs:true
				};
				$.getJSON("/"+couchDB.name+"/_changes?"+
					decodeURIComponent($.param(oOptions)), function(oData) {
					if (oData.results.length) {
						// get latest measurement doc from result set
						$.each(oData.results,function(key,oDoc){
							observer.onNext(oDoc);
						});
						// Rx.Observable.fromArray(oData.results).subscribe(function(oDoc){observer.onNext(oDoc);});
					}
					vSetupChanges(oData.last_seq);
				});
			}
		});

		function vSetupChanges(a_iSince) {
			if (!bChangesRunning) {
				oChangeHandler = couchDB.changes(a_iSince,{include_docs:true});
				bChangesRunning = true;
				// oChangeHandler.onChange(function(oData){Rx.Observable.fromArray(oData.results).subscribe(function(oDoc){observer.onNext(oDoc);});});
				oChangeHandler.onChange(function(oData){
						$.each(oData.results,function(key,oDoc){
							observer.onNext(oDoc);
					});
				});
			}
		}

		// Any cleanup logic might go here
		return function () {
			// clearInterval(timeoutHandler);
			// console.log('disposed');
		};
	}).map(function(data){return data.doc;}).publish();
	observable.connect();
	return observable;
};

Rx.Observable.fromCouchDBView = function(couchDB,options){
	//call super for sanity checks on a_oRange
	var $this = this;
	// console.log(this.oOptions);
	if(!options)
		throw "options must be given, no default available";
	var observable = Rx.Observable.create(function (observer) {
		baseCouchOptions = {
			reduce:false,
			update_seq : true,
			success : function(data) {
				$.each(data.rows,function(index,couchIndex){
					myRet = couchIndex.value;
					myRet._id = couchIndex.id;
					myRet.timestamp = couchIndex.key[1];
					observer.onNext(myRet);
				});
				observer.onCompleted();
			},
			error : function(data){
				observer.onError(data);
			}
		};
		if (options.device && options.range) {
			baseCouchOptions.startkey = [options.device,options.range.min];
			baseCouchOptions.endkey = [options.device,options.range.max];
		}
		couchDB.view(
			options.designDoc + "/"+options.view,
			$.extend(true,baseCouchOptions,options)
		);


		// Any cleanup logic might go here
		return function () {
			// clearInterval(timeoutHandler);
			// console.log('disposed');
		};
	});
	return observable;
};