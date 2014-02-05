LiveGraphTile = Class.create(GraphTile,{

	initialize : function($super, a_sSelector, a_oDataProvider,a_oOptions){
		$super(a_sSelector,a_oDataProvider,a_oOptions);
		var $this = this;
		this.bInitialData = false;
		this.oOptions = $.extend(this.oOptions,{
			timespan:300,
			smoothScale:1,
			//allowed types: ["time","data"]
			timespanType:"time"
		},a_oOptions);

		if(typeof $this.oOptions.range !== "undefined"){
			$this.aInitialData = [];
			$this.aBufferData = [];
		}else{
			this.bInitialData = true;
		}
		this.oDataProvider.vRegisterNewGraphs(function(a_oData){
			//Only render when initial data has been received
			if($this.bInitialData){
				$this.vAddData(a_oData);
			}else{
				$this.aBufferData.push(a_oData);
			}
		});

	},

	vReceiveInitialData : function ($this,a_oData){
		$this.vAddData(a_oData);
		$this.bInitialData = true;
	},

	vAddInitialData : function(a_oData){
		var $this = this;
		$this.aInitialData.push(a_oData);
		if($this.oInitialDataTimeout)
			clearInterval($this.oInitialDataTimeout);

		$this.oInitialDataTimeout = setTimeout(function(){
			$.each($this.aInitialData,function(key,graphValue){
				$this.oSerie.data.push(graphValue);
			});
			$this.aInitialData = [];
			$.each($this.aBufferData,function(key,graphValue){
				$this.oSerie.data.push(graphValue);
			});
			$this.aBufferData = [];

		},100);
	},

	vAddData : function(a_oData){
		var $this = this;
		$this.oSerie.data.push(a_oData);
		if($this.oOptions.timespanType === "data")
			$this.oSerie.data.shift();

		if($this.oOptions.timespanType === "time"){
			iLatestTime = a_oData.x-$this.oOptions.timespan;
			var bAllowedValue = false;
			while(!bAllowedValue){
				//check if first element is still allowed in this timeframe
				if($this.oSerie.data[0].x < iLatestTime)
					//if not remove, then checks new first element.
					$this.oSerie.data.shift();
				else
					//if allowed moves out of loop.
					bAllowedValue = true;
			}
		}
		$this.vUpdate();
	}
});