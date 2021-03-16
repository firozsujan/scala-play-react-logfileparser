import React, {Component} from 'react'
import './App.css';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Chart from "react-google-charts";
import { render } from "react-dom";


export class HistogramOfData extends Component {

  constructor(props) {
    super(props)

    this.state = {
      logfiledata: [],
      datetimeFrom: '',
      datetimeUntil: '',
      phrase: '',
      histogramData: ''
    }

  }
  datetimeFrom = (e) => {
    // e =  moment(e).format('YYYY-MM-DD')
    this.setState({
      datetimeFrom: e
    });
  };
  datetimeUntil = (e) => {
    // e =  moment(e).format('YYYY-MM-DD')
    this.setState({
      datetimeUntil: e
    });
  };
  textChangeHandler = (e) => {
    this.setState({phrase: e.target.value});
  }
  async getData(data){
     axios.post('/api/histogram', data).then(response => {
      console.log("Success!! histogram " + JSON.stringify(response.data.histogram));
      this.setState({
        logfiledata: response.data.histogram
      });
    });
  }
  onsubmit = (e) => {
    debugger;
    const data = {
      datetimeFrom: moment(this.state.datetimeFrom).format('YYYY-MM-DD'),
      datetimeUntil: moment(this.state.datetimeUntil).format('YYYY-MM-DD'),
      phrase: this.state.phrase
    };
    e.preventDefault();
    var dataArray = [['DateTime', 'Counts']];
    var histogramArray = [];

    this.getData(data);

    console.log("Success!! logfiledata " + JSON.stringify(this.state.logfiledata));
    histogramArray = this.state.logfiledata;
    for(var i=0; i< histogramArray.length; i++){
      console.log("Success!! histogram " + JSON.stringify(histogramArray));
      dataArray.push([histogramArray[i].datetime, histogramArray[i].counts]);
    }

    this.histogramData = dataArray;

    console.log("Histogram: "+JSON.stringify(this.histogramData));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onsubmit}>
          <div className="row hdr">
            <div className="col-sm-3 form-group">
              <DatePicker className="form-control"
                          selected={this.state.datetimeFrom} placeholderText="Select Date" showPopperArrow={false}
                          onChange={this.datetimeFrom}
              />
            </div>
            <div className="col-sm-3 form-group">
              <DatePicker className="form-control"
                          selected={this.state.datetimeUntil} placeholderText="Select Date" showPopperArrow={false}
                          onChange={this.datetimeUntil}
              />
            </div>
            <div className="col-sm-3 form-group">
              <input type="text" className="form-control" placeholder="Please Enter the Phrase"
                     onChange={this.textChangeHandler}/>
            </div>
            <div className="col-sm-3 form-group">
              <button type="submit" className="btn btn-success">Show Histogram</button>
            </div>
          </div>
        </form>

        {/*<div className="col-md-6">*/}
          {/*<div id="chart_div" className="chart" style={{width: '100%', minHeight: '450px',}}>*/}
          {/*</div>*/}
        {/*</div>*/}

        <div style={{display: 'flex', maxWidth: 'flex'}}>
        <Chart
        width={800}
        height={300}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={this.histogramData}
        options={{
        title: 'Linux Log of ' + this.phrase,
        chartArea: {width: '80%'},
        hAxis: {
        title: 'Date Time',
        minValue: 0,
        },
        vAxis: {
        title: 'Phrase Count',
        },
        }}
        legendToggle
        />
        </div>
      </div>
    )
  }


  // loadGoogle() {
  //   google.charts.load("visualization", "1", {
  //     callback: this.drawChart,
  //     packages: ['corechart']
  //   });
  // }
  //   drawChart = (logfileData) => {
  //     var data2 = [[]];
  //     data2.push(logfileData.forEach([logData.datetime, logData.counts]));
  //     //   [
  //     //   ['DateTime', 'Counts'],
  //     //   ['2004', 400],
  //     //   ['2005', 460],
  //     //   ['2006', 1120],
  //     //   ['2007', 1030]
  //     // ];
  //
  //     var options = {
  //       title: 'Log data Histogram',
  //       hAxis: {title: 'Date Time', titleTextStyle: {color: 'red'}},
  //       vAxis: {title: 'Phrase Counts', titleTextStyle: {color: 'red'}}
  //     };
  //
  //     var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
  //     chart.draw(data, options);
  //   }
}

export default HistogramOfData
