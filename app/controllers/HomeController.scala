package controllers

import javax.inject._

import play.api.Configuration
import play.api.libs.json._
import play.api.mvc._
import models.LogData
import models.Histogram
import models.RequestObject

@Singleton
class HomeController @Inject()(config: Configuration, cc: ControllerComponents) extends AbstractController(cc) {

  
val logFilePath: String = config.get[String]("logFilePath")

  def getStatus = Action {
    Ok(Json.obj("status" -> "ok"))
  }

  def getSize = Action {
    // println("FilePath: "+logFilePath)
    Ok(Json.obj("size" -> LogData.getLogFileSize(logFilePath)))
  }

  def getDataFromLogFile = Action(parse.json) { implicit request: Request[JsValue] =>
    val datetimeFrom = (request.body \ "datetimeFrom").as[String]
    val datetimeUntil = (request.body \ "datetimeUntil").as[String]
    val phrase = (request.body \ "phrase").as[String]

    // println("FilePath: "+logFilePath)
    val getLogFileData = LogData.getLogFileData(logFilePath, datetimeFrom, datetimeUntil, phrase)

    println("getLogFileData: " + Json.toJson(getLogFileData))
    Ok(Json.obj("data" -> getLogFileData,
      "datetimeFrom" -> datetimeFrom,
      "datetimeUntil" -> datetimeUntil,
      "phrase" -> phrase))
  }

  implicit val histogramFormat: OFormat[Histogram] = Json.format[Histogram]

  def getHistogram = Action(parse.json) { implicit request: Request[JsValue] =>

    val datetimeFrom = (request.body \ "datetimeFrom").as[String]
    val datetimeUntil = (request.body \ "datetimeUntil").as[String]
    val phrase = (request.body \ "phrase").as[String]

    // println("FilePath: "+logFilePath)
    val getHistogramData = LogData.getHistogramData(logFilePath, datetimeFrom, datetimeUntil, phrase)

    Ok(Json.obj("histogram" -> getHistogramData,
      "datetimeFrom" -> datetimeFrom,
      "datetimeUntil" -> datetimeUntil,
      "phrase" -> phrase))
  }


}
