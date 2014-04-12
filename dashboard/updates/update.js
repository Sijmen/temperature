function update(doc,request){
    var ddoc = this;

    // initiating response (redirect)
    response = {};
    response.code = 200;

    form = request.form;
    if (form.active !== undefined) {
        // parse to Boolean
        form.active = (form.active === 'true');
    }
    if (form.desiredTemperature) {
        // if valid number inserted and >= 4.5
        if (!isNaN(form.desiredTemperature) && form.desiredTemperature >= 4.5) {
            parsedDt = parseFloat(form.desiredTemperature);
        } else {
            parsedDt = 4.5;
        }
        form.desiredTemperature = parsedDt;
    }

    if (doc === null) {
        doc = {};
    }

    for (var i in form) {
        doc[i] = form[i];
    }
    response.body = JSON.stringify(doc);

    return [doc, response];
}