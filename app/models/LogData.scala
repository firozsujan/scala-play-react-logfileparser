package models

import java.time.LocalDateTime

import scala.io.Source
import scala.collection._
import scala.collection.mutable.ArrayBuffer
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import org.joda.time.Days
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._

case class HighlightText(fromPosition: Int, toPosition: Int)

case class LogData(datetime: String = "2021-01-01", message: String = "successful phrase!", highlightText: Seq[HighlightText])

case class LogDataLine(datetime: String = "2021-01-01", message: String = "successful phrase!")

case class Histogram(datetime: String, counts: Int)

object LogData {

  implicit val format: OFormat[LogData] = {
    // Need to define instance for the subtypes (no auto-materialization)
    implicit def one = Json.format[HighlightText]

    implicit def two = Json.format[LogDataLine]

    Json.format[LogData]
  }

  implicit val histogramFormat: OFormat[Histogram] = Json.format[Histogram]

  def reads(jv: JsValue): JsResult[LogData] = {
    implicit val highlightText: Reads[HighlightText] = (
      (JsPath \ "fromPosition").read[Int] and
        (JsPath \ "toPosition").read[Int]
      ) (HighlightText.apply _)

    implicit val logDataReads: Reads[LogData] = (
      (JsPath \ "datetime").read[String] and
        (JsPath \ "message").read[String] and
        (JsPath \ "highlightText").read[Seq[HighlightText]]
      ) (LogData.apply _)

    var json = {}

    JsSuccess(jv.as[LogData])
  }

  /**
    * get log line count
    *
    * @return
    */
  def showLogCount: Int = {
    val scalaFileContents = Source.fromFile("D:\\task\\eclipse\\pro\\scala-play-react-logfileparser\\linuxLogFile.log").getLines()

    scalaFileContents.length
  }

  /**
    * get log file size
    *
    * @return
    */
  def getLogFileSize(logFilePath: String): String = {
    import java.io.File
    val logFile = new File(logFilePath)
    logFile.length.toString()
  }

  /**
    * get log by date and phrase
    *
    * @param datetimeFrom
    * @param datetimeUntil
    * @param phrase
    * @return
    */
  def getLogFileData(logFilePath: String, datetimeFrom: String, datetimeUntil: String, phrase: String): ArrayBuffer[LogData] = {

    val logLines = Source.fromFile(logFilePath).getLines()

    val logDataLines = ArrayBuffer[LogDataLine]()
    for (logLine <- logLines) {
      val logDataSplited: Array[String] = logLine.split(",")
      logDataLines += LogDataLine(logDataSplited(0), logDataSplited(1))
    }

    var isCountinusDate: Boolean = false

    var startDate = LocalDate.parse(datetimeFrom)
    var endDate = LocalDate.parse(datetimeUntil)
    val dateRange = ChronoUnit.DAYS.between(startDate, endDate)
    println("DateRange: " + dateRange)

    var dates: Array[String] = Array()

    for (day <- 0 to dateRange.toInt) {
      println("Days: " + startDate)
      dates = dates :+ startDate.toString
      startDate = startDate.plusDays(1)

    }
    var highlightTextFromPosition: Int = 0
    var highlightTextToPosition: Int = 0

    var highlightTexts = ArrayBuffer[HighlightText]()
    var logDatas = ArrayBuffer[LogData]()
    //    var logDatas = mutable.MutableList[LogData]()
    var dateTimeLogData: String = ""
    var messageLogData: String = ""
    var position: Int = 0

    for (logDataLine <- logDataLines) {
      println("inside loop")
      for (i <- 0 to dateRange.toInt if (logDataLine.datetime.contains(dates(i)))) {
        println("Date inside loop2: " + dates(i))
        println("Date in the Line: " + logDataLine.datetime)
        println(logDataLine.datetime.contains(dates(i)))
        if (logDataLine.message.contains(phrase)) {
          println("1st if")
          if (!isCountinusDate) {
            println("2nd if")
            highlightTextFromPosition = position
            dateTimeLogData = logDataLine.datetime
            messageLogData = logDataLine.message
            println("dateTimeLogData: " + dateTimeLogData)
            println("messageLogData: " + messageLogData)
          }
          isCountinusDate = true
        } else {
          println("1st else")
          if (!"".equalsIgnoreCase(dateTimeLogData) && !"".equalsIgnoreCase(messageLogData)) {
            println("3rd if")
            isCountinusDate = false
            highlightTextToPosition = position - 1
            highlightTexts += new HighlightText(highlightTextFromPosition, highlightTextToPosition)

            logDatas += new LogData(dateTimeLogData, messageLogData, highlightTexts)
            dateTimeLogData = ""
            messageLogData = ""
          }
        }
      }

      position += 1
    }
    //    println(Json.toJson(logDatas))
    logDatas
  }

  /**
    * get the Histogram Data from the Log file
    * @param datetimeFrom
    * @param datetimeUntil
    * @param phrase
    * @return
    */
  def getHistogramData(logFilePath: String, datetimeFrom: String, datetimeUntil: String, phrase: String): ArrayBuffer[Histogram] = {

    val logLines = Source.fromFile(logFilePath).getLines()

    val logDataLines = ArrayBuffer[LogDataLine]()

    for (logLine <- logLines) {
      val logDataSplited: Array[String] = logLine.split(",")
      logDataLines += LogDataLine(logDataSplited(0), logDataSplited(1))
    }

    var isCountinusDate: Boolean = false
    var startDate = LocalDate.parse(datetimeFrom)
    var endDate = LocalDate.parse(datetimeUntil)
    //get date count between dates
    val dateRange = ChronoUnit.DAYS.between(startDate, endDate)
    println("DateRange: " + dateRange)

    var dates: Array[String] = Array()

    for (day <- 0 to dateRange.toInt) {
      println("Days: " + startDate)
      dates = dates :+ startDate.toString
      startDate = startDate.plusDays(1)
    }
    var counts: Int = 0
    var histograms = ArrayBuffer[Histogram]()

    var dateTimeLogData: String = ""
    var messageLogData: String = ""
    var position: Int = 0

    for (logDataLine <- logDataLines) {
      for (i <- 0 to dateRange.toInt if (logDataLine.datetime.contains(dates(i)))) {
        if (logDataLine.message.contains(phrase)) {
          counts += 1
          if (!isCountinusDate) {
            dateTimeLogData = logDataLine.datetime
            println("dateTimeLogData: " + dateTimeLogData)
          }
          isCountinusDate = true
        } else {
          if (!"".equalsIgnoreCase(dateTimeLogData)) {
            isCountinusDate = false
            histograms += new Histogram(dateTimeLogData, counts)

            dateTimeLogData = ""
            counts = 0
          }
        }
      }

      position += 1
    }
        println("Histograms: "+Json.toJson(histograms))
    histograms
  }
}
