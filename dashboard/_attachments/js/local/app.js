$oDB = $.couch.db('temperature');
//One stream to rule them all!
var dbStream = Rx.Observable.fromCouchDB($oDB);

/*GENERAL OPTIONS*/
var range24hours = {
	min:(new Date()).getTime()-24*3600*1000,
	max:(new Date()).getTime()
};

var range60minutes = {
	min:(new Date()).getTime()-3600*1000,
	max:(new Date()).getTime()
};

var baseOptions = {
	view:'time',
	designDoc:"dashboard"
};
var graphOptions = {
	stroke: true,
	renderer:'multi',
	offset: 'value',
	min: 0,
	unstack: true,
	interpolation: 'linear'
};
var baseOptions24h = $.extend({range:range24hours},baseOptions);
var baseOptions60m = $.extend({range:range60minutes},baseOptions);

//Get the historic values
var viewTemperature_24h = Rx.Observable.fromCouchDBView(
	$oDB,
	$.extend(
		{device:'28-0000053b9dd6'},
		baseOptions24h
	)
);
var viewTemperature_60m = Rx.Observable.fromCouchDBView(
	$oDB,
	$.extend(
		{device:'28-0000053b9dd6'},
		baseOptions60m
	)
);
var viewTemperatureAn_24h = Rx.Observable.fromCouchDBView(
	$oDB,
	$.extend(
		{device:'28-0000055d5d12'},
		baseOptions24h
	)
);
var viewTemperatureAn_60m = Rx.Observable.fromCouchDBView(
	$oDB,
	$.extend(
		{device:'28-0000055d5d12'},
		baseOptions60m
	)
);
var viewLoadPi2_24h = Rx.Observable.fromCouchDBView(
	$oDB,
	$.extend(
		{device:'loadpi2'},
		baseOptions24h
	)
);
var viewLoadPi3_24h = Rx.Observable.fromCouchDBView(
	$oDB,
	$.extend(
		{device:'loadpi3'},
		baseOptions24h
	)
);
var viewLoadVps_24h = Rx.Observable.fromCouchDBView(
	$oDB,
	$.extend(
		{device:'loadvps'},
		baseOptions24h
	)
);
var viewThermActive_24h = Rx.Observable.fromCouchDBView(
	$oDB,
	$.extend(
		{device:'therm_active'},
		baseOptions24h
	)
);
var viewThermActive_60m = Rx.Observable.fromCouchDBView(
	$oDB,
	$.extend(
		{device:'therm_active'},
		baseOptions60m
	)
);

var viewDesired_24h = Rx.Observable.fromCouchDBView(
	$oDB,
	$.extend(
		{device:'desired'},
		baseOptions24h
	)
);
var viewDesired_60m = Rx.Observable.fromCouchDBView(
	$oDB,
	$.extend(
		{device:'desired'},
		baseOptions60m
	)
);

//Create the live stream for one sensor/device
var temperatureStream = dbStream.filter(
	function(doc){
		return doc.sensor_id == "28-0000053b9dd6";
	}
);

var temperatureStreamAn = dbStream.filter(
	function(doc){
		return doc.sensor_id == "28-0000055d5d12";
	}
);

var desiredTemperatureStream = dbStream.filter(
    function(doc){
        return doc.dev == "desired";
    }
);

var loadPi2Stream = dbStream.filter(
	function(doc){
		return doc.dev == "loadpi2";
	}
);
var loadPi3Stream = dbStream.filter(
	function(doc){
		return doc.dev == "loadpi3";
	}
);
var loadVpsStream = dbStream.filter(
	function(doc){
		return doc.dev == "loadvps";
	}
);

var activeThermStream = dbStream.filter(
	function(doc){
		return doc.dev == "therm_active";
	}
);

// Helper function to map values of db to values to graph.
function mapTemp(doc){
	return {
		x:Math.round(doc.time/1000),
		y:doc.temperature
	};
}

// Helper function to map values of db to values to graph.
function mapLoad(doc){
	return {
		x:Math.round(doc.time/1000),
		y:doc.load1
	};
}

// Helper function to map values of db to values to graph.
function mapDesiredTemp(doc){
	desired = doc.desiredTemperature || 0;
	return {
		x:Math.round(doc.time/1000),
		y:desired
	};
}

function mapThermActive(doc){
	console.log('mapThermActive');
	active = doc.active ? 10 : 0;
	return {
		x:Math.round(doc.time/1000),
		y:active
	};
}

// Create a 24hour graph
var graph = new GraphTile('#graph',viewTemperature_24h.concat(temperatureStream).map(mapTemp),{
	range:range24hours,
	name: 'Elwin woonkamer - 24 uur',
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020',
		strokeWidth : 0,
		renderer: 'area',
		interpolation: 'cardinal'
	},
	graphOptions: graphOptions
});

