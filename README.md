# scala-play-react-logfileparser

### Let's get started,

* Fork or clone this repository.

## FOR LOG file 
		* In project root directory there is a log file "linuxLogFile.log"
		* At end of the application.conf file (location: scala-play-react-logfileparser/conf/application.conf) need to put the file path of LogFile
		* in this log file data is available only for 13-03-2021 and 14-03-2021 and phrase can be INFO, ERROR or anything for the log file.
		* new set of log can be added just need to follow the format  "dateTime, message"

* Used any of the following [SBT](http://www.scala-sbt.org/) commands which will intern trigger frontend associated npm scripts.

```
    sbt clean           # Clean existing build artifacts

    sbt stage           # Build your application from your project’s source directory

    sbt run             # Run the backend
	
	npm start           # Run the frontend

