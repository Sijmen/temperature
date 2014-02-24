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
	designDoc:"temperature"
};
var baseOptions24h = $.extend({range:range24hours},baseOptions);
var baseOptions60m = $.extend({range:range60minutes},baseOptions);

//Get the historic values
var viewTemperature_24h = Rx.Observable.fromCouchDBView($oDB,$.extend({device:'28-0000053bccc5'},baseOptions24h));
var viewTemperature_60m = Rx.Observable.fromCouchDBView($oDB,$.extend({device:'28-0000053bccc5'},baseOptions60m));
//Create the live stream for one sensor/device
var temperatureStream = dbStream.filter(function(doc){return doc.sensor_id == "28-0000053bccc5";});
// Helper function to map values of db to values to graph.
function mapTemp(doc){
	console.log(doc);
	return {
		x:Math.round(doc.time/1000),
		y:doc.temperature
	};
}

// Create a 24hour graph
var graph = new GraphTile('#graph',viewTemperature_24h.concat(temperatureStream).map(mapTemp),{
	range:range24hours,
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020'
	},
	name:'24 uur'
});
// graph.vAddSerie(viewTemperature_24h_2,{
// 	serie:{
// 		name : 'Temperatuur',
// 		data : [],
// 		color : '#c25222'
// 	}
// });
graph.vSetSmooth(12);
graph.vRender();


var graph2 = new GraphTile('#graph2',viewTemperature_60m.map(mapTemp),{
	range:range60minutes,
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020'
	},
	name:'60 minuten'
});
graph2.vSetSmooth(4);
graph2.vRender();
var number = new LiveKnobNumberTile('#number1',temperatureStream.map(function(doc){return doc.temperature;}),{name:"Laatste waarde",max:30,step:0.5});
number.vSetPostText(' &deg;C');

var index = new LiveKnobNumberTile('#indexing',ActiveTasksDataProvider.map(function(data){
	var activeTask = null;
	$.each(data,function(key,task){
		if(task.type == "indexer")
			if(activeTask === null)
				activeTask = task;
			activeTask = task.progress < activeTask.progress ? task : activeTask ;
	});
	if(activeTask === null)
		return 100;
	return parseFloat(((activeTask.changes_done/activeTask.total_changes)*100).toFixed(1));
}),{
	max:100,
	step:0.1
});
index.vSetPostText(' %');