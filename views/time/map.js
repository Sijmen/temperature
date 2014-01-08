function(doc){
	emit(doc.time,{temp:doc.temperature});
}
