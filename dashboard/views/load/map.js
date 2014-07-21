function(doc){
	if(doc.dev && doc.dev == 'load'){
		emit(doc.dev,null);
	}
}
