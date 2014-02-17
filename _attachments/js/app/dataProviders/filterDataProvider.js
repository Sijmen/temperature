FilterDataProvider = Class.create(DataProvider,{
	initialize : function($super,a_oFilter,a_oDataProvider){
		$super();
		var $this = this;
		this.oFilters = a_oFilter;
		this.oDataProvider = a_oDataProvider;
		this.oDataProvider.vRegisterNewData(function(a_oData){
			$this.vOnNewData(a_oData,$this);
		});
	},
	/**
	* a_oData	Raw data
	* $this		Added because the function is used as callback, which removes its awareness of the context.
	*/
	vOnNewData : function(a_oData,$this){
		if(typeof $this === "undefined") $this = this;

		if($this.bCheckGraphFilter(a_oData)){
			$this.vOnNewGraphData({x:a_oData[$this.oFilters.graph.x],y:a_oData[$this.oFilters.graph.y]});
		}

		if($this.oFilters.number && a_oData[$this.oFilters.number]) {
			$this.vOnNewNumberData(a_oData[$this.oFilters.number]);
		}
	},

	bCheckGraphFilter : function(a_oData){
		var $this = this;
		return $this.oFilters.graph &&
		$this.oFilters.graph.x &&
		$this.oFilters.graph.y &&
		a_oData[$this.oFilters.graph.x] &&
		a_oData[$this.oFilters.graph.y];
	},

	vRequestGraphRangeData :function($super,a_oRange,a_fCallback){
		var $this = this;
		this.oDataProvider.vRequestRangeData(a_oRange,function(a_oData){
			if($this.bCheckGraphFilter(a_oData)){
				a_fCallback({x:a_oData[$this.oFilters.graph.x],y:a_oData[$this.oFilters.graph.y]});
			}
		});
	},

	/**
	*	Does this work? no
	*/
	// vRequestRangeData : this.oDataProvider.vRequestRangeData
});