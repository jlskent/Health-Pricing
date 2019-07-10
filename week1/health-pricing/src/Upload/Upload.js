import React from 'react';
import './Upload.css';
import DropZone from '../DropZone/DropZone'
import ListOfVariables from '../ListOfVariables/ListOfVariables'
import Papa from 'papaparse';
import 'data-forge-fs';
import * as dataForge from 'data-forge';
// import { readFile, Series, DataFrame } from 'Data-forge';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';





// import * as d3 from "d3";
// import Data from "../Data/sample_data.csv";


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
      uploadSuccess: false
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
    //
    this.updateData = this.updateData.bind(this);
  }

  componentDidMount() {
    // let df = new dataForge.DataFrame({
    //   columns: {
    //     'regiment': ['Nighthawks', 'Nighthawks', 'Nighthawks', 'Nighthawks', 'Dragoons', 'Dragoons', 'Dragoons', 'Dragoons', 'Scouts', 'Scouts', 'Scouts', 'Scouts'],
    //     'company': ['1st', '1st', '2nd', '2nd', '1st', '1st', '2nd', '2nd','1st', '1st', '2nd', '2nd'],
    //     'TestScore': [4, 24, 31, 2, 3, 4, 24, 31, 2, 3, 2, 3]
    //   }
    // });
    // const pivotted = df.pivot(["regiment", "company"], "TestScore", testScores => testScores.average());
    // console.log(pivotted.toArray())

  }

  // called before render, do not access dom
  componentWillMount() {
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


  render() {
    return (
      <div className="">
        <div className="row py-md-4">
          {/*<span className="Title">Upload csv file</span>*/}
            <div className="col-6">
              <DropZone onFilesAdded = {this.onFilesAdded} disabled= {this.state.uploading || this.state.uploadSuccess} />
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
        <div><ListOfVariables {...this.state} /></div>
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
      this.setState({ uploadSuccess: true, uploading: false });
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
  //         Upload
  //       </button>
  //     );
  //   }
  // }




}

export default Upload;