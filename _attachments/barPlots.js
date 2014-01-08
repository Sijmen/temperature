//requires jquery.couch.js
function BarPlot(elementID,oDB,sDesign){
    if(typeof sDesign !== 'string')
        sDesign = 'meterstand';
    if($.type(oDB) !== 'object')
        oDB = $.couch.oDB('_db');
    //if elementID is not a string, we use the default id.
    if(typeof elementID !== 'string')
        elementID = 'barPlot';
    elementID = elementID;
    //init the chart
    var chart = new google.visualization.ColumnChart(document.getElementById(elementID));
    //make graphData a private variable so we can use it easily within functions
    var graphData;
    //lowest key value for couchdb.
    var iLowestStartKey = 0;
    //highest key value for couchdb.
    var sHighestEndKey = "\u9999";
    //init the default options for the bar graph.
    var oBarOptions = {bar:{groupWidth:"90%"}};

    /**
    * Clean the graph data. All data currently in the DataTable will be lost
    * and a completely new table will be created. Use with care :)
    */
    function vCleanGraphData(sLabel){
        if(typeof sLabel === 'undefined')
            sLabel = 'kWh';
        graphData = new google.visualization.DataTable();
        graphData.addColumn('datetime', 'Date');
        graphData.addColumn('number', sLabel);
    }
    /**
    * Draw a chart of all years available. There curently is no limit
    * available for this functions. If there are two years. Two bars are drawn
    * if there are 10 years, 10 bars will be drawn
    */
    this.vDrawYearChart = function(){
        aStartkey = [iLowestStartKey,iLowestStartKey,iLowestStartKey,iLowestStartKey];
        aEndkey = [sHighestEndKey,sHighestEndKey,sHighestEndKey,sHighestEndKey];
        vLoadYearMonthDay(aStartkey,aEndkey,1,false);
    };

    /**
    * Draw a barplot for a year. Each bar represents a month.
    * The year in the DateObject will be used to determine which
    * year will be drawn.
    */
    this.vDrawMonthChartForYear = function(oDate){
        iYear = oDate.getFullYear();
        aValues = [];
        aStartkey = [iYear,iLowestStartKey,iLowestStartKey,iLowestStartKey];
        aEndkey = [iYear,sHighestEndKey,sHighestEndKey,sHighestEndKey];
        vLoadYearMonthDay(aStartkey,aEndkey,2,true);
    };

    /**
    * Draw a barplot for a month. Each bar represents a day
    * The year and the month in the Dateobject will be used
    * to determine which month will be drawn.
    */
    this.vDrawDayChartForMonth = function(oDate){
        iYear = oDate.getFullYear();
        iMonth = oDate.getMonth();
        aStartkey = [iYear,iMonth,iLowestStartKey,iLowestStartKey];
        aEndkey = [iYear,iMonth,sHighestEndKey,sHighestEndKey];
        oBarOptions.hAxis ={format:'dd-MM-yyyy'};
        vLoadYearMonthDay(aStartkey,aEndkey,3,true);
        // console.log(oBarOptions);
    };
    /**
    * Draw a barplot for a day. Each bar represents an hour/
    * The year,month and day in the DateObject will be used to
    * determine which day will be drawn.
    */
    this.vDrawHourChartForDay = function(oDate){
        iYear = oDate.getFullYear();
        iMonth = oDate.getMonth();
        iDay = oDate.getDate();
        aStartkey = [iYear,iMonth,iDay,iLowestStartKey];
        aEndkey = [iYear,iMonth,iDay,sHighestEndKey];
        oBarOptions.hAxis = {format:'d MMM HH:mm'};
        vLoadYearMonthDay(aStartkey,aEndkey,4,true);
    };

    /**
    * Helper function to go to the next month view.
    * @param oDate      The reference date. For instance from a DatePicker
    * @return oDate2    The new date that has increased a month. Useful for updating
                        a DatePicker
    */
    // this.oDrawNextMonth = function(oDate){
    //     oDate2 = new Date(new Date(oDate).setMonth(oDate.getMonth()+1));
    //     vDrawDayChartForMonth(oDate2);
    //     return oDate2;
    // };

    /**
    * Helper function to go to the previous month view.
    * @param oDate      The reference date. For instance from a DatePicker
    * @return oDate2    The new date that has decreased a month. Useful for updating
                        a DatePicker
    */
    // this.oDrawPreviousMonth = function(oDate){
    //     oDate2 = new Date(new Date(oDate).setMonth(oDate.getMonth()-1));
    //     vDrawDayChartForMonth(oDate2);
    //     return oDate2;
    // };

    /**
    * Draw a barplot for a period defined by a start and an end date.
    * The grainularity can be defined by the iGroupLevel param.
    * @param oStartDate     The start date of the range
    * @param oEndDate       The end date of the range
    * @param iGroupLevel    A value from 1 to 4 to define the granularity.
    *                       1 has bars of a year wide.
    *                       2 has bars of a month wide.
    *                       3 has bars of a day wide.
    *                       4 has bars of an hour wide.
    */
    this.vDrawRange = function(oStartDate,oEndDate,iGroupLevel){
        aStartkey = [iLowestStartKey,iLowestStartKey,iLowestStartKey,iLowestStartKey,iLowestStartKey];
        aEndkey = [sHighestEndKey,sHighestEndKey,sHighestEndKey,sHighestEndKey,sHighestEndKey];
        oBarOptions.hAxis = oBarOptions.hAxis || {};
        oBarOptions.hAxis.viewWindow = oBarOptions.hAxis.viewWindow  || {};
        var bAverage = false;
        //draw the default bar chart. aka group values and plot kWh.
        if(iGroupLevel >= 1){
            aStartkey[0] = oStartDate.getFullYear();
            aEndkey[0] = oEndDate.getFullYear();
            sFormat = 'yyyy';
        }
        if(iGroupLevel >= 2){
            aStartkey[1] = oStartDate.getMonth();
            aEndkey[1] = oEndDate.getMonth();
            sFormat = 'MM-yyyy';
        }
        if(iGroupLevel >= 3){
            aStartkey[2] = oStartDate.getDate();
            aEndkey[2] = oEndDate.getDate();
            sFormat = 'dd-MM-yyyy';
        }
        if(iGroupLevel >= 4){
            aStartkey[3] = oStartDate.getHours();
            aEndkey[3] = oEndDate.getHours();
            sFormat ='dd-MM HH:mm';
        }
        if(iGroupLevel >= 5){
            aStartkey[4] = oStartDate.getMinutes();
            aEndkey[4] = oEndDate.getMinutes();
            sFormat = 'HH:mm:ss';
            bAverage = true;
        }
        // if(oStartDate >= oEndDate)
        //     oEndDate.setDate(oStartDate.getTime()+86400000);
        //replacement for vSetBarOptions() as we have a start
        //and an enddate already.
        oBarOptions.hAxis.viewWindowMode = 'explicit';
        // oBarOptions.hAxis.format = sFormat;
        oBarOptions.hAxis.viewWindow.min = oStartDate;
        oBarOptions.hAxis.viewWindow.max = oEndDate;
        // oBarOptions.hAxis.maxValue = oEndDate;
        // console.log(oBarOptions);
        oBarOptions.title = "Van "+ oStartDate.toLocaleDateString() + " tot " + oEndDate.toLocaleDateString();
        vLoadYearMonthDay(aStartkey,aEndkey,iGroupLevel,false,bAverage);
    };

    this.vDrawRangeWatt = function(oStartDate,oEndDate){
        if(oStartDate >= oEndDate)
            oEndDate.setDate(oStartDate.getTime()+86400000);
        oBarOptions.hAxis = oBarOptions.hAxis || {};
        oBarOptions.hAxis.viewWindow = oBarOptions.hAxis.viewWindow  || {};
        oBarOptions.hAxis.viewWindow.min = oStartDate;
        oBarOptions.hAxis.viewWindow.max = oEndDate;
        oBarOptions.hAxis.maxValue = oEndDate;
        vLoadUnixTimestamp(oStartDate,oEndDate);

    };

    this.vSetOptions = function(oExtraOptions){
        oBarOptions = $.extend(true,oBarOptions, oExtraOptions);
    };
    //create a barplot for a period of 52 weeks.
    this.vDrawWeekChartForYear = function(iYear){

    };

    //create a barplot for a month in weeks
    this.vDrawWeekChartForMonth = function(oDate){
    };
    //create a barplot in days for a week.
    this.vDrawDayChartForWeek = function(oDate){

    };
    this.vSetGraphType = function(sType){
        switch(sType){
            case 'bar':
                chart = new google.visualization.ColumnChart(document.getElementById(elementID));
            break;
            case 'line':
                chart = new google.visualization.LineChart(document.getElementById(elementID));
                oBarOptions.curveType = "function";
            break;
            default:
                chart = new google.visualization.ColumnChart(document.getElementById(elementID));

        }
    };
    /**
    * Draw an empty graph for design purposes.
    * if it is not drawn it takes no space by default.
    */
    this.vDrawEmpty = function(){
        vCleanGraphData();
        oBarOptions.hAxis = oBarOptions.hAxis || {};
        oBarOptions.hAxis.viewWindow = oBarOptions.hAxis.viewWindow  || {};
        oStartDate = new Date();
        oEndDate = new Date(oStartDate.getTime()+86400000);
        oBarOptions.hAxis.viewWindow.min = oStartDate;
        oBarOptions.hAxis.viewWindow.max = oEndDate;
        chart.draw(graphData,oBarOptions);
    };
    /**
    * Helper function to set up bar options. It is based
    * on a single date, and depending on the group level expands
    * this to the view required. This function does NOT accomodate
    * the vDrawRange function!
    * @param aStartKey The start key for the query to couchdb
    * @param iGroupLevel    The group level as in vDrawRange and
                            vLoadYearMonthDay.
                            1 = not allowed
                            2 = width of a month (1 to 12)
                            3 = width of a day (1 to 31)
                            4 = width of an hour (1 to 23)
    */
    function vSetBarOptions(aStartkey,iGroupLevel){
        oBarOptions.hAxis = oBarOptions.hAxis || {};
        oBarOptions.hAxis.viewWindow = oBarOptions.hAxis.viewWindow  || {};
        oBarOptions.hAxis.gridlines = oBarOptions.hAxis.gridlines  || {};
        switch(iGroupLevel){
            case 1:
                //let it be automatic for years (for now)
                return;
            case 2:
                oStartDate = new Date(aStartkey[0],0);
                oEndDate = new Date(aStartkey[0],12);
                oBarOptions.hAxis.gridlines.count = 12;
                // oBarOptions.hAxis.title = "Month";
                break;
            case 3:
                oStartDate = new Date(aStartkey[0],aStartkey[1],1);
                oEndDate = new Date(aStartkey[0],aStartkey[1]+1,0);
                // console.log(oStartDate);
                // console.log(oEndDate);
                oBarOptions.hAxis.gridlines.count = oEndDate.getDate();
                // oBarOptions.hAxis.title = "Day of the month";
                break;
            case 4:
                oStartDate = new Date(aStartkey[0],aStartkey[1],aStartkey[2],0);
                oEndDate = new Date(aStartkey[0],aStartkey[1],aStartkey[2],24);
                oBarOptions.hAxis.gridlines.count = 24;
                // oBarOptions.hAxis.title = "Hour of the day";
                break;
        }
        // console.log(iGroupLevel);
        // oBarOptions.hAxis.maxValue = oEndDate;
        // console.log(oBarOptions);
        oBarOptions.hAxis.viewWindowMode = 'explicit';
        oBarOptions.hAxis.viewWindow.min = oStartDate;
        oBarOptions.hAxis.viewWindow.max = oEndDate;
    }
    //draw all values of the current hour.
    this.vDrawHourAllValues = function(oDate){
        oStartDate = new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDate(),oDate.getHours());
        oEndDate = new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDate(),oDate.getHours()+1);
        vLoadUnixTimestamp(oStartDate,oEndDate);
    };
    //draw the previous sixty minutes
    this.vDrawSixtyMinutesAllValues = function(oDate){
        oStartDate = new Date(oDate.getTime()-60*60*1000);
        oEndDate = oDate;
        oBarOptions.hAxis = oBarOptions.hAxis|{};
        oBarOptions.hAxis = {format:'HH:mm'};
        vLoadUnixTimestamp(oStartDate,oEndDate);
    };

    /**
    * This loads the data from CouchDB and creates in its succes function
    * the graph. So basically this is where 'the magic happens'.
    * @ param aStartkey     The start key for CouchDB, like [year,month,dayofmonth,hour,minute]
    * @ param aEndKey       The end key for CouchDB, like [year,month,dayofmonth,hour,minute]
    * @ param iGrouplevel   The group level. If it is 2, CouchDB returns [year,month]
                            as key instead of [year,month,dayofmonth,hour,minute]
    * @ param bCreateOptions    If true, the options are created by the vSetBarOptions.
    */
    function vLoadYearMonthDay(aStartkey,aEndkey,iGroupLevel,bCreateOptions,bTakeAverage){
            if(bCreateOptions)
                vSetBarOptions(aStartkey,iGroupLevel);
            chart = new google.visualization.ColumnChart(document.getElementById(elementID));
            oDB.view(sDesign + "/year_month_day", {
            group_level:iGroupLevel,
            startkey:aStartkey,
            endkey:aEndkey,
            reduce:true,
            group:true,
            success : function(data) {
                // console.log(data);
                vCleanGraphData();
                if(bTakeAverage)
                    vCleanGraphData('watt (gemiddeld)');
                $.each(data.rows,function(key,value){
                    if(value.key.length < 4){
                        if(value.key.length == 1)
                            oDate = new Date(value.key[0],0,1);
                        else{
                            value.key[1]++;
                            oDate = new Date(value.key);
                        }
                    }
                    else{
                        if(value.key.length == 4)
                            oDate = new Date(value.key[0],value.key[1],value.key[2],value.key[3]);
                        else if(value.key.length == 5)
                            oDate = new Date(value.key[0],value.key[1],value.key[2],value.key[3],value.key[4]);

                    }
                    var iValue;
                    if(bTakeAverage)
                        iValue = (value.value.sumkw*1000)/value.value.total;
                    else
                        iValue = value.value.total/1000;
                    // console.log(iValue);
                    graphData.addRows([[oDate,iValue]]);

                });
                var elem = $('#'+elementID).html('');
                // console.log(elem);
                // elem.html('');
                // console.log("drawing graph");
                // console.log(oBarOptions);
                // console.log(elementID);
                // console.log(chart);
                chart.draw(graphData,oBarOptions);
            },
            error : function(status,request,error){
                $('#'+elementID).html('<div class="alert alert-error"><strong>Er is helaas iets fout gegaan: </strong>'+error+"</div>");
            }
        });
    }

    function vLoadUnixTimestamp(oStartDate,oEndDate){
        iLast = Math.round(oStartDate.getTime()/1000);
        iNow = Math.round(oEndDate.getTime()/1000);
        chart = new google.visualization.LineChart(document.getElementById(elementID));
        oBarOptions.curveType = "function";
        oDB.view(sDesign + "/time", {
            startkey:iLast,
            endkey:iNow,
            reduce:false,
            update_seq : true,
            success : function(data) {
                vCleanGraphData('watt');
                iLastChange = data.last_seq;
                $.each(data.rows,function(key,value){
                    graphData.addRows([[new Date(value.key*1000),Math.round(value.value.watt)]]);
                });
                $('#'+elementID).html('');
                chart.draw(graphData,oBarOptions);
            }
        });
    }
}