#!/usr/bin/env python 
import subprocess,re,time,couchdb,Adafruit_DHT
couch_server_url = "http://localhost:8080/"
dbname="temperature"
couch = couchdb.Server(couch_server_url);
couch.resource.credentials = ("elwin", "meeboschapie2")
db = couch[dbname]

while True:
  humidity, temperature = Adafruit_DHT.read_retry(11, 22)
  if humidity is not None:
    document = {
      "_id":"humidity_"+str(int(round(time.time()*1000))),
      "dev":"humidity",
      "humidity":humidity,
      "temperature":temperature,
      "time":int(round(time.time()*1000))
      }
    db.save(document)
    time.sleep(20)
  else:
    time.sleep(10)

