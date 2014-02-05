GraphTile = Class.create(Tile,{
	initialize : function(a_sSelector,a_oDataProvider,a_oOptions){
		var $this = this;
		this.oOptions = $.extend({
			timespan:300,
			smoothScale:1,
			//allowed types: ["time","data"]
			timespanType:"time",
			serie:{
				name : 'serie1',
				data : [],
				color : '#c05020'
			}
		},a_oOptions);
		this.vInit();
		this.sSelector = a_sSelector;
		this.bRendered = false;
		this.oGraph = null;
		this.oDataProvider = a_oDataProvider;

		this.aSeries = [];
		this.oSerie = this.oOptions.serie;
		this.aSeries.push(this.oSerie);

		if(this.oOptions.timespanType !== "time" && this.oOptions.timespanType !== "data"){
			throw "Timespan option can only be defined as 'time' or 'data', Actual value: "+this.oOptions.timespanType;
		}
		if(typeof $this.oOptions.range !== "undefined"){
			$this.oDataProvider.vRequestGraphRangeData($this.oOptions.range, function(a_oData){
				$this.vReceiveInitialData($this,a_oData);
			});
		}

	},
	vReceiveInitialData : function($this,a_oData){
		$this.vAddData(a_oData);
	},
	vAddData : function(a_oData){
		var $this = this;
		$this.oSerie.data.push(a_oData);
		$this.vUpdate();
	},

	oGetSeries : function(){
		return this.aSeries;
	},

	oGetSerie : function(a_iIndex){
		return this.aSeries[a_iIndex];
	},

	vRender : function(){
		if(this.bRendered)
			this.vUpdate();
		this.oGraph = new Rickshaw.Graph( {

			element: document.querySelector(this.sSelector),
			renderer: 'area',
			width: $(this.sSelector).parent().innerWidth(),
			height: 350,
			min: "auto",
			padding: {top:0.1,bottom:0.1},
			stroke:false,
			series: this.aSeries
		} );

		this.hoverDetail = new Rickshaw.Graph.HoverDetail({
			graph: this.oGraph
		});

		this.smoother = new Rickshaw.Graph.Smoother({
			graph:this.oGraph
		});
		this.smoother.setScale(this.oOptions.smoothScale);
		this.xAxis = new Rickshaw.Graph.Axis.Time( {
			graph: this.oGraph,
			// ticksTreatment: ticksTreatment,
			timeFixture: new Rickshaw.Fixtures.Time.Local()
		} );

		this.yAxis = new Rickshaw.Graph.Axis.Y( {
			graph: this.oGraph
		} );


		this.xAxis.render();
		this.oGraph.render();
		this.bRendered = true;
	},
	vUpdate : function(a_bForce,a_bSorted){
		var $this = this;
		//calling render on every element is just plain stupid...
		//so either we wait for some miliseconds in order to get all data
		//at once and only require one call to update.
		if($this.oUpdateTimeout)
			clearInterval($this.oUpdateTimeout);

		if(typeof a_bForce === "undefined" || !a_bForce){
			$this.oUpdateTimeout = setTimeout(function(){$this.vUpdate(true);},10);
		}else{
			// $this.oSerie.data.sort(function(firstValue,secondValue){
				// return firstValue.x-secondValue.x;
			// });
			if(this.bRendered)
				this.oGraph.render();
			else
				this.vRender();
		}
	},
	vSetSmooth : function(a_iSmooth){
		this.oOptions.smoothScale = a_iSmooth;
	},
	vResize : function(){
		console.log("Resizing in graphTile "+this.sSelector);
		this.oGraph.configure({
			width: $(this.sSelector).parent().innerWidth()
			// height: $(this.sSelector).parent().innerHeight()
		});
		this.vUpdate();
	},

	vSetTimespan : function(a_oFirstDate, a_oSecondDate){
		if(a_oFirstDate > a_oSecondDate)
			this.vSetTimespanSeconds(Math.round(a_oFirstDate-a_oSecondDate));
		else
			this.vSetTimespanSeconds(Math.round(a_oSecondDate-a_oFirstDate));
	},

	vSetTimespanSeconds : function(a_iSeconds){
		this.iTimespan = a_iSeconds;
	}
});