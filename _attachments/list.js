function(head,req){
    provides('json', function() {
        ddoc = this;
        now = new Date().getTime();
        now = Math.round(now/1000);
        numDocs = 0;
        var iNumberOfmsInHour = 3600*1000;
        skip = Number(req.query.skip);
        limit = Number(req.query.limit);
        timeStepSec = 60;
        iImp_kWh = 1000;
        values = [];
        doc = {};
        doc.counter = 0;
        while ((row = getRow()) && numDocs < 5) {
          if(typeof row.value !== 'undefined' && typeof row.value.unix_time !== 'undefined'){
             if(now-timeStepSec*(numDocs+1) < row.value.unix_time){
                doc.counter++;
             }
             else{
              doc.microseconds = 0;
              iNumberOfmsBetweenFlash = ((now-timeStepSec*(numDocs)) - (now-timeStepSec*(numDocs+1)))/doc.counter;
              doc.unix_time = now-timeStepSec*(numDocs+1);
              var fTotalKw = iNumberOfmsInHour / (iNumberOfmsBetweenFlash*iImp_kWh);
              doc.value = fTotalKw*1000;
              values.push(doc);
              numDocs++;
              doc = {};
              doc.counter = 1;
             }
           }
        }
    return JSON.stringify(values);
    });
}
