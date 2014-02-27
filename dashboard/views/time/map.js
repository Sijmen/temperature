function(doc){
	if(doc.time){
		var dev;
		var time = doc.time;
		var data = {};
		if(doc.dev){
			dev = doc.dev;
			if(doc.data){
				data = doc.data;
				data.time = time;
			}
			else{
				data = doc;
			}
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
