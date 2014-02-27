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

##Dependencies
All dependencies are included. The project depends on:
 * [Jquery](https://github.com/jquery/jquery)
 * [Jquery Knob](https://github.com/aterrien/jQuery-Knob)
 * [Jquery Couchdb](https://github.com/apache/couchdb/blob/635022b27cf72efe82bc30f56393070f2b842615/share/www/script/jquery.couch.js)
 * [Rickshaw Graph](https://github.com/shutterstock/rickshaw)
 * [RxJs](https://github.com/Reactive-Extensions/RxJS)
 * [Twitter bootstrap](https://github.com/twbs/bootstrap)

## Tiles
The program works with tiles, which are capable of displaying information. Below all tiles will be described. All types of tiles are available live, or static.
### Graphs
Graph tiles accept at least one Observable, and more can be added with the 'vAddSerie' function. The initialization of a graphtile accepts options as a last parameter. Among these options are the 'graphOptions' which are the options that Rickshaw Graph accepts. For serie options holds the same, they accept the same options as Rickshaw series.

Currently two Y-axes are not available, but maybe available in the future.

### Numbers
Numbers tiles come in two flavours, with or without a knob. With a knob, they look like a gauge, progressbar or whatever you would like to call it. The number is centered and the bar is around it. The knob is based on JQuery Knob and accepts the same parameters in the options. 

The other flavour is the normal number tile. This only displays the number and on update gives a light flash. This number can have a pre and post text. Like temperature &deg;.
