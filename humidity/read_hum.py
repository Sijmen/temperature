#!/usr/bin/env python 
import subprocess,re,time,couchdb
couch_server_url = "http://localhost:8080/"
dbname="temperature"
couch = couchdb.Server(couch_server_url);
db = couch[dbname]


while True:
  (out,err) = subprocess.Popen(["./Adafruit_DHT","11","22"], stdout=subprocess.PIPE).communicate()
  temp = re.search('Temp = ([0-9]{1,2})',out)
  if temp is not None:
    temp = temp.group(1)
    hum =  re.search('Hum = ([0-9]{1,2})',out).group(1)
    document = {"_id":"humidity_"+str(int(round(time.time()*1000))),"dev":"humidity","humidity":hum,"temperature":temp,"time":int(round(time.time()*1000))}
    db.save(document)
    time.sleep(30)
  else:
    time.sleep(7)

