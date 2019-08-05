
// import DropZone from '../DropZone/DropZone'
// import ListOfVariables from '../ListOfVariables/ListOfVariables'
// import Papa from 'papaparse';
// import * as dataForge from 'data-forge';
// import { readFile, Series, DataFrame } from 'Data-forge';
// import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


import React from 'react';
import './Navigation.css';
// import 'data-forge-fs';
// import Stepper from 'react-stepper-horizontal';
// import StepZilla from "react-stepzilla";


import * as d3 from "d3";
// import Data from "../Data/sample_data.csv";
import Step from "./Step"
// import { MDBContainer, MDBStepper, MDBStep, MDBIcon } from "mdbreact";

import Stepper from 'bs-stepper'
import 'bs-stepper/dist/css/bs-stepper.min.css';


class Navigation extends React.Component {
  // constructor called before component is mounted
  // local state && bind events
  // must do super(props)
  constructor(props) {
    super(props);
    this.state = {
      currentStep : 'uploadFile'
    //     uploadFile : "uploadFile",
    //     "choosingVariableStep" : "choosingVariableStep",
    //     "visualizationStep" : "visualizationStep",
      }
    this.step = this.step.bind(this);

  };


  // }
  // this.onFilesAdded = this.onFilesAdded.bind(this);


  async componentWillReceiveProps(nextProps) {
    if ( this.props !== nextProps && nextProps.newStep) {
      // console.log("receiving props in chartByProvider "+ nextProps);
      // this.createBarChart(nextProps.wholeData);
      this.setState({currentStep: nextProps.newStep});

      this.step(nextProps.newStep);
      console.log(nextProps.newStep)

    }
  }



  componentDidMount() {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
  }



  // componentDidUpdate() {
    // if (this.state.currentStep){
    //   this.handleClick(this.state.currentStep);
    // }

  // }


  // called before render, do not access dom
  componentWillMount() {
    // for plug in but not using anymore



    //
    // const theSteps =
    // [
    // {title: 'Upload',
    //   number: '1',
    // },
    // {title: 'Choose Variable',
    //   number: '2',
    //   },
    // {title: 'Visualization',
    //   number: '3',
    //
    // }
    //
    // ];
    // this.setState({ steps : theSteps});



    // set default currentStep
  }




  step(e){
    if (e === 'uploadFile') {
      this.stepper.to(1)
    }
    if (e === 'chooseVariable') {
      this.stepper.to(2)
    }
    if (e === 'generateGraph') {
      this.stepper.to(3)
    }
  }


  handleClick(e){
    // this.props.setCurrentStep(e.target.value);
    // console.log("e " + e.target.value)


    if (e === 'uploadFile') {
      this.stepper.to(1)
    }
    if (e === 'chooseVariable') {
      this.stepper.to(2)
    }
    if (e === 'generateGraph') {
      this.stepper.to(3)
    }

    // console.log("e " + e);
    this.props.setCurrentStep(e);

  }






  render() {


    return (
      <div>


        <div id="stepper1" className="bs-stepper">
          <div className="bs-stepper-header">
            <div className="step" data-target="#test-l-1">
              <button className="step-trigger" value = 'test' onClick={()=>this.handleClick('uploadFile')}>
                <span className="bs-stepper-circle">1</span>
                <span className="bs-stepper-label">Upload a file</span>
              </button>
            </div>
            <div className="line"></div>
            <div className="step" data-target="#test-l-2">
              <button className="step-trigger" value = 'test' onClick={()=>this.handleClick('chooseVariable')}>
                <span className="bs-stepper-circle">2</span>
                <span className="bs-stepper-label">Choose variable</span>
              </button>
            </div>
            <div className="line"></div>
            <div className="step" data-target="#test-l-3">
              <button className="step-trigger" value = 'test' onClick={()=>this.handleClick('generateGraph')}>
                <span className="bs-stepper-circle">3</span>
                <span className="bs-stepper-label">Visualization & compare</span>
              </button>
            </div>
          </div>
          <div className="bs-stepper-content">
            <form onSubmit={this.onSubmit}>
              <div id="test-l-1" className="content">
                {/*<button className="btn btn-primary" onClick={() => this.stepper.next()}>Next</button>*/}
              </div>
              <div id="test-l-2" className="content">
                {/*<button className="btn btn-primary" onClick={() => this.stepper.next()}>Next</button>*/}
              </div>
              <div id="test-l-3" className="content text-center">
                {/*<button className="btn btn-primary" onClick={() => this.stepper.next()}>Next</button>*/}
              </div>
            </form>
          </div>
        </div>



          {/*<nav aria-label="Page navigation example">*/}
          {/*<ul className="pagination justify-content-center">*/}
            {/*<li className="page-item">*/}
              {/*<Step currentStep = {this.props.currentStep} label = 'uploadFile' id ='0'/>*/}
              {/*<button className="list-group-item list-group-item-action" value="uploadFile" onClick={(e)=>this.handleClick(e)}>Upload a file</button>*/}
            {/*</li>*/}
            {/*<li className="page-item">*/}
              {/*<Step currentStep = {this.props.currentStep} label = 'chooseVariable' id ='1'/>*/}
              {/*<button className="list-group-item list-group-item-action" value="chooseVariable" onClick={(e)=>this.handleClick(e)}>Choose variable</button>*/}
            {/*</li>*/}
            {/*<li className="page-item">*/}
              {/*<Step currentStep = {this.props.currentStep} label = 'generateGraph' id ='2'/>*/}
              {/*<button className="list-group-item list-group-item-action" value="generateGraph" onClick={(e)=>this.handleClick(e)}>Visualization & compare</button>*/}
            {/*</li>*/}
          {/*</ul>*/}
        {/*</nav>*/}

      </div>
    );
  }




}

export default Navigation;