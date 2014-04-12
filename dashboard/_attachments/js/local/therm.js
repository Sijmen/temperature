var sendDesiredTimer;

// get current desiredTemperature
// @TODO dit kan ook met view
var currentDesiredTemperature;
$.couch.db(DB).openDoc(STATE_DOC_ID, {
    success: function(doc) {
        currentDesiredTemperature = doc.desiredTemperature;
    },
    error: function(status) {
        console.log(status);
    }
});

// view to retrieve latest doc
var viewLatestDesired = Rx.Observable.fromCouchDBView(
    $oDB,
    $.extend(
        {
            device:'desired',
            limit:1,
            endkey:["desired"],
            startkey:["desired", {}],
            descending: true
        },
        baseOptions
    )
);

var desired = new LiveKnobNumberTile(
    '#desiredTemperature',
    viewLatestDesired.takeLast(1).concat(desiredTemperatureStream).map(
        function(doc){
            return doc.desiredTemperature;
        }
    ).throttle(100),
    {
        name:"Gewenst Elwin",
        min:DESIRED_MIN_TEMP,
        max:DESIRED_MAX_TEMP,
        step:DESIRED_STEP,
        readOnly: false,
        'release' : function (v) {
            clearTimeout(sendDesiredTimer);
            sendDesiredTimer = setTimeout(function(){
                sendDesiredTemperatureToCouch(v);
            },POST_TIMEOUT);
        }
        // , format: function(v) {
        //     return v+' C';
        // },
    }
);

sendDesiredTemperatureToCouch = function(desiredTemperature) {
    // save desired temp to global state
    $.ajax({
        type: 'POST',
        url: '/update/'+STATE_DOC_ID,
        dataType: 'json',
        data: {"desiredTemperature":desiredTemperature},
        success: function(result) {
            console.log('success:');
            console.log(result);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Error while trying to save new doc state to db");
            console.log(xhr.status);
            console.log(thrownError);
        }
    });

    // create new document with
    // current time mapped to => current temperature
    // first
    desiredDoc = {
        'dev':'desired',
        'desiredTemperature':currentDesiredTemperature,
        time:new Date().getTime()
    };

    $oDB.saveDoc(desiredDoc, {
        success: function(data) {
            desiredDoc.desiredTemperature = desiredTemperature;
            desiredDoc.time = new Date().getTime();
             $oDB.saveDoc(desiredDoc, {
                success: function(data) {
                    currentDesiredTemperature = desiredTemperature;
                },
                error: function(status) {
                    console.log(status);
                }
            });
        },
        error: function(status) {
            console.log(status);
        }
    });
};