import React from 'react';
import './TableComponentForProc.css';
import BootstrapTable from 'react-bootstrap-table-next';
import * as dataForge from "data-forge";
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

// import PriceComponent from "../PriceComponent/PriceComponent";
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
//

// here we actually get a list of dataframes
class TableComponentForProc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // dataSorted: [],
      tableData: null
    };
    this.renderTable = this.renderTable.bind(this)

    this.removeItem = this.removeItem.bind(this)

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

        var chargesSeries = df.getSeries('Charges').parseInts();
        // console.log(chargesSeries.toString());

        // console.log(parseFloat(chargesSeries.sum()));
        // console.log(chargesSeries.count());

        var paymentsSeries = df.getSeries('Payments').parseInts();
        var chargesAverage = parseFloat(chargesSeries.sum()) / parseFloat(chargesSeries.count());
        // var paymentsAverage = paymentsSeries.sum() / paymentsSeries.count();
        // console.log("avg "+chargesAverage);

        var procedureQuantitySeries = df.getSeries('PROCQTY').parseInts();


        return (
          <div>
            <h5>Provider: {arr[0].BILLING_PROV_NM} </h5>
            <div className="text-right">
              <button className="btn btn-outline-primary btn-sm" value = {this.state.tableData.indexOf(x)} onClick={(e)=>this.removeItem(e)}>remove</button>
            </div>
            <BootstrapTable
              data={ arr }
              keyField="Payments"
              columns={col_list}
              tableStyle={ { background: 'black' } }
              headerStyle={ { background: '#00ff00' } }
              pagination={ paginationFactory()}
              striped
              hover
              condensed
              id = "table"
            />
            <div>


            <p><small>charges Average: {chargesSeries.average()}</small></p>
            <p><small>payments Average: {paymentsSeries.average()}</small></p>
            <p><small>charges std: {chargesSeries.std()}</small></p>
            <p><small>payments std: {paymentsSeries.std()}</small></p>
            <p><small>number of procedures: {procedureQuantitySeries.sum()}</small></p>

            </div>
          </div>


        );


      });

      // {/*<div>*/}
      // {/*<BootstrapTable  data={ arr } keyField={"CPT_CODE"} columns={col_list}>*/}
      // {/*</BootstrapTable>*/}
      // {/*</div>*/}
      //iterate result list
      return (
        <div>{result_list}</div>
      );
    }
  }




  clearData(){
    this.setState({
      tableData : null
    });  }


  removeItem(e) {
    console.log(e.target.value);
    const item = parseInt(e.target.value);
    console.log(this.state.tableData.length);

    // this.setState((prevState) => ({
    //   tableData: prevState.tableData.filter((_, i) => i !== item)
    // }));

    this.props.removeTableData(item);



    // this.renderTable();

  }

  render() {
    // const data  = this.props.tableData;
    //
    // console.log("tablecomponent receiving "+theData);

    return (

      <div className="container">
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

export default TableComponentForProc;