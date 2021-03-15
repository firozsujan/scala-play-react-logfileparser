package models

import java.time.LocalDateTime

import scala.io.Source
import scala.collection.mutable._
import scala.collection.mutable.ArrayBuffer
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._


case class RequestObject(datetimeFrom: String, datetimeUntil: String, phrase: String)

object RequestObject {
  //  implicit val logDataFormat = Json.format[LogData]
  val requestObjectsBuilder =
    (JsPath \ "datetimeFrom").read[Double] and
      (JsPath \ "long").read[Double]

  implicit val logDataReads = Json.reads[RequestObject]
  implicit val logDataWrites = Json.writes[RequestObject]

  def writes(map: Map[String, Object]): JsValue =
    Json.obj(
      "datetimeFrom" -> map("datetimeFrom").asInstanceOf[String],
      "datetimeUntil" -> map("datetimeUntil").asInstanceOf[String],
      "phrase" -> map("phrase").asInstanceOf[String]
    )

  def reads(jv: JsValue): JsResult[Map[String, Object]] =
    JsSuccess(Map("datetimeFrom" -> (jv \ "datetimeFrom").as[String],
      "datetimeUntil" -> (jv \ "datetimeUntil").as[String], "phrase" -> (jv \ "phrase").as[String]))
}