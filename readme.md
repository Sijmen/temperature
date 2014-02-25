# Temperature reading Raspberry Pi
##Requirements
 * Couchdb installed
 * basic knowledge of Couchdb
 * Python lib to access couchdb `sudo pip install couchdb`
 * and DS18B20

##Usage
 Copy `settings.default.json` to `settings.json` and edit to match your sensor id's and database settings.
 `(sudo) python read.py`
 Then go to your local couchdb installation to `db/_design/temperature/index.html` or create your own rewrite rules. Rewrite your db to your db name to keep things working.
