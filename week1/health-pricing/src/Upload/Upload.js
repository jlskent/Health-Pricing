// import ChartByProvider from '../ChartByProvider/ChartByProvider';
// import ChartByCpt from '../ChartByCpt/ChartByCpt';
// import TableComponent from '../TableComponent/TableComponent';
// import StepZilla from "react-stepzilla";

import React from 'react';
import './Upload.css';
import DropZone from '../DropZone/DropZone'
import ListOfVariables from '../ListOfVariables/ListOfVariables'
import Papa from 'papaparse';
import 'data-forge-fs';
import * as dataForge from 'data-forge';
import Navigation from '../Navigation/Navigation'


import ChartByProcedure from '../ChartByProcedure/ChartByProcedure';



// parent component of since we receive data here



class Upload extends React.Component {
  // constructor called before component is mounted
  // local state && bind events
  // must do super(props)






  constructor(props) {
    super(props);
    this.state = {
      theData: [],
      columns: [],
      df: null,
      files: [],
      uploading: false,
      uploadProgress: {},
      uploadSuccess: false,

      // this is used for step navigation
      currentStep: {
        uploadFile: 'uploadFile',
        chooseVariable: 'chooseVariable',
        generateGraph: 'generateGraph'

      },

      procedure_Graph_Data: null

    // currentStep : null,
      // steps: null

    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.updateData = this.updateData.bind(this);
    this.updateFunction = this.updateFunction.bind(this);
  }




  setCurrentStep = (someValue) => {
    this.setState({
      currentStep: someValue
    });
  };


  // pass this function to child component so child can modify parent
  // but in the end did not use it, but it it good to keep a code stub in case of use
  updateFunction = (someValue) => {
    this.setState({
      procedure_Graph_Data: someValue
    });
    console.log("passing func")

  };





  componentDidMount() {


  }



  // called before render, do not access dom
  componentWillMount() {
    // for plug in but not using anymore
    // const theSteps =
      // [
        // {name: 'Upload', component: <DropZone onFilesAdded = {this.onFilesAdded} disabled= {this.state.uploading || this.state.uploadSuccess} />},
        // {name: 'Choose Variable', component: < ListOfVariables/>},
        // {name: 'Visualization', component: < ChartByProcedure/>},
        // {name: 'Compare', component: < TableComponent/>},
        // {name: 'Step 4', component: < />},
        // {name: 'Step 5', component: < />}
      // ];
    // this.setState({ steps : theSteps});



    // set default currentStep
    this.setState({ currentStep : 'uploadFile'});
  }



  // helper function for parseData
  updateData(result) {
    //all the Data uploaded in array
    const data = result.data;
    //all the columns uploaded

    const cols = result.data[0];
    this.setState({theData: data});
    this.setState({columns: cols});

    // specify column names
    const rightDf = new dataForge.DataFrame({
      columnNames: cols,
      rows: data
    });
    //console.log("rightdf "+ rightDf);
    this.setState({df: rightDf});
    //console.log("update Data "+ this.state.df);

  }




  renderNavigationSteps(){
    return (
      <div>
        {/*<p>Step Navigation</p>*/}
        <Navigation newStep = {this.state.currentStep} setCurrentStep={this.setCurrentStep}> </Navigation>
      </div>

    );
  }




  // in order to get child component's state, we pass a function as prop to child component

  render() {


    if(this.state.currentStep === 'uploadFile'){
      return (
        <div className="">
          {this.renderNavigationSteps()}

          {/*maybe not use this*/}
          {/*<div className='step-progress'>*/}
          {/*<StepZilla steps={this.state.steps} showSteps = {true} showNavigation = {false} stepsNavigation = {true} stepsNavigation={false} />*/}
          {/*</div>*/}
          <div id = "main">
            <h4>Step 1. Upload a file</h4>
            <div>
              <DropZone onFilesAdded = {this.onFilesAdded} disabled= {this.state.uploading || this.state.uploadSuccess} />
            </div>
            {/*show a list of files*/}
            <div>
              {this.state.files.map(file => {
                return (
                  <div key={file.name} className="Row" id = "fileName">
                    <span className="Filename">{file.name}</span>
                    {/*{this.renderProgress(file)}*/}
                  </div>
                );
              })}
            </div>
            <div id = "button">{this.renderActions()}</div>

          </div>
          {/*<div>*/}
            {/*<ListOfVariables {...this.state}  setCurrentStep={this.setCurrentStep}/>*/}
          {/*</div>*/}

        </div>
      );



    }






    else if (this.state.currentStep === 'chooseVariable'){
      return (
        <div>
          {this.renderNavigationSteps()}
          <ListOfVariables {...this.state}  setCurrentStep={this.setCurrentStep}/>
        </div>
      );
    }


    else{
    return (
        <div>
          {this.renderNavigationSteps()}
          <ListOfVariables {...this.state}  setCurrentStep={this.setCurrentStep}/>
          <ChartByProcedure procedure_Graph_Data = {this.state.procedure_Graph_Data}></ChartByProcedure>
        </div>
      );
    }


  }



  renderActions() {
    if (this.state.uploadSuccess) {
      // console.log('uploadSuccess');
      return (
        <div>
          <button className="btn btn-outline-primary btn-lg btn-block" onClick={() => this.setState({ files: [], uploadSuccess: false })}>Clear</button>
          {/*pass state to child component*/}
        </div>
      );
    } else {
      return (
        <button className="btn btn-outline-primary btn-lg btn-block" disabled={this.state.files.length < 0 || this.state.uploading} onClick={this.uploadFiles}>Upload</button>
      );
    }
  }



  onFilesAdded(files) {
    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }));


    if (this.state.files!=null){
      this.setState({theFile: this.state.files[0]});

    }
  }



  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    this.state.files.forEach(file => {
      promises.push(this.sendRequest(file));

    });
    try {
      await Promise.all(promises);
      this.setState({
        uploadSuccess: true,
        uploading: false

      });

      this.setState({  currentStep : 'chooseVariable'})

    } catch (e) {
      // Not Production ready! Do some error handling here instead...
    }
  }


  sendRequest(file) {
    console.log("list of variable " + file);
    Papa.parse(file, {
      download: true,
      complete: this.updateData
    });
  }





}

export default Upload;