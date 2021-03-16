import React, {Component} from 'react'
import './App.css';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import ToggleDisplay from 'react-toggle-display';


export class SearchData extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logfiledata: [],
      datetimeFrom: '',
      datetimeUntil: '',
      isTableNotEmpty: false
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
    e.preventDefault();
    this.setState({phrase: e.target.value});
  }

  onsubmit = (e) => {
    debugger;
    const data = {
      datetimeFrom: moment(this.state.datetimeFrom).format('YYYY-MM-DD'),
      datetimeUntil: moment(this.state.datetimeUntil).format('YYYY-MM-DD'),
      phrase: this.state.phrase
    };
   e.preventDefault();
   console.log("Success!!" + JSON.stringify(data));
   
   console.log("Success!!" + JSON.stringify(data.phrase));

    if(data.datetimeFrom !== "Invalid date" && data.datetimeUntil !== "Invalid date" && data.phrase !== "undefined"){
    axios.post('/api/data', data).then(response => {
      console.log("Success!!" + JSON.stringify(response.data));
      this.setState({
        logfiledata: response.data.data,
        isTableNotEmpty: true 
      });
    });
  } else {
    alert("Please fillup all fields")
  }
  }

  render() {
    return (
    
    <div>
        <h4 className="col-sm-4">To search log please enter date from and date until and the Phrase. eg: ERROR, INFO etc.</h4>
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
                     onChange={this.textChangeHandler}/>
            </div>
            <div className="col-sm-3 form-group">
              <button type="submit" className="btn btn-success">Search</button>
            </div>
          </div>
        </form>
        
        <ToggleDisplay show = {this.state.isTableNotEmpty} >
        <table className="table" >
          <thead className="thead-dark">
          <tr>
            <th scope="col">DateTime</th>
            <th scope="col">Message</th>
          </tr>
          </thead>
          <tbody>
          {
          this.state.logfiledata.map((p, index) => {
          return  <tr key={index}>
          <td>{p.datetime}</td>
          <td>{p.message}</td>
          </tr>
          })
          }
          </tbody>
        </table></ToggleDisplay>
      </div>
    )
  }
}

export default SearchData
