import React from 'react';
import './Upload.css';
import DropZone from '../DropZone/DropZone'
import ListOfVariables from '../ListOfVariables/ListOfVariables'
import Papa from 'papaparse';
import 'data-forge-fs';
import * as dataForge from 'data-forge';
import Navigation from '../Navigation/Navigation'
import StepZilla from "react-stepzilla";


import ChartByProcedure from '../ChartByProcedure/ChartByProcedure';
import ChartByProvider from '../ChartByProvider/ChartByProvider';
import ChartByCpt from '../ChartByCpt/ChartByCpt';

import TableComponent from '../TableComponent/TableComponent';


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





  updateFunction = (someValue) => {
    this.setState({
      df: someValue
    });
    console.log("passing func")

  };





  componentDidMount() {


  }

  // called before render, do not access dom
  componentWillMount() {
    const theSteps =
      [
        {name: 'Upload', component: <DropZone onFilesAdded = {this.onFilesAdded} disabled= {this.state.uploading || this.state.uploadSuccess} />},
        {name: 'Choose Variable', component: < ListOfVariables/>},
        {name: 'Visualization', component: < ChartByProcedure/>},
        {name: 'Compare', component: < TableComponent/>},

        // {name: 'Step 4', component: < />},
        // {name: 'Step 5', component: < />}
      ];

    this.setState({ steps : theSteps});



  }

  // take current state and parse csv
  // parseData() {
  //   const file = this.files[0];
  //   console.log("list of variable " + file);
  //   Papa.parse(file, {
  //     download: true,
  //     header: false,
  //     complete: this.updateData
  //   });
  // }


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
    //console.log("rightdf "+ rightDf.getColumnNames());
    this.setState({df: rightDf});
    //console.log("update Data "+ this.state.df);
    // var columnSubset = rightDf.subset(["CPT_CODE", "ORIG_SERVICE_DATE"]);
    //console.log("columnSubset "+ columnSubset);


    // Data forge
    // const df = new dataForge.DataFrame(Data);
    // var columnNames = df.getColumnNames();
    // console.log("columnNames "+ columnNames)
    // console.log("df "+ df)
    // var columnSubset = df.subset(["0", "1", "2", "3"]);
    // console.log("columnSubset "+ columnSubset)
    // columnSubset['index'] = range(1, len(df) + 1)
    // const index = columnSubset.getIndex();
    // console.log("index "+ columnSubset.getIndex());
    // const indexedDf = columnSubset.resetIndex();
    // console.log("indexedDf "+ indexedDf);
    // const filteredDf = df.where(row => row['4'] = 0);
    // console.log("filteredDf "+ filteredDf)
  }









  // in order to get child component's state, we pass a function as prop to child component

  render() {

    return (
      <div className="">
        <Navigation currentStep = {this.props.currentStep}> </Navigation>
        <div className='step-progress'>
          <StepZilla steps={this.state.steps} showSteps = {true} showNavigation = {false} stepsNavigation = {true} stepsNavigation={false} />
        </div>
        <div className="row py-md-4">
            <div className="col-6">
              {/*<DropZone onFilesAdded = {this.onFilesAdded} disabled= {this.state.uploading || this.state.uploadSuccess} />*/}
            </div>
            {/*show a list of files*/}
            <div className="col-6">
              <div className="row h-100">
                <div className="col">
                    {this.state.files.map(file => {
                      return (
                        <div key={file.name} className="Row">
                          <span className="Filename">{file.name}</span>
                          {/*{this.renderProgress(file)}*/}
                        </div>
                      );
                    })}
                </div>
                <div className="col align-self-end">
                  <div className = "">
                  {this.renderActions()}
                  </div>
                </div>
              </div>
            </div>
        </div>
        {/*<div><ListOfVariables {...this.state _onChange={this.onChange}} /></div>*/}
        <div>
          <ListOfVariables {...this.state}  updateFunction={this.updateFunction}/>

        </div>

      </div>
    );
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


  // loadData() {
  //   var Data = this.files;
  //   d3.csv(Data, function(d) {
  //     return {
  //       // provider : d['BILLING_PROV_NM'],
  //       // charge : d['Charges'],
  //       // cptCode : d['CPT_CODE'],
  //     };
  //   }).then(function(Data) {
  //     Data.forEach(function (row) {
  //       // console.log(row);
  //       // we got a row object
  //       // providerArray.push(row.provider);
  //       // chargeArray.push(row.charge);
  //       Data.push(row);
  //       // console.log(Data);
  //     });
  //     // nowDrawTheChart();
  //   });
  // }

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




  //
  // async uploadFiles() {
  //   this.setState({ uploadProgress: {}, uploading: true });
  //   const promises = [];
  //   this.state.files.forEach(file => {
  //     promises.push(this.sendRequest(file));
  //   });
  //   try {
  //     await Promise.all(promises);
  //     this.setState({ uploadSuccess: true, uploading: false });
  //   } catch (e) {
  //     // Not Production ready! Do some error handling here instead...
  //     this.setState({ uploadSuccess: true, uploading: false });
  //   }
  // }


  // sendRequest(file) {
  //   return new Promise((resolve, reject) => {
  //     const req = new XMLHttpRequest();
  //     const formData = new FormData();
  //     formData.append("file", file, file.name);
  //     req.open("POST", "http://localhost:8000/upload");
  //     req.send(formData);
  //   });
  // }
  // //
  // renderActions() {
  //   if (this.state.uploadSuccess) {
  //     console.log('uploadSuccess');
  //     return (
  //       <div>
  //       <button onClick={() => this.setState({ files: [], uploadSuccess: false })}>Clear</button>
  //         {/*pass state to child component*/}
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <button disabled={this.state.files.length < 0 || this.state.uploading} onClick={this.uploadFiles}>
  //         Navigation
  //       </button>
  //     );
  //   }
  // }




}

export default Upload;