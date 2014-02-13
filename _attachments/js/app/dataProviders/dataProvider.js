DataProvider = Class.create({
	initialize : function(){
		this.aGraphsCallbacks = [];
		this.aLastGraphData = {};
		this.aNumberCallbacks = [];
		this.aLastNumberData = 0;
	},

	/**
	* To override
	*/
	vRequestGraphRangeData : function(a_oRange,a_fCallback){
		if(!a_oRange.min)
			throw "Range min is required";
		if(!a_oRange.max)
			throw "Range max is required";
		if(a_oRange.max < a_oRange.min)
			throw "Max should be greater than min in the range";
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
			setTimeout(function() {fCallback(a_iValue);}, 10*oOptions.callbackMultiplier);
		});
	},
	/**
	* Call when new data arives.
	*/
	vOnNewGraphData : function(a_aData,a_oOptions){
		//defaults
		if(typeof a_aData == 'undefined'){
			a_aData = this.aLastGraphData;
		}
		$.each(this.aGraphsCallbacks,function(key,fCallback){
			setTimeout(function() {fCallback(a_aData);}, 10);
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
	* Use a filterDataProvider to filter results
	*/
	oFilter : function(a_mFilters){
		return new filterDataProvider(a_mFilters,this);
	}
});
