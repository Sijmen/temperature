function(doc){
	emit([
		new Date(doc.time).getFullYear(),
		new Date(doc.time).getMonth(),
		new Date(doc.time).getDate(),
		new Date(doc.time).getHours(),
		new Date(doc.time).getMinutes()
	],{
		temp:doc.temperature
	});
}
