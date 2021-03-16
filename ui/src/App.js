import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import reactLogo from './images/react.svg';
import playLogo from './images/play.svg';
import scalaLogo from './images/scala.svg';
import Client from "./Client";
import SearchData from "./SearchData";

import './App.css';
import HistogramOfData from "./HistogramOfData";

const Tech = ({match}) => {
  return <div><h2>Current Route: {match.params.tech}</h2></div>
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {title: ''};
  }

  async componentDidMount() {
    Client.getStatus(response => {
      this.setState({
        title: response.status
      });
    });
    Client.getSize(response => {
      this.setState({
        fileSize: response.size
      });
    });
  }

  render() {
    return (
      <Router>
        <div className="App" style={{overflow: "visible", height: "100%"}}>
          <div className="row">
            <div className="col-sm-5 btn btn-info">
              <h1>Log File Reader</h1>
            </div>
            <div className="col-sm-4 btn btn-info">
              <h1>Status: {this.state.title}</h1>
            </div>
            <div className="col-sm-3 btn btn-info">
              <h1>FileSize: {this.state.fileSize}</h1>
            </div>
          </div>
          <br/>
          <SearchData/>

          {/*<nav>*/}
            {/*<Link to="scala">*/}
              {/*<img width="400" height="400" src={scalaLogo} alt="Scala Logo"/>*/}
            {/*</Link>*/}
            {/*<Link to="play">*/}
              {/*<img width="400" height="400" src={playLogo} alt="Play Framework Logo"/>*/}
            {/*</Link>*/}
            {/*<Link to="react">*/}
              {/*<img width="400" height="400" src={reactLogo} alt="React Logo"/>*/}
            {/*</Link>*/}
          {/*</nav>*/}
          {/*<Route path="/:tech" component={Tech}/>*/}

          <HistogramOfData/>
        </div>
      </Router>
    );
  }
}

export default App;
