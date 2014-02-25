# Temperature reading Raspberry Pi
##Requirements
 * Couchdb installed
 * basic knowledge of Couchdb
 * Python lib to access couchdb `sudo pip install couchdb`
 * and DS18B20

##Usage
 `(sudo) python read.py`  
 Then go to your local couchdb installation to `db/_design/temperature/index.html` or create your own rewrite rules. Rewrite your db to your db name to keep things working.

##Dependencies
All dependencies are included. The project depends on:
 * [Jquery](https://github.com/jquery/jquery)
 * [Jquery Knob](https://github.com/aterrien/jQuery-Knob)
 * [Jquery Couchdb](https://github.com/apache/couchdb/blob/635022b27cf72efe82bc30f56393070f2b842615/share/www/script/jquery.couch.js)
 * [Rickshaw Graph](https%3A%2F%2Fgithub.com%2Fshutterstock%2Frickshaw)
 * [RxJs](https://github.com/Reactive-Extensions/RxJS)
 * [Twitter bootstrap](https://github.com/twbs/bootstrap)
