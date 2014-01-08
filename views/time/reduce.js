function(key,values,rereduce){
	if(rereduce){
		sumkw = 0;
		total = 0;
		for(i=0;i<values.length;i++){
			total += values[i].total;
			sumkw += values[i].sumkw;
		}
		return {"sumkw":sumkw,"total":total};
	}
	else{
		sumkw = 0;
		for(i=0;i<values.length;i++){
			sumkw += values[i].kilowatt;
			
		}
		total = values.length;
		return {"sumkw":sumkw,"total":total};
	}
}