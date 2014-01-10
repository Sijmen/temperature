// Apache 2.0 J Chris Anderson 2011
$(function() {
    // google.load('visualization', '1.0', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.setOnLoadCallback(init);
    var dataTable;
    var gaugeData;
    var lineChart;

    var path = unescape(document.location.pathname).split('/');
    var oDB;
    var bDebug = false;
    if(bDebug)
        oDB = $.couch.db('_db',{},'http://thuis.familiehoogendijk.nl');
    else
        oDB = $.couch.db('temperature');
    var months = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
    var receivedData = Array();
    var previousDoc;
    var gauge;
    var historyChart;
    var barPlot = new BarPlot('history_chart_div',oDB,'temperature');
    barPlot.vSetGraphType('line');
    var livePlot = new LivePlot('chart_div',oDB,3600*24,'temperature');
    var generalOptions = {
                            curveType: "function",
                            height:300,
                            // width:"90%",
                            chartArea:{
                            //     top:0,
                            //     left:50,
                                height:250
                            //     width:700
                            },

//                            vAxis: {minValue: 0},

                            fontName:"\"Helvetica Neue\", Helvetica, Arial, sans-serif"
                        };

      var gaugeOptions = {
        min: 0,
        max: 100,
        yellowFrom: 30,
        yellowTo: 50,
        redFrom: 50,
        redTo: 100,
        minorTicks: 5,
        width:150,
        height:150,
        animation:{
            easing:'out',
            duration: 800
        }};
        //add listener to select box
    $('#graph_type').change(function(){
        drawBarPlot();
    });

    $('ul.nav li a').click(function(){
        onPageSwitch($(this).attr('href'));
    });

    function onPageSwitch(sPage){
        switch(sPage){
            case '#overview':
                // livePlot.vStop();
                $('#gauge').hide();
                $('#datetime_select').hide();
                var hourPlot = new BarPlot('hour_div',oDB,'temperature');
                var dayPlot = new BarPlot('day_div',oDB,'temperature');
                var monthPlot = new BarPlot('month_div',oDB,'temperature');
                vSetLoad($('#hour_div'));
                vSetLoad($('#day_div'));
                vSetLoad($('#month_div'));
                today = new Date();

                generalOptions.title = today.getDate()+" "+months[today.getMonth()]+" per uur";
                dayPlot.vSetOptions(generalOptions);
                dayPlot.vDrawHourChartForDay(new Date());
                dayPlot.vSetGraphType('line');

                generalOptions.title = "Afgelopen 60 minuten";
                hourPlot.vSetOptions(generalOptions);
                hourPlot.vSetGraphType('line');
                hourPlot.vDrawSixtyMinutesAllValues(new Date());

                generalOptions.title = "Huidige maand";
                monthPlot.vSetOptions(generalOptions);
                monthPlot.vSetGraphType('line');
                monthPlot.vDrawDayChartForMonth(new Date());
                generalOptions.title = "";
                break;
            case '#chart_div':
                $('#gauge').show();
                $('#datetime_select').hide();
                // livePlot.vStart();
                break;
            case '#history':
                // livePlot.vStop();
                vSetLoad($('#history_chart_div'));
                generalOptions.title = "Huidige maand";
                barPlot.vSetOptions(generalOptions);
                // barPlot.vDrawHourChartForDay(new Date());
                barPlot.vDrawDayChartForMonth(new Date());
                $('#gauge').hide();
                $('#datetime_select').show();
                // barPlot.vDrawEmpty();
                break;
        }
    }


    function init(){
        // barPlot.vSetGraphType('line');
        $('#datetime_select').hide();
        generalOptions.title = "Live";
        livePlot.vSetOptions(generalOptions);
        livePlot.vStart();
        livePlot.vSetGauge(true);
        livePlot.vSetGaugOptions(gaugeOptions);
        generalOptions.title = "";
        initDatePickers();
    }

    function vSetLoad(oDOMelem){
        oDOMelem.html('<div class="loader" style="margin-left:auto; margin-right:auto; width:32px;"><img src="ajax-loader.gif"></div>');
    }

    var startDateTextBox = $('#datepickerstart');
    var endDateTextBox = $('#datepickerend');
    function initDatePickers(){

        startDateTextBox.datetimepicker({
            onClose: function(dateText, inst) {
                if (endDateTextBox.val() !== '') {
                    var testStartDate = startDateTextBox.datetimepicker('getDate');
                    var testEndDate = endDateTextBox.datetimepicker('getDate');
                    if (testStartDate > testEndDate)
                        endDateTextBox.datetimepicker('setDate', testStartDate);
                }
                else {
                    endDateTextBox.val(dateText);
                }
                drawBarPlot();
            },
            onSelect: function (selectedDateTime){
                endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );
            }
        });
        endDateTextBox.datetimepicker({
            onClose: function(dateText, inst) {
                if (startDateTextBox.val() !== '') {
                    var testStartDate = startDateTextBox.datetimepicker('getDate');
                    var testEndDate = endDateTextBox.datetimepicker('getDate');
                    if (testStartDate > testEndDate)
                        startDateTextBox.datetimepicker('setDate', testEndDate);
                }
                else {
                    startDateTextBox.val(dateText);
                }
                drawBarPlot();
            },
            onSelect: function (selectedDateTime){
                startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
            }
        });
    }

    function oGetDates(){
        oStartDate = new Date(startDateTextBox.val());
        oEndDate = new Date(endDateTextBox.val());
        if(oStartDate >= oEndDate)
            oEndDate.setDate(oStartDate.getTime()+86400000);
        return {oStartDate:oStartDate,oEndDate:oEndDate};
    }

    function drawBarPlot(){
        sType = $('#graph_type').val();
        oDates = oGetDates();
        var iGroupLevel = parseInt(sType,10);

        if(iGroupLevel > 0)
            vSetLoad($('#history_chart_div'));
        if(iGroupLevel >= 6){
            barPlot.vDrawRangeWatt(oDates.oStartDate,oDates.oEndDate);
        }
        else if(iGroupLevel > 0)
            barPlot.vDrawRange(oDates.oStartDate,oDates.oEndDate,iGroupLevel);
        // else
            // alert('Kies een resolutie uit.');
    }
 });
