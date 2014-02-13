function(doc){

	if(doc.dev)
		emit([doc.dev,doc.time],{data:doc.data});
	else if(doc.sensor_id)
		emit([doc.sensor_id,doc.time],{data:{temperature:doc.temperature}});
}
