package controllers

import javax.inject._

import play.api.libs.json._
import play.api.mvc._
import models.LogData
import models.Histogram
import models.RequestObject

@Singleton
class HomeController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def appSummary = Action {
    //    Ok(Json.obj("content" -> LogData.showLogCount))
    Ok(Json.obj("content" -> "Ok"))
  }

  def searchData(datetimeFrom: String, datetimeUntil: String) = Action { _ =>
    Ok(Json.obj("datetimeFrom" -> datetimeFrom, "datetimeUntil" -> datetimeUntil))
  }


  def getStatus = Action {
    Ok(Json.obj("status" -> "ok"))
  }

  def getSize = Action {
    Ok(Json.obj("size" -> LogData.getLogFileSize))
  }

  def getDataFromLogFile = Action(parse.json) { implicit request: Request[JsValue] =>
    val datetimeFrom = (request.body \ "datetimeFrom").as[String]
    val datetimeUntil = (request.body \ "datetimeUntil").as[String]
    val phrase = (request.body \ "phrase").as[String]

    val getLogFileData = LogData.getLogFileData(datetimeFrom, datetimeUntil, phrase)

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

    val getHistogramData = LogData.getHistogramData(datetimeFrom, datetimeUntil, phrase)

    //    println("getHistogramData: " + Json.toJson(getHistogramData))

    Ok(Json.obj("histogram" -> getHistogramData,
      "datetimeFrom" -> datetimeFrom,
      "datetimeUntil" -> datetimeUntil,
      "phrase" -> phrase))
  }


}
