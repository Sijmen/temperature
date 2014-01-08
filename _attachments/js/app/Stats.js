function Stats(sElementID,oDB,sDesign){
    if(typeof sDesign !== 'string')
        sDesign = 'temperature';
    if($.type(oDB) !== 'object')
        oDB = $.couch.oDB('_db');
    //if elementID is not a string, we use the default id.
    if(typeof elementID !== 'string')
        elementID = 'barPlot';
    elementID = elementID;

	this.iGetTotal = function(fCallBack){

	}

	this.iGetToday = function(fCallBack){

	}	

	this.iGetLast24Hours = function(fCallBack){

	}

    function vLoadYearMonthDay(aStartkey,aEndkey,fCallBack){
        oDB.view(sDesign + "/year_month_day", {
        startkey:aStartkey,
        endkey:aEndkey,
        reduce:true,
        group:false,
        success : function(data) {
            $.each(data.rows,function(key,value){

            });
        },
        error : function(status,request,error){
            $('#'+sElementID).html('<div class="alert alert-error"><strong>Er is helaas iets fout gegaan: </strong>'+error+"</div>");
        }
    });
}
}