// graph.addIndependentSerie(
// 	viewDesired_24h.concat(
// 		desiredTemperatureStream
// 	).map(mapDesiredTemp),{
// 		name : 'Gewenste Temperatuur',
// 		data : [],
// 		color : '#610B0B',
// 		renderer: 'line',
// 	}
// );

// graph.addIndependentSerie(viewThermActive_24h.concat(activeThermStream).map(mapThermActive),{
// 	name : 'Thermostaat vragend',
// 	data : [],
// 	color : '#000',
// 	renderer: 'line',
// });

graph.vSetSmooth(1);
graph.vRender();

var graph2 = new GraphTile('#graph2',viewTemperature_60m.concat(temperatureStream).map(mapTemp),{
	range:range60minutes,
	name: 'Elwin woonkamer - 60 minuten',
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020',
		strokeWidth : 0,
		renderer: 'area',
		interpolation: 'cardinal'
	},
	graphOptions: graphOptions
});

// graph2.addIndependentSerie(
// 	viewDesired_60m.concat(
// 		desiredTemperatureStream
// 	).map(mapDesiredTemp),{
// 		name : 'Gewenste Temperatuur',
// 		data : [],
// 		color : '#610B0B',
// 		renderer: 'line'
// 	}
// );

// graph2.addIndependentSerie(viewThermActive_60m.concat(activeThermStream).map(mapThermActive),{
// 	name : 'Thermostaat vragend',
// 	data : [],
// 	color : '#000',
// 	renderer: 'line',
// });

graph2.vSetSmooth(1);
graph2.vRender();

// Create a 24hour graph
var graph3 = new GraphTile('#graph3',viewTemperatureAn_24h.concat(temperatureStreamAn).map(mapTemp),{
	range:range24hours,
	name: 'Annemarie kast - 24 uur',
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020',
		strokeWidth : 0,
		renderer: 'area',
		interpolation: 'cardinal'
	},
	graphOptions: graphOptions
});
graph3.vSetSmooth(4);
graph3.vRender();

var graph4 = new GraphTile('#graph4',viewTemperatureAn_60m.concat(temperatureStreamAn).map(mapTemp),{
	range:range60minutes,
	name: 'Annemarie kast - 60 minuten',
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020',
		strokeWidth : 0,
		renderer: 'area',
		interpolation: 'cardinal'
	},
	graphOptions: graphOptions
});
graph4.vSetSmooth(4);
graph4.vRender();

// Create a 24hour graph
var graph5 = new GraphTile('#graph5',viewLoadPi2_24h.concat(loadPi2Stream).map(mapLoad),{
	range:range24hours,
	name: 'Load Servers - 24 uur',
	serie:{
		name : 'Load pi2',
		data : [],
		color : '#c05020',
		strokeWidth : 0,
		renderer: 'line',
		interpolation: 'cardinal'
	},
	graphOptions: graphOptions
});
graph5.addIndependentSerie(viewLoadPi3_24h.concat(loadPi3Stream).map(mapLoad),{
	name : 'Load pi3',
	data : [],
	color : '#000',
	renderer: 'line',
});
graph5.addIndependentSerie(viewLoadVps_24h.concat(loadVpsStream).map(mapLoad),{
	name : 'Load vps',
	data : [],
	color : '#FF9618',
	renderer: 'line',
});
graph5.vSetSmooth(4);
graph5.vRender();

var number = new LiveKnobNumberTile('#number1',temperatureStream.map(function(doc){return doc.temperature;}),{name:"Elwin",min:0,max:30,step:0.5});
// number.vSetPostText(' &deg;C');

var number2 = new LiveKnobNumberTile('#number2',temperatureStreamAn.map(function(doc){return doc.temperature;}),{name:"Annemarie",min:0,max:30,step:0.5});
// number2.vSetPostText(' &deg;C');

var index = new LiveKnobNumberTile('#indexing',ActiveTasksDataProvider.map(function(data){
	var activeTask = null;
	$.each(data,function(key,task){
		if(task.type == "indexer"){
			if(activeTask === null){
				activeTask = task;
			}
			activeTask = task.progress < activeTask.progress ? task : activeTask ;
		}
	});
	if(activeTask === null)
		return 100;
	return parseFloat(((activeTask.changes_done/activeTask.total_changes)*100).toFixed(1));
}),{
	max:100,
	step:0.1,
	name:"Indexing"
});
index.vSetPostText(' %');

var loginTile = new LoginTile('#login',{
	name: 'Login',
	welcomeText: 'Hello %name%',
});
