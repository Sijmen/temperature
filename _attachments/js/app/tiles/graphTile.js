GraphTile = Class.create(Tile,{
	initialize : function($super,a_sSelector,a_oObservable,a_oOptions){
		var $this = this;
		$super(a_sSelector,a_oOptions);
		// this.oGraph = {};
		this.oOptions = $.extend(true,{
			timespan:300,
			smoothScale:1,
			//allowed types: ["time","data"]
			timespanType:"time",
			serie:{
				name : 'serie1',
				data : [],
				color : '#c05020'
			},
			graphOptions:{
				min:"auto",
				renderer:"area"
			}
		},a_oOptions);
		if(this.oOptions.range && this.oOptions.range.min && this.oOptions.range.max && this.oOptions.timespanType == "time"){
			this.oOptions.timespan = Math.round((this.oOptions.range.max - this.oOptions.range.min)/1000);
		}
		this.sSelector = a_sSelector;
		this.oSeries = {};
		this.oSeries[a_oOptions.serie.name] = a_oOptions.serie;
		this.aSeries = [a_oOptions.serie];
		this.zipped = a_oObservable;
		this.zipped = this.zipped.map(function(data){
			//get name with data
			return [{serie:a_oOptions.serie.name,data:data}];
		});
	},
	vAddSerie : function(a_oObservable,a_oSerieOptions,a_oOptions){
		this.aSeries.push(a_oSerieOptions);
		this.oSeries[a_oSerieOptions.name] = a_oSerieOptions;
		this.zipped = this.zipped.combinelatest(a_oObservable,function(currentData,newData){
			currentData.push({serie:a_oSerieOptions.name,data:newData});
			return currentData;
		});

	},

	vRender : function($super){
		var $this = this;
		if(!$this.disposable){
			$this.disposable = $this.zipped.subscribe(function(data){
				//put data in array for rendering
				Rx.Observable.fromArray(data).subscribe(function(serieData){
					$this.vAddData(serieData.data,$this.oSeries[serieData.serie]);
				});
			});
		}

		if(this.aSeries[0].data.length > 0 && !$this.oGraph){
			$this.oGraph = new Rickshaw.Graph( $.extend(true,{

				element: document.querySelector($this.sSelector),
				renderer: "area",
				width: $($this.sSelector).parent().innerWidth(),
				height: 350,
				min: "auto",
				padding: {top:0.1,bottom:0.1},
				// stroke:false,
				series: $this.aSeries
			},$this.oOptions.graphOptions ));

			$this.hoverDetail = new Rickshaw.Graph.HoverDetail({
				graph: $this.oGraph
			});

			$this.smoother = new Rickshaw.Graph.Smoother({
				graph:$this.oGraph
			});
			$this.smoother.setScale($this.oOptions.smoothScale);
			$this.xAxis = new Rickshaw.Graph.Axis.Time({
				graph: $this.oGraph,
				// ticksTreatment: ticksTreatment,
				timeFixture: new Rickshaw.Fixtures.Time.Local()
			});

			$this.yAxis = new Rickshaw.Graph.Axis.Y({
				graph: $this.oGraph
			});
			$this.xAxis.render();
			$this.oGraph.render();
			$this.bRendered = true;
		}
	},

	vAddData : function(a_oData,a_oSerieOptions){
		var $this = this;
		var aData = a_oSerieOptions.data;
		aData.push(a_oData);
		if($this.oOptions.timespanType === "data")
			aData.shift();

		if($this.oOptions.timespanType === "time"){
			iLatestTime = a_oData.x-$this.oOptions.timespan;
			var bAllowedValue = false;
			while(!bAllowedValue){
				//check if first element is still allowed in this timeframe
				if(aData[0].x < iLatestTime)
					//if not remove, then checks new first element.
					aData.shift();
				else
					//if allowed moves out of loop.
					bAllowedValue = true;
			}
		}
		$this.vUpdate();
	},

	vUpdate : function($super,a_bForce,a_bSorted){
		var $this = this;
		//calling render on every element is just plain stupid...
		//so either we wait for some miliseconds in order to get all data
		//at once and only require one call to update.
		if($this.oUpdateTimeout)
			clearInterval($this.oUpdateTimeout);

		if(typeof a_bForce === "undefined" || !a_bForce){
			$this.oUpdateTimeout = setTimeout(function(){$this.vUpdate(true);},100);
		}else{
			// $this.oSerie.data.sort(function(firstValue,secondValue){
				// return firstValue.x-secondValue.x;
			// });
			if(this.bRendered)
				this.oGraph.render();
			else
				this.vRender();
			$super();
		}
	},

	vResize : function(){
		if(typeof this.oGraph !== "undefined" && this.oGraph !== null){
			this.oGraph.configure({
				width: $(this.sSelector).parent().innerWidth()
				// height: $(this.sSelector).parent().innerHeight()
			});
			this.vUpdate();
		}
	},

	vSetSmooth : function(a_iSmooth){
		this.oOptions.smoothScale = a_iSmooth;
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







