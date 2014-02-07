$oDB = $.couch.db('temperature');
var tempData = new TemperatureDataProvider($oDB,{
	filter:'temperature/measurement',
	view:"temperature"
});
var graph = new GraphTile('#graph',tempData,{
	range:{
		min:(new Date()).getTime()-24*3600*1000,
		max:(new Date()).getTime()
	},
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020'
	}
});
graph.vSetSmooth(12);

var graph2 = new LiveGraphTile('#graph2',tempData,{
	range:{
		min:(new Date()).getTime()-300*1000,
		max:(new Date()).getTime()
	},
	serie:{
		name : 'Temperatuur',
		data : [],
		color : '#c05020'
	}
});

var number = new LiveKnobNumberTile('#number1',tempData);
number.vSetPostText(' &deg;C');