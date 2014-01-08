import time
import couchdb

#settings
server_url = 'http://localhost:8080/'
dbname = 'temperature'

couch = couchdb.Server(server_url)
db = couch[dbname]
sensorids = ["28-0000053bccc5"]
for sensor in sensorids:
        temperatures = []
	while True:
#        for polltime in range(0,3):
		text = ''
		# Read until the check is successful
                while text.split("\n")[0].find("YES") == -1:			
			tfile = open("/sys/bus/w1/devices/%s/w1_slave" % sensor)
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
		document = {"sensor_id":sensor,"temperature":temperature,"time":int(round(time.time()*1000))}
                db.save(document)
                temperatures.append(temperature)
		time.sleep(1)
	

