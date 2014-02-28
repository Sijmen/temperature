#!/usr/bin/env python2
import time
import couchdb
import pycurl
import os, sys
import json
import threading

# if os.path.dirname(sys.argv[0]):
#	os.chdir(os.path.dirname(sys.argv[0]))
databaseSettings = None
if(os.path.isfile("../db_settings.json")):
	databaseSettings = json.load(open("../db_settings.json"))
if (os.path.isfile("../db_settings.default.json")):
	databaseSettings_default = json.load(open("../db_settings.default.json"))
	if databaseSettings is not None:
		databaseSettings = dict(databaseSettings_default.items() + databaseSettings.items())
	else:
		databaseSettings = databaseSettings_default

if not os.path.isfile("../db_settings.json") and not os.path.isfile("../db_settings.default.json"):
	raise Except('No dabase settings file found. You should have a db_settings.default.json and/or a db_settings.json in the root folder.')

# Merge default settings with user settings. Reduces the need to completely copy
# the entire file, just edit the entries needed. Not tested for recursiveness prob
# just overrides the entire sub dict.
# does not seem to do recusive, see https://stackoverflow.com/questions/3232943

host = str(databaseSettings["host"])
port = str(databaseSettings["port"])
user = str(databaseSettings["user"])
password = str(databaseSettings["password"])
dbname = str(databaseSettings["name"])

couch = couchdb.Server('http://%s:%s' % (host, port))
if user and password:
	couch.resource.credentials = (user, password)
db = couch[dbname]
settings = None
if 'settings_temperature' in db:
	settings = db['settings_temperature']
if 'settings_temperature.default' in db:
	settings_default = db['settings_temperature.default']
	if settings is not None:
		settings = dict(settings_default.items() + settings.items())
	else:
		settings = settings_default

sensors = settings["sensors"]

if settings["options"]["update_index_after_read"]:
	c = pycurl.Curl()
	c.setopt(c.URL, 'http://%s:%s@%s:%s/%s/_design/temperature/_view/time' % (user,password,host,port,dbname))
	c.setopt(c.WRITEFUNCTION, lambda x: None)


def update_temperature(sensorId):
	text = ''
	# Read until the check is successful
	while text.split("\n")[0].find("YES") == -1:
		tfile = open("/sys/bus/w1/devices/%s/w1_slave" % sensorId)
		# Read all of the text in the file.
		text = tfile.read()
		# Close the file now that the text has been read.
		tfile.close()
	# Split the text with new lines (\n) and select the second line.
	secondline = text.split("\n")[1]
	# Split the line into words, referring to the spaces, and select the 10th word (counting from 0).
	temperaturedata = secondline.split(" ")[9]
	# The first two characters are "t=", so get rid of those and convert the temperature from a string to a number.
	temperature = float(temperaturedata[2:])
	# Put the decimal point in the right place and display it.
	temperature = temperature / 1000
	document = {"sensor_id":sensorId,"temperature":temperature,"time":int(round(time.time()*1000))}
	db.save(document)

	if threading.activeCount() == 2 and settings["options"]["update_index_after_read"]:
		c.perform()

while True:
	for sensor in sensors:
		threading.Thread(target=update_temperature, args=(sensor["id"],)).start()
	time.sleep(settings["options"]["read_timeout"])
