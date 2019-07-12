import React from 'react';
import './TableComponent.css';
import BootstrapTable from 'react-bootstrap-table-next';
import * as dataForge from "data-forge";
import PriceComponent from "../PriceComponent/PriceComponent";



class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // dataSorted: [],
      tableData: []
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

  //first step create variables to choose from on the left
  renderTable(){


    if (this.state.tableData) {

      // actually array?
      const theData = this.state.tableData;
      const df  = new dataForge.DataFrame(theData);
      const arr = df.toRows();
      console.log(df.toString());
      const colNames = df.getColumnNames();
      // console.table("res" + colNames.toString());


      // for (const column in colNames) {
      //   console.log("Column name: ");
      //   console.log(column.name);
      //   console.log("Data:");
      //   console.log(column.series.toArray());
      // }
      // const columns = df.getColumns().toArray();
      // console.log("*********** ");

      // console.log("data "+arr.toString());
      // console.log("cols "+ columns.toString());

      // const res = [];
      // const col_list = colNames.map(
      //   function(el) {
      //     console.log("el "+el);
      //   var o = Object.assign({}, el);
      //   o.fieldName = true;
      //   return o;
      //   }
      // );




      // console.log("res" + col_list);

      const result_list = this.state.tableData.map(x => {
        // console.log("each element "+x);
        return (
          <li class="list-group-item">{x.toString()}</li>
        );
      });

      // {/*<div>*/}
      // {/*<BootstrapTable  data={ arr } keyField={"CPT_CODE"} columns={col_list}>*/}
      // {/*</BootstrapTable>*/}
      // {/*</div>*/}
      //iterate result list
      return (

        <div className = 'list-group'>
          <ul>
          {result_list}
          </ul>
        </div>

      );
    }
  }

  render() {
    // const data  = this.props.tableData;
    //
    // console.log("tablecomponent receiving "+theData);

    return (

      <div className="news-description">
        {this.renderTable(this.state.tableData)}

        <ul className="collection">
          {/*<li>{this.props.result.price}</li>*/}
          {/*<li>{this.props.result.description}</li>*/}
          {/*<li>{this.props.result.location}</li>*/}
        </ul>
      </div>

    );
  }




}

export default TableComponent;