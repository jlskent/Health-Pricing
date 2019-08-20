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
import About from '../About/About';

import {Nav,Navbar} from 'react-bootstrap';

import ChartByProcedure from '../ChartByProcedure/ChartByProcedure';
// import Nav from "react-bootstrap/es/Nav";
// import {Link} from "react-router-dom";
// import {Nav} from "react-bootstrap";

import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

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
      dfToCompare:null,
      dfList: [],
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

      procedure_Graph_Data: null,


    // currentStep : null,
      // steps: null

    };
    this.baseState = this.state;

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


  clearData(){
    this.setState(this.baseState);
    this.setState({ currentStep : 'uploadFile'});

  }


  componentDidMount() {


  }



  // called before render, do not access dom
  componentWillMount() {


    // set default currentStep
    this.setState({ currentStep : 'uploadFile'});
  }



  // helper function for parseData
  updateData(result) {



    // console.log("result list " );
    //all the Data uploaded in array

    var data = result.data;
    var cols = result.data[0];
    console.log("Provider" + JSON.stringify(cols));
    // console.log("reading columns" + cols);



    // conventions :
    // ["FIN_DIV_DISPLAY_NAME","FIN_SUBDIV_DISPLAY_NAME","ORIG_SERVICE_DATE","BILLING_PROV_NM","CPT_CODE","PROC_CODE","PROC_NAME","PROCQTY","Charges","Payments","Adjustments","Balance","ORIG_FIN_CLASS","CURRENT_FIN_CLASS"]

    // console.log("reading columns" + cols);

    for (let i = 0; i < cols.length; i++) {
      if (cols[i] === "Provider"){  cols[i] = "BILLING_PROV_NM";  }
      if (cols[i] === "Charge"){  cols[i] = "Charges";  }
      if (cols[i] === "Pays"){  cols[i] = "Payments";  }
      if (cols[i] === "Adjs"){  cols[i] = "Adjustments";  }
      if (cols[i] === "CPT codes"){  cols[i] = "CPT_CODE";  }
      if (cols[i] === "Description"){  cols[i] = "PROC_NAME";  }
      if (cols[i] === "Units"){  cols[i] = "PROCQTY";  }
      if (cols[i] === "WU Code"){  cols[i] = "PROC_CODE";  }

      if (cols[i] === "Medicare Code"){  cols[i] = "CPT_CODE";  }

    }




    this.setState({theData: data});
    this.setState({columns: cols});
    var rightDf = new dataForge.DataFrame({
      columnNames: cols,
      rows: data
    });
    this.setState({df: rightDf});






    console.log("res" + JSON.stringify(cols));

    //if we have multiple file, we push it to dfList(same effect)

    // this.setState(prevState => ({
    //   dfList: [...prevState.dfList, rightDf]
    // }));

    // this.setState(prevState => ({
    //   dfList: prevState.dfList.concat(rightDf)
    // }));

    //to the beginning
    this.setState(prevState => ({
      dfList: [rightDf, ...prevState.dfList]
    }));


    console.log("*Upload component df list len" + this.state.dfList.length)
    // var data2 = result[1].data;
    // var cols2 = result[1].data[0];
    // this.setState({theData: data2});
    // this.setState({columns: cols2});
    // var rightDf2 = new dataForge.DataFrame({
    //   columnNames: cols2,
    //   rows: data2
    // });
    // this.setState({dfToCompare: rightDf2});



    //all the columns uploaded


    // specify column names

    //console.log("rightdf "+ rightDf);

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
          <div className="pin-bottom">
            <div>
              <i className="small material-icons" >info_outline</i>
              <p className= "small_text">To upload, click on the area and select file or simply drop file. To compare different data sets, upload multiple files.</p>
            </div>
            <div>
              <i className="small material-icons">info_outline</i>
              <p className= "small_text">After the file names show up, click continue button to proceed to next step.</p>
            </div>
            <div>
              <i className="small material-icons">info_outline</i>
              <p className= "small_text">Before start, please read disclaimer of data security in About page</p>


            </div>
          </div>

        </div>
      );



    }






    else if (this.state.currentStep === 'chooseVariable'){
      return (
        <div>
          {this.renderNavigationSteps()}
          {/*<ListOfVariables {...this.state}  setCurrentStep={this.setCurrentStep} dfToUse = {this.state.dfList[0]}/>*/}
          <ListOfVariables {...this.state}  setCurrentStep={this.setCurrentStep} />

        </div>
      );
    }


    else{
    return (
        <div>
          {this.renderNavigationSteps()}
          <ListOfVariables {...this.state}  setCurrentStep={this.setCurrentStep}/>
          {/*<ChartByProcedure procedure_Graph_Data = {this.state.procedure_Graph_Data}></ChartByProcedure>*/}
        </div>
      );
    }


  }






  renderActions() {
    if (this.state.uploadSuccess) {
      // console.log('uploadSuccess');
      return (
        <div>
          <button className="btn btn-outline-primary btn-lg btn-block" onClick={() => this.clearData()}>Clear</button>
          {/*pass state to child component*/}
        </div>
      );
    } else {
      return (
        <button className="btn btn-outline-primary btn-lg btn-block" disabled={this.state.files.length < 0 || this.state.uploading} onClick={this.uploadFiles}>Continue</button>
      );
    }
  }



  onFilesAdded(files) {
    // if (this.state.files.length === 3) return;

    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }));


    // if (this.state.files!=null){
    //   this.setState({theFile: this.state.files[0]});
    //
    // }
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
      // Papa.parse(file, {
      //   download: true,
      //   complete: this.updateData
      // });


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