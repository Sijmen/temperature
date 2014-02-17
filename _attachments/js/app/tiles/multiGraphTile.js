MultiGraphTile = Class.create(GraphTile,{
	initialize : function($super,a_sSelector,a_oDataProvider,a_oOptions){
		a_oOptions = $.extend(true,a_oOptions,{graphOptions:{}});
		$super(a_sSelector,a_oDataProvider,a_oOptions);
		this.oSeries = {};
	},
	vAddSerie : function(a_oDataProvider,a_oSerieOptions,a_oOptions){
		var $this = this;
		var oSerieOptions = $.extend({
			name : 'serie'+this.aSeries.length,
			data : [],
			color : '#c03020'
		},a_oSerieOptions);
		this.oSeries[oSerieOptions.name] = this.oSerieOptions;
		this.aSeries.push(oSerieOptions);
		if(typeof a_oOptions !== "undefined" && typeof a_oOptions.range !== "undefined"){
			oRange = a_oOption.range;
		}
		else{
			oRange = $this.oOptions.range;
		}
		a_oDataProvider.vRequestGraphRangeData(oRange, function(a_oData){
			oSerieOptions.data.push(a_oData);
			$this.vUpdate();
		});

	}
});
