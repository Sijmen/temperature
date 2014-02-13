/*
 * this filter is created to get only temperature measurements
 * (for changes feed)
 * @pre a doc is a temperature measurement when it has a temperature field
 * @return true when doc is a temperature measurement, else false
 */
function(doc, req){
    return doc.dev == req.query.dev || doc.sensor_id == req.query.dev;
}