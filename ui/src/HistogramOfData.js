import React, { Component } from 'react'
import './App.css';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Chart from "react-google-charts";
import { render } from "react-dom";
import ToggleDisplay from 'react-toggle-display';


export class HistogramOfData extends Component {

  constructor(props) {
    super(props)

    this.state = {
      logfiledata: [],
      datetimeFrom: '',
      datetimeUntil: '',
      phrase: '',
      histogramData: [['DateTime', 'Counts']],
      isChartDataNotEmpty: false
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
    this.setState({ phrase: e.target.value });
  }
  getData(data){
    return Promise.all([this.getHistogramData(data)]);
  }
  async getHistogramData(data) {
    // axios.post('/api/histogram', data).then(response => {
    //   console.log("Success!! histogram " + JSON.stringify(response.data.histogram));
    //   this.setState({
    //     logfiledata: response.data.histogram,
    //     isChartDataNotEmpty: true
    //   });
    // });
    const requestMetadata = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    return fetch('/api/histogram', requestMetadata).then((res) => res.json());
      // .then(
      //   (result) => {
      //     console.log("histoData: "+JSON.stringify(result));
      //     this.setState({
      //       isChartDataNotEmpty: true,
      //       logfiledata: result.histogram
      //     });
      //   },
      //   // Note: it's important to handle errors here
      //   // instead of a catch() block so that we don't swallow
      //   // exceptions from actual bugs in components.
      //   (error) => {
      //     this.setState({
      //       isChartDataNotEmpty: false,
      //       error
      //     });
      //   }
      // )
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
    if(data.datetimeFrom !== "Invalid date" && data.datetimeUntil !== "Invalid date" && data.phrase !== "undefined") {
    this.getData(data).then((result) =>{

      histogramArray = result[0].histogram;

      for (var i = 0; i < histogramArray.length; i++) {
        
        dataArray.push([histogramArray[i].datetime, histogramArray[i].counts]);
      }
      this.setState({
        histogramData: dataArray,
        isChartDataNotEmpty: true
      });
 
    });
  } else {
    alert("Please fillup all fields")
  }
  }

  render() {
    return (
      <div>
        <br/>
      <h4 className="col-sm-4">To plot histogram of log please enter date from, until and the Phrase. eg: ERROR, INFO etc.</h4>
      <br/>
        <form onSubmit={this.onsubmit}>
          <div className="row hdr">
            <div className="col-sm-3 form-group">
              <DatePicker className="form-control"
                selected={this.state.datetimeFrom} placeholderText="Date From" showPopperArrow={false}
                onChange={this.datetimeFrom}
              />
            </div>
            <div className="col-sm-3 form-group">
              <DatePicker className="form-control"
                selected={this.state.datetimeUntil} placeholderText="Date Until" showPopperArrow={false}
                onChange={this.datetimeUntil}
              />
            </div>
            <div className="col-sm-3 form-group">
              <input type="text" className="form-control" placeholder="Please Enter the Phrase"
                onChange={this.textChangeHandler} />
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
        <ToggleDisplay show = {this.state.isChartDataNotEmpty} >
        <div style={{ marginLeft:'100px', marginRight:'20px', display: 'flex', maxWidth: 'flex' }}>
          <Chart
            width={'100%'}
            height={500}
            chartType="ColumnChart"
            loader = {<div>Loading Chart</div>}
            data = {this.state.histogramData}
            options = {{
              title: 'Linux Log of phrase: ' + this.state.phrase,
              chartArea: { width: '95%' },
              hAxis: {
                title: 'Date Time'
      
              },
              vAxis: {
                title: 'Phrase Count',
              },
            }}
            legendToggle
          />
        </div>
        </ToggleDisplay>
      </div>
    )
  }
}

export default HistogramOfData
