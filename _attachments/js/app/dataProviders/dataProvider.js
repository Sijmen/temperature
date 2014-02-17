DataProvider = Class.create({
	initialize : function(){
		this.aGraphsCallbacks = [];
		this.aLastGraphData = {};
		this.aNumberCallbacks = [];
		this.aDataCallbacks = [];
		this.aLastNumberData = 0;
	},

	/**
	* To override
	*/
	vRequestGraphRangeData : function(a_oRange,a_fCallback){
		this.vCheckRange(a_oRange);
	},

	vCheckRange : function(a_oRange){
		if(!a_oRange.min)
			throw "Range min is required";
		if(!a_oRange.max)
			throw "Range max is required";
		if(a_oRange.max < a_oRange.min)
			throw "Max should be greater than min in the range";
	},

	/**
	* To override
	*/
	vRequestRangeData : function(a_oRange,a_fCallback){
		this.vCheckRange(a_oRange);
	},

	/**
	* Call when a new number arrives.
	*/
	vOnNewNumberData : function(a_iValue, a_oOptions){
		//defaults
		oOptions = $.extend({
			callbackMultiplier:1
		},a_oOptions);

		if(typeof a_iValue === 'undefined'){
			a_aData = this.aLastNumberData;
		}
		if(typeof a_iValue !== 'number'){
			throw "Expected a number as new value, but got "+typeof a_iValue;
		}

		$.each(this.aNumberCallbacks,function(key,fCallback){
			//use setTimeout to make call async
			setTimeout(function() {fCallback(a_iValue);}, 10*oOptions.callbackMultiplier);
		});
	},
	/**
	* Call when new data arives. Data should have the format {x:value,y:value}.
	*/
	vOnNewGraphData : function(a_aData,a_oOptions){
		//defaults
		if(typeof a_aData == 'undefined'){
			a_aData = this.aLastGraphData;
		}
		if(!a_aData.y || !a_aData.x){
			throw "Invalid data format given to new graph data. Format must be {x:value,y:value}";
		}
		$.each(this.aGraphsCallbacks,function(key,fCallback){
			//use setTimeout to make call async
			setTimeout(function() {fCallback(a_aData);}, 10);
		});
	},

	/**
	* Call when new data arives, no promises on format are nessecary
	*/
	vOnNewData : function (a_oData,a_oOptions){
		$.each(this.aDataCallbacks,function(key,fCallback){
			//use setTimeout to make call async
			setTimeout(function(){fCallback(a_oData);}, 10);
		});
	},

	/**
	* Register callback for data value
	*/
	vRegisterNewNumbers : function(a_fCallback){
		this.aNumberCallbacks.push(a_fCallback);
	},

	/**
	* Register callback for an data array
	*/
	vRegisterNewGraphs : function(a_fCallback){
		this.aGraphsCallbacks.push(a_fCallback);
	},

	/**
	* Register callback for new data. Data gives no promises
	* on the format.
	*/
	vRegisterNewData : function(a_fCallback){
		this.aDataCallbacks.push(a_fCallback);
	},

	/**
	* Use a filterDataProvider to filter results. Filters should look like
	* {
	*	graph:{x:"propertyName",y:"propertyName"},
	*   number:"propertyName"
	* }
	* where the filter contains at least one of the above.
	*/
	oFilter : function(a_oFilters){
		if(!a_oFilters.graph && !a_oFilters.number)
			throw "Filter provided no number or graph element. At leas one of these is required!";
		var filterDataProvider = new FilterDataProvider(a_oFilters,this);

		return filterDataProvider;
	}
});
