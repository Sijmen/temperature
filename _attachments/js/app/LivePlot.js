function LivePlot(elementID,oDB,iTimeSpan,sDesign){
    // var path = unescape(document.location.pathname).split('/'),
    if(typeof sDesign !== 'string')
        sDesign = 'meterstand';
    if($.type(oDB) !== 'object')
        oDB = $.couch.oDB('_db');
    if(typeof elementID !== 'string')
        elementID = 'livePlot';
    elementID = elementID;
    var oChart = new google.visualization.LineChart(document.getElementById(elementID));
    var oDataTable = new google.visualization.DataTable();
    var oDataView;
    var sLabel = 'Temperature (C)'
    var oDataOptions;
    var graphData;
    var bChangesRunning = false;
    var bContinue = true;
    var iLastChange = 0;
    var bDrawGauge = false;
    var sGaugeElementId = "gauge";
    var oGaugeOptions = {};
    var oGaugeData = {};
    var oChangeHandler = {};
    if(typeof iTimeSpan === 'undefined')
      iTimeSpan = 300;
    iTimeSpan = iTimeSpan*1000;
    
    this.vStart = function(){
      init();
    };

    this.vStop = function(){
        if(!$.isEmptyObject(oChangeHandler))
            oChangeHandler.stop();
    };

    this.vSetTimeSpan = function(oSmallDate, oLargeDate){
        iTimeSpan = Math.round((oLargeDate - oSmallDate));
    };

    this.vSetTimeSpanSeconds = function(iSeconds){
      iTimeSpan = iSeconds*1000;
    };

    this.vSetOptions = function(oOptions){
        oDataOptions = oOptions;
    };

    this.vSetGaugeId = function(sGaugeId){
        sGaugeElementId = sGaugeId;
        oGauge = new google.visualization.Gauge(document.getElementById(sGaugeElementId));

    };

    this.vSetGauge = function(bGauge){
      bDrawGauge = bGauge;
      oGaugeData = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Temperature (C)',0]
        ]);
      oGauge = new google.visualization.Gauge(document.getElementById(sGaugeElementId));
    };

    this.vSetGaugOptions = function(oOptions){
        oGaugeOptions = oOptions;
    };

    function init(){
      iNow = new Date().getTime();
      iNow = Math.round(iNow);
      iLast = iNow - iTimeSpan;
      oDataTable = new google.visualization.DataTable();
      oDataTable.addColumn('datetime', 'Date');
      oDataTable.addColumn('number', sLabel);
      oDataView = new google.visualization.DataView(oDataTable);
      oDB.view(sDesign + "/time", {
            startkey:iLast,
            endkey:iNow,
            reduce:false,
            update_seq : true,
            success : function(data) {
                // console.log(data);
                iLastChange = data.last_seq;
                $.each(data.rows,function(key,value){
                    oDataTable.addRows([[new Date(value.key),value.value.temp]]);
                });
                $('#'+elementID).html('');
                vDrawLineChart();
                vSetupChanges(iLastChange);
            }
        });
    }

    function drawItems(resp) {
        if(typeof resp !== 'undefined'){
            $.each(resp.results,function(key,value){
                if( typeof value.doc !== 'undefined' && 
                    typeof value.doc.time !== 'undefined') 
                {
                    vReceiveResult(value.doc);
                }
            });
            iLastChange = resp.last_seq;
            vSetupChanges(resp.last_seq);
        }
        else{
            vSetupChanges(0);
        }
    }

    function vSetupChanges(since) {
        if (!bChangesRunning) {
            oChangeHandler = oDB.changes(since,{include_docs:true});
            bChangesRunning = true;
            oChangeHandler.onChange(drawItems);
        }
    }

    function vReceiveResult(doc){
        iDate = doc.time;
        oDataTable.addRows([[new Date(iDate),(doc.temperature)]]);
        if(bDrawGauge){
            vDrawGauge(doc);
        }
        vDrawLineChart();
    }

     function vDrawLineChart(){
        iNow = new Date().getTime();
        iLast = iNow - iTimeSpan;
        aFilter = [{column: 0, minValue: new Date(iLast), maxValue: new Date(iNow)}];
        oDataView.setRows(oDataTable.getFilteredRows(aFilter));
        oDataOptions.hAxis = {format:'HH:mm'};
        oChart.draw(oDataView,oDataOptions);
    }

    function vDrawGauge(oDoc){
        oGaugeData.setValue(0,1,Math.round(oDoc.temperature));
        oGauge.draw(oGaugeData,oGaugeOptions);
    }
}
