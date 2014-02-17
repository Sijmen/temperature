$oDB = $.couch.db('temperature');
var tempData = new TemperatureDataProvider($oDB,{
	filter:'temperature/measurement',
	view:"temperature",
	sensor_id:"28-0000053bccc5"
});
var graph = new MultiGraphTile('#graph',tempData,{
	range:{
		min:(new Date()).getTime()-24*60*60*1000,
		max:(new Date()).getTime()
	},
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020'
	},
	name:'24 uur'
});
// graph.vAddSerie(tempData.oFilter({graph:{y:"temperature",x:"time"}}),{
// 	range:{
// 		min:(new Date()).getTime()-24*60*60*1000,
// 		max:(new Date()).getTime()
// 	},
// 	serie:{
// 		name : 'Temperatuur',
// 		data : [],
// 		color : '#c25222'
// 	}
// });
graph.vSetSmooth(12);


var graph2 = new LiveGraphTile('#graph2',tempData,{
	range:{
		min:(new Date()).getTime()-10*60*1000,
		max:(new Date()).getTime()
	},
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020'
	},
	name:'5 minuten'
});

var number = new LiveKnobNumberTile('#number1',tempData,{name:"Laatste waarde"});
number.vSetPostText(' &deg;C');