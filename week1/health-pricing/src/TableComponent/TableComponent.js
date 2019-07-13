import React from 'react';
import './TableComponent.css';
import BootstrapTable from 'react-bootstrap-table-next';
import * as dataForge from "data-forge";
import PriceComponent from "../PriceComponent/PriceComponent";
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';


// here we actually get a list of dataframes
class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // dataSorted: [],
      tableData: null
    };
    this.renderTable = this.renderTable.bind(this)
  }

  async componentWillReceiveProps(nextProps) {
    if ( this.props !== nextProps && nextProps.tableData) {
      // this.createBarChart(nextProps.wholeData);
      // var theData = new dataForge.DataFrame(nextProps.tableData);
      // console.log("table comp "+ nextProps.tableData)

      // this.setState(prevState => ({
      //   tableData: [...prevState.tableData, nextProps.tableData]
      // }));


      this.setState({tableData: nextProps.tableData});

      // console.log("receiving props in tableComponent "+ theData);
      // var rightDf = new dataForge.DataFrame(theData);
      // console.log(" tabble"  + this.state.tableData);


    }
  }



  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.tableData !== prevProps.tableData) {
      this.renderTable();
    }
  }
  //first step create variables to choose from on the left
  renderTable(){


    if (this.state.tableData) {

      // so this.state.tableData is an array of dataframes(each ele is a group), for each we will create a table
      // iterate each dataframe
      // var theDataList = this.state.tableData;
      // for (var i = 0; i < theDataList.length; i++)
      // {
      //   const theData = theDataList[i];
      //
      //   // console.log(theData);
      //   // actually array?
      //   const df  = new dataForge.DataFrame(theData);
      //   const arr = df.toArray();
      //   // const rows = df.toJSON();
      //
      //   // console.log(arr);
      //   const colNames = df.getColumnNames();
      //
      //   //prepare for react-bootstrap-table columns
      //   const col_list = colNames.map(
      //     function(el) {
      //       var o = Object.assign({}, el);
      //       o.dataField = el;
      //       o.text = el;
      //       return o;
      //     }
      //   ).map(
      //     function(el) {
      //       let unwrap = ({dataField, text}) => ({dataField, text});
      //       const picked = unwrap(el);
      //       console.log("picked" + JSON.stringify(picked));
      //       return picked;
      //     }
      //   );



        // const picked = (({ fieldName, text }) => ({ fieldName, text }))(col_list);

        // console.log("res" + JSON.stringify(col_list));
        // console.log("arr" + JSON.stringify(arr));



      //   return (
      //
      //     <BootstrapTable data={ arr } keyField="Payments" columns={col_list}>
      //     </BootstrapTable>
      //
      //   );
      //
      // }







      // console.log("res" + col_list);

      const result_list = this.state.tableData.map(x => {
        const theData = x;

        // console.log(theData);
        // actually array?
        const df  = new dataForge.DataFrame(theData);
        const arr = df.toArray();
        // const rows = df.toJSON();

        // console.log(arr);
        const colNames = df.getColumnNames();

        //prepare for react-bootstrap-table columns
        const col_list = colNames.map(
          function(el) {
            var o = Object.assign({}, el);
            o.dataField = el;
            o.text = el;
            return o;
          }
        ).map(
          function(el) {
            let unwrap = ({dataField, text}) => ({dataField, text});
            const picked = unwrap(el);
            // console.log("picked" + JSON.stringify(picked));
            return picked;
          }
        );



        // const picked = (({ fieldName, text }) => ({ fieldName, text }))(col_list);

        // console.log("res" + JSON.stringify(col_list));
        // console.log("arr" + JSON.stringify(arr));



        return (
          <div>
            <h1> {<arr className="CPT_CODE"></arr>} </h1>
            <BootstrapTable
              data={ arr }
              keyField="Payments"
              columns={col_list}
              // rowStyle={{backgroundColor: 'white'}}
              striped
              hover
              condensed/>
          </div>


        );


      });

      // {/*<div>*/}
      // {/*<BootstrapTable  data={ arr } keyField={"CPT_CODE"} columns={col_list}>*/}
      // {/*</BootstrapTable>*/}
      // {/*</div>*/}
      //iterate result list
      return (

        <div>

          {result_list}

        </div>

      );
    }
  }

  render() {
    // const data  = this.props.tableData;
    //
    // console.log("tablecomponent receiving "+theData);

    return (

      <div className="">
        {this.renderTable()}

        {/*<ul className="collection">*/}
          {/*<li>{this.props.result.price}</li>*/}
          {/*<li>{this.props.result.description}</li>*/}
          {/*<li>{this.props.result.location}</li>*/}
        {/*</ul>*/}
      </div>

    );
  }




}

export default TableComponent;