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


  handleClick(e){
    console.log("e " + e.target.value)
  }

  render() {
    return (
      <div>
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            {/*<li className="page-item"><a className="page-link" value = "upload" onClick={(e)=>this.handleClick(e)}>Upload File</a></li>*/}
            {/*<li className="page-item"><a className="page-link" value = "variable" onClick={(e)=>this.handleClick(e)}>variable</a></li>*/}
            <li className="page-item">
              <button className="list-group-item list-group-item-action" value="upload" onClick={(e)=>this.handleClick(e)}>upload</button>
            </li>

            <li className="page-item">
              <button className="list-group-item list-group-item-action" value="choose" onClick={(e)=>this.handleClick(e)}>choose var</button>
            </li>

            <li className="page-item">
              <button className="list-group-item list-group-item-action" value="visualization" onClick={(e)=>this.handleClick(e)}>visualization</button>
            </li>
            {/*<li className="page-item"><a className="page-link" href="#">Visualization</a></li>*/}
            {/*<li className="page-item"><a className="page-link" href="#">Next</a></li>*/}
          </ul>
        </nav>

      </div>
    );
  }




}

export default Navigation;