import React from 'react';
import './Visualization.css';
import ChartA from '../ChartA/ChartA';
import * as d3 from "d3";
import data from '../Data/sample_data.csv';



class Visualization extends React.Component {

  constructor() {
    super(); // inherit parent methods
    this.state = {data : null}
  }

  // load after constructor
  componentDidMount(){
    this.loadData();
    // console.log("visualization " + this.state.data)
  }


  loadData() {
    this.setState({
      data: data
    });
  }


  render() {
    return (
      <div>
        <ChartA data={this.state.data} />
      </div>
    );
  }




}

export default Visualization;