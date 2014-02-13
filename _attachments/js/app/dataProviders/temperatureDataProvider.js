TemperatureDataProvider = Class.create(DataProvider,{p
	initialize : function($super,a_oDB,a_oOptions){
		$super();
		var $this = this;
		this.oDB = a_oDB;
		//defaults
		this.oOptions = $.extend({
			filter:"",
		},a_oOptions);
		if(typeof $this.oOptions.view === "undefined"){
			throw "CouchDB view is not defined for dataprovider. This is required."+
				"Add it with oOptions.view = 'viewname'";
		}
		if(typeof $this.oOptions.sensor_id === "undefined"){
			throw "The temperature requires a device when initialized. Add it to the options" +
			"with oOptions.sensor_id = \"sensor_id\"";
		}

		// get
		$.couch.db(this.oDB.name).info({
			success: function(data) {
				recentUpdateSeq = data.update_seq-2;

				var oOptions = {
					feed:"normal",
					since:recentUpdateSeq,
					filter:$this.oOptions.filter,
					include_docs:true,
					dev:$this.oOptions.sensor_id
				};
				$.getJSON("/"+$this.oDB.name+"/_changes?"+
					decodeURIComponent($.param(oOptions)), function(oData) {
					if (oData.results.length) {
						// get latest measurement doc from result set
						oDoc = oData.results.pop().doc;
						$this.vOnNewNumberData(oDoc.temperature);
						$this.vOnNewGraphData({y:oDoc.temperature,x:Math.round(oDoc.time/1000)});
						$this.vSetupChanges(oData.last_seq);
					}
				});
			}
		});
	},

	vRequestGraphRangeData : function($super,a_oRange,a_fCallback){
		//call super for sanity checks on a_oRange
		$super(a_oRange);
		var $this = this;
		this.oDB.view(this.oOptions.view + "/time", {
			startkey:[this.oOptions.sensor_id,a_oRange.min],
			endkey:[this.oOptions.sensor_id,a_oRange.max],
			reduce:false,
			update_seq : true,
			success : function(data) {
				$.each(data.rows,function(index,couchDoc){
					a_fCallback({'y':couchDoc.value.data.temperature,'x':parseInt(couchDoc.key[1]/1000,10)});
				});
			}
		});

	},

	vOnNewDataReceive :function(resp,$this) {
		$this = $this || this;
		if(typeof resp !== 'undefined'){
			$this.vOnNewNumberData(resp.results.slice(-1)[0].doc.temperature);
			$.each(resp.results,function(key,value){
				if( typeof value.doc !== 'undefined' &&
					typeof value.doc.time !== 'undefined')
				{
					$this.vOnNewGraphData({y:value.doc.temperature,x:Math.round(value.doc.time/1000)});
				}
			});
			$this.iLastChange = resp.last_seq;
			$this.vSetupChanges(resp.last_seq);
		}
	},

	vSetupChanges : function(a_iSince) {
		if (!this.bChangesRunning) {
			this.oChangeHandler = this.oDB.changes(a_iSince,{
				include_docs:true,
				filter:this.oOptions.filter,
				dev:this.oOptions.sensor_id
			});
			this.bChangesRunning = true;
			var $this = this;
			this.oChangeHandler.onChange(function(resp){$this.vOnNewDataReceive(resp,$this);});
		}
	},

	vStop : function(){
		if(!$.isEmptyObject(this.oChangeHandler))
			this.oChangeHandler.stop();
	}
});