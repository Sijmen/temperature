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
var viewTemperature_24h = Rx.Observable.fromCouchDBView($oDB,$.extend({device:'28-0000053bccc5'},baseOptions24h));
var viewHumidity_24h = Rx.Observable.fromCouchDBView($oDB,$.extend({device:'humidity'},baseOptions24h));
var viewTemperature_60m = Rx.Observable.fromCouchDBView($oDB,$.extend({device:'28-0000053bccc5'},baseOptions60m));
var viewHumidity_60m = Rx.Observable.fromCouchDBView($oDB,$.extend({device:'humidity'},baseOptions60m));
//Create the live stream for one sensor/device
var temperatureStream = dbStream.filter(function(doc){return doc.sensor_id == "28-0000053bccc5";});
var humidityStream = dbStream.filter(function(doc){return doc.dev == "humidity";});
// Helper function to map values of db to values to graph.
function mapTemp(doc){
	return {
		x:Math.round(doc.time/1000),
		y:doc.temperature
	};
}

function mapHum(doc){
	return {
		x:Math.round(doc.time/1000),
		y:parseInt(doc.humidity)
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
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020'
	},
	name:'24 uur &deg;C'
});
// viewHumidty_24h.concat(humidityStream).map(mapHum).subscribe(function(data){console.log(data);});
// viewTemperature_24h.concat(temperatureStream).map(mapTemp).subscribe(function(data){console.log(data);});
var graph3 = new GraphTile('#graph3',viewHumidity_24h.concat(humidityStream).map(mapHum),{
  name:"Luchtvochtigheid 24 uur",
  range:range24hours,
  serie:{
    name:'Luchtvochtigheid',
    data:[],
    color:'#9c4274',
    renderer: 'line'
  }
});
graph3.vSetSmooth(4);
graph3.vRender();
graph.vSetSmooth(12);
graph.vRender();


var graph2 = new GraphTile('#graph2',viewTemperature_60m.map(mapTemp),{
	range:range60minutes,
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020',
		renderer : 'area'
	},
	name:'&deg;C 60 minuten',
	graphOptions:{
		renderer:'multi',
		min:0
	}
});
graph2.vSetSmooth(4);
// graph2.vAddSerie(viewHumidity_60m.concat(humidityStream).map(mapHum),{name:"Humidity",data:[],color:'#9c4274',renderer:'line'});
graph2.vRender();
var number = new LiveKnobNumberTile('#number1',temperatureStream.map(function(doc){return doc.temperature;}),{name:"Laatste waarde",max:30,step:0.5});
var number2 = new LiveKnobNumberTile('#number2',humidityStream.map(function(doc){return doc.humidity;}),{name:"Laatste waarde",max:100,step:1});
number.vSetPostText(' &deg;C');

var index = new LiveKnobNumberTile('#desiredTemperature',ActiveTasksDataProvider.map(function(data){
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
