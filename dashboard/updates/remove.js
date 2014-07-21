function(doc,request){
    doc["_deleted"] = true;

    response = {};
    response.code = 301;
    response.body = "Document: "+doc._id + " removed";
    response.headers = {};
    response.headers.Location = "/";

    return [doc,response];
}
