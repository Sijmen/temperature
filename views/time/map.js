function(doc){
	if(doc.time){
		var dev;
		var time = doc.time;
		var data = {};
		if(doc.dev){
			dev = doc.dev;
			data = doc.data;
			data.time = time;
		}
		else if(doc.sensor_id){
			data = {
				temperature:doc.temperature,
				time:time
			};
			dev = doc.sensor_id;
		}
		emit([dev,time],doc);
	}
}
