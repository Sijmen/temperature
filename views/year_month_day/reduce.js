function(key,values,rereduce){
	if(rereduce){
		sumtemp = 0;
		total = 0;
		for(i=0;i<values.length;i++){
			total += values[i].total;
			sumtemp += values[i].sumtemp;
		}
		return {"sumtemp":sumtemp,"total":total};
	}
	else{
		sumtemp = 0;
		for(i=0;i<values.length;i++){
			sumtemp += values[i].temp;
			
		}
		total = values.length;
		return {"sumtemp":sumtemp,"total":total};
	}
}
