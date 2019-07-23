import React from 'react';
import './Navigation.css';
import DropZone from '../DropZone/DropZone'
import ListOfVariables from '../ListOfVariables/ListOfVariables'
import Papa from 'papaparse';
import 'data-forge-fs';
import * as dataForge from 'data-forge';
// import { readFile, Series, DataFrame } from 'Data-forge';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';





// import * as d3 from "d3";
// import Data from "../Data/sample_data.csv";


class Navigation extends React.Component {
  // constructor called before component is mounted
  // local state && bind events
  // must do super(props)
  constructor(props) {
    super(props);
    this.state = {
      currentStep : {
        "uploadStep" : "uploadStep",
        "choosingVariableStep" : "choosingVariableStep",
        "visualizationStep" : "visualizationStep",
      }
    };
  }


  async componentWillReceiveProps(nextProps) {
    if ( this.props !== nextProps && nextProps.newStep) {
      // console.log("receiving props in chartByProvider "+ nextProps);
      // this.createBarChart(nextProps.wholeData);
      this.setState({currentStep: nextProps.newStep});
    }
  }




  componentDidMount() {
  }

  componentWillMount() {
  }


  componentDidUpdate(){

  }



  render() {
    return (
      <div>
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item"><a className="page-link" href="#">Previous</a></li>
            <li className="page-item"><a className="page-link" href="#">Upload File</a></li>
            <li className="page-item"><a className="page-link" href="#">Choose a Variable</a></li>
            <li className="page-item"><a className="page-link" href="#">Visualization</a></li>
            <li className="page-item"><a className="page-link" href="#">Next</a></li>
          </ul>
        </nav>

      </div>
    );
  }




}

export default Navigation;