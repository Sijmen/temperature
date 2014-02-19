import time
import couchdb
import pycurl
import os, sys
import json

os.chdir(os.path.dirname(sys.argv[0]))

data = json.load(open("settings.json"))
host = str(data["database"]["host"])
port = str(data["database"]["port"])
user = str(data["database"]["user"])
password = str(data["database"]["password"])
dbname = str(data["database"]["name"])
sensors = data["sensors"]

c = pycurl.Curl()
c.setopt(c.URL, 'http://' + user + ':' + password + '@' + host + ':' + port + '/' + dbname + '/_design/temperature/_view/time') 
c.setopt(c.WRITEFUNCTION, lambda x: None)

couch = couchdb.Server('http://' + host + ':' + port)
db = couch[dbname]

while True:
	for sensor in sensors:
		print sensor["id"]
		text = ''
		# Read until the check is successful
		while text.split("\n")[0].find("YES") == -1:
			tfile = open("/sys/bus/w1/devices/%s/w1_slave" % sensor["id"])
			# Read all of the text in the file.
			text = tfile.read()
			# Close the file now that the text has been read.
			tfile.close()
			time.sleep(1)
		# Split the text with new lines (\n) and select the second line.
		secondline = text.split("\n")[1]
		# Split the line into words, referring to the spaces, and select the 10th word (counting from 0).
		temperaturedata = secondline.split(" ")[9]
		# The first two characters are "t=", so get rid of those and convert the temperature from a string to a number.
		temperature = float(temperaturedata[2:])
		# Put the decimal point in the right place and display it.
		temperature = temperature / 1000
		document = {"sensor_id":sensor["id"],"temperature":temperature,"time":int(round(time.time()*1000))}
		db.save(document)
	c.perform()
	time.sleep(25)