// import DropdownButton from 'react-bootstrap/DropdownButton';
// import Dropdown from 'react-bootstrap/Dropdown';
import React from 'react';
import './ListOfVariables.css';
import ChartByCpt from "../ChartByCpt/ChartByCpt";
import ChartByProvider from "../ChartByProvider/ChartByProvider";
import ChartByProcedure from "../ChartByProcedure/ChartByProcedure";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import * as dataForge from "data-forge";
import { create, all } from 'mathjs'



class ListOfVariables extends React.Component {


  constructor(props){
    // get parent(Update) state
    super(props);
    // create some local variables
    this.state = {
      varChosen: 'CPT_CODE',
      // it's actually generic, so rename it
      // it is data after selection of an item
      wholeData: null,
      cpt_Graph_Data: null,
      provider_Graph_Data: null,
      procedure_Graph_Data: null,
      sortBy : {sort_by_avg_bill: 'sort_by_avg_bill',
        sort_by_num_procedures: 'sort_by_num_procedures',
        sort_by_name: 'sort_by_name',
        procedure_sort_by_variance : 'procedure_sort_by_variance',
        procedure_sort_by_num_procedures : 'procedure_sort_by_num_procedures',
        procedure_sort_by_avg_bill: 'procedure_sort_by_avg_bill'

      },

      CPT_CODE: [],
      selections : {CPT_CODE: 'CPT_CODE',
        BILLING_PROV_NM: 'BILLING_PROV_NM',
        PROC_NAME: 'PROC_NAME'}




    };

    // bind event handler
    this.renderListOfVariables = this.renderListOfVariables.bind(this);
    this.selectVariable = this.selectVariable.bind(this);
    this.sortByProvider = this.sortByProvider.bind(this);
    this.sortByProcedure = this.sortByProcedure.bind(this);


  }

  componentDidMount() {
    // this.loadData();
    // console.log("from parent "+this.props.columns);
  }

  componentWillMount() {
    // this.state.varChosen.unsubscribe(
    //   this.selectVariable
    // );
  }

  componentDidUpdate() {
    // this.renderListOfVariables(this.state.currentSelection);
  }

  // loadData(){
  //   // this.setState((prevState, props) => {
  //   //   return {CPT_CODE: prevState.CPT_CODE + this.props.columns};
  //   // });
  //   // console.log("loading Data in child component " + this.props.df);
  // }

  // handleSubscriptionChange = dataSource => {
  //   this.setState({
  //     varChosen: dataSource.value,
  //   });
  // };





  // if selected provider name and sort option, we update the dataframe and then call re-render
  sortByProvider(e){
    // e.preventDefault();

    const currentSortBy = e.target.value;

    this.setState({  sortBy: currentSortBy});
    // console.log("e  " + currentSortBy);
    const theDf = this.props.df;
    // console.log("child df " + theDf);
    if (currentSortBy) {
      var df = this.props.df;
      // var sortedDf;
      switch(currentSortBy) {
        case "sort_by_name":
          const dfSortedByName = df.orderBy(row => row.BILLING_PROV_NM);
          this.setState( {dataAfterSorting: dfSortedByName},
            () => this.renderListOfVariables(this.state.varChosen)
          );
          break;
        case "sort_by_avg_bill":
          const dfSortedByAvgBill = df.groupBy(row => row.BILLING_PROV_NM)
            .select(group => {
              return {
                BILLING_PROV_NM: group.first().BILLING_PROV_NM,
                Average: group.deflate(row => row.Charges).parseFloats().average(),
              };
            }).inflate().after(0).orderByDescending(row => row.Average);

          const format = dfSortedByAvgBill.transformSeries({
            Average: value => value.toFixed(3)
          });

          // console.log(format.toString());

          this.setState( {dataAfterSorting: format},
            () => this.renderListOfVariables(this.state.varChosen)
            );
          break;
        case "sort_by_num_procedures":
          const dfSortedByNumProcedures = df.groupBy(row => row.BILLING_PROV_NM)
            .select(group => {
              return {
                BILLING_PROV_NM: group.first().BILLING_PROV_NM,
                numberOfProcedures: group.deflate(row => row.PROCQTY).parseInts().sum(),
              };
            }).inflate().after(0).orderByDescending(row => row.numberOfProcedures);
          // console.log("grouped" + dfSortedByNumProcedures);
          this.setState( {dataAfterSorting: dfSortedByNumProcedures},
            () => this.renderListOfVariables(this.state.varChosen)
          );
          break;
        default:
        // code block
      }
    }
  }




  // if selected provider name and sort option, we update the dataframe and then call re-render
  sortByProcedure(e){
    // e.preventDefault();

    const currentSortBy = e.target.value;

    this.setState({  sortBy: currentSortBy  });
    console.log("e  " + currentSortBy);
    const theDf = this.props.df;
    // console.log("child df " + theDf);
    if (currentSortBy) {
      var df = this.props.df;
      // var sortedDf;
      switch(currentSortBy) {
        case "procedure_sort_by_variance":
          const config = { }
          const math = create(all, config)


          const dfSortedByStd = df.groupBy(row => row.PROC_NAME)
            .select(group => {
              // console.log(group.toString());
              const arr = group.deflate(row => row.Charges).parseFloats().toArray();
              // console.log( "arr "+ arr  );
              // over N, default over N-1
              var std = math.std(arr);

              // var variance = math.variance(arr, 'uncorrected');
              if (arr.length<2) std = null;
              return {
                PROC_NAME: group.first().PROC_NAME,
                Std: std
              };
            }).inflate().after(0).orderByDescending(row => row.Std);


          const formatted = dfSortedByStd.transformSeries({
            Std: value => (value != null) ? value.toFixed(3) : "DataPoint not enough"
          });

          this.setState( {dataAfterSorting: formatted},
            () => this.renderListOfVariables(this.state.varChosen)
          );
          break;

        case "procedure_sort_by_avg_bill":
          const dfSortedByAvgBill = df.groupBy(row => row.PROC_NAME)
            .select(group => {
              return {
                PROC_NAME: group.first().PROC_NAME,
                Average: group.deflate(row => row.Charges).parseFloats().average(),
              };
            }).inflate().after(0).orderByDescending(row => row.Average);

          console.log("sorted df "+dfSortedByAvgBill.toString());

          const format = dfSortedByAvgBill.transformSeries({
            Average: value => value.toFixed(3)
          });

          // console.log(format.toString());

          this.setState( {dataAfterSorting: format},
            () => this.renderListOfVariables(this.state.varChosen)
          );
          break;
        case "procedure_sort_by_num_procedures":
          const dfSortedByNumProcedures = df.groupBy(row => row.PROC_NAME)
            .select(group => {
              return {
                PROC_NAME: group.first().PROC_NAME,
                numberOfProcedures: group.deflate(row => row.PROCQTY).parseInts().sum(),
              };
            }).inflate().after(0).orderByDescending(row => row.numberOfProcedures);
          // console.log("grouped" + dfSortedByNumProcedures);
          this.setState( {dataAfterSorting: dfSortedByNumProcedures},
            () => this.renderListOfVariables(this.state.varChosen)
          );
          break;
        default:
        // code block
      }
    }
  }











  // select item and get relevant data out of df -> pass it to graph
  selectItem(e){
    e.preventDefault();
    console.log("target value " + typeof e.target.value);


    this.setState({
      currentItem: e.target.value.toString()
    }, () => {
      // now that we have specific cpt code, query the dataframe, and pass cpt_Graph_Data to draw chart
      const currentItem = this.state.currentItem;
      const currentVar = this.state.currentSelection;
      console.log("currentItem "+ currentItem.toString());
      // console.log("currentVariable "+ this.state.currentSelection.toString());
      // eg filter row[some cpt code 33999] = 33999
      const filtered = this.props.df.where(row => row[currentVar] === currentItem);
      this.setState({cpt_Graph_Data: filtered});
      if (currentVar === "BILLING_PROV_NM" ){
        // pass all the rows have the current provider name
        this.setState({provider_Graph_Data: filtered})
      }
      if (currentVar === "PROC_NAME" ){
        // pass all the rows have the current procedure name
        this.setState({procedure_Graph_Data: filtered})
      }



    });
  }




  // select one variable from list of cpt, proc code and provider name
  selectVariable(e){
    this.state.editing = true;
    // this.state.dataAfterSorting = null;
    e.preventDefault();


    this.setState({
      currentSelection: e.target.value.toString(),

  }, () => {
    this.setState({
      dataAfterSorting: null,
      sortBy: null,
      varChosen : this.state.currentSelection
    }, () => {

        // this.state.varChosen = this.state.currentSelection;
        this.setState({wholeData: this.props.df});
        this.renderListOfVariables(this.state.currentSelection);
        this.state.editing = false;
      });

    });



    // old
    // this.state.dataAfterSorting = null;
    // note if we use this we can be one step behind
    // this.setState({currentSelection: e.target.value});
    //instead we use callback function
    this.setState({
      currentSelection: e.target.value.toString()
    }, () => {
      this.state.varChosen = this.state.currentSelection;
      this.setState({wholeData: this.props.df});
      this.renderListOfVariables(this.state.currentSelection);
      this.state.editing = false;
    });



  }

  //first step create variables to choose from on the left
  renderSelection(){
    //console.log(Object.keys(this.state.selections));
    const list = Object.keys(this.state.selections).map(x => {
      // console.log(x);
      return(
          <button className="list-group-item list-group-item-action" value={x} onClick={(e)=>this.selectVariable(e)}>{x}</button>
      );
    });
    return (
      <div className="list-group" id="list-tab" role="tablist">{list}</div>
    );
  }



  // show list of items on the right
  // cpt requires frequency
  renderListOfVariables(varChosen){
    // take each element in results dictionary

    // we already get sorted df if we did sorting
    var theDf= this.props.df;

    if (this.state.dataAfterSorting) {
      theDf = this.state.dataAfterSorting;
    }




    // console.log("child df " + theDf);
    if (theDf && varChosen) {
      //group by CPT code and count number for each
      if (varChosen === "CPT_CODE"){
        const grouped = theDf.groupBy(row => row.CPT_CODE)
          .select(group => {
            return {
              CPT_CODE: group.first().CPT_CODE,
              Count: group.count(),
            };
          }).inflate().after(0).orderByDescending(row => row.Count);

        const result_list = grouped.toRows().map(x => {
          //console.log("list " + x);
          return(
            <div>
              <button className="list-group-item list-group-item-action" value={x[0]} onClick={(e)=>this.selectItem(e)}>{x[0]}
                <span className="badge badge-secondary float-right mt-2">frequency {x[1]}</span>
              </button>
            </div>
          );
        });
        //iterate result list
        return(
          <div className="list-group" id="list-tab" role="tablist">{result_list}</div>
          // {/*<DropdownButton id="btn btn-outline-primary" title="CPT Code">{result_list}  <Dropdown.Divider /></DropdownButton>*/}
        );
      }

      else if (varChosen === "BILLING_PROV_NM" && this.state.sortBy && this.state.sortBy !='sort_by_name') {

        var text = "";
        if (this.state.sortBy === 'sort_by_avg_bill') {  text = "Average Bill: "  }
        if (this.state.sortBy === 'sort_by_num_procedures') {  text = "procedures: "  }


        // console.log(theDf.toString());
        const variable_array = theDf.toRows();
        // console.log(variable_array);

        const result_list = variable_array.map(x => {
          return(
            <div>
              <button className="list-group-item list-group-item-action" value={x[0]} onClick={(e)=>this.selectItem(e)}>{x[0]}
              <span className="badge badge-secondary float-right mt-2">{text} {x[1]}</span>
            </button>
            </div>
          );
        });
        //iterate result list
        return(
          <div className="list-group" id="list-tab" role="tablist">{result_list}</div>
        );
      }



      else if (varChosen === "PROC_NAME" && this.state.sortBy) {
        var text = "";
        if (this.state.sortBy === 'procedure_sort_by_variance') {  text = "Standard deviation: "  }
        if (this.state.sortBy === 'procedure_sort_by_avg_bill') {  text = "Average Bill: "  }
        if (this.state.sortBy === 'procedure_sort_by_num_procedures') {  text = "procedures: "  }

        // console.log(theDf.toString());
        const variable_array = theDf.toRows();
        // console.log(variable_array);
        const result_list = variable_array.map(x => {
          return(
            <div>
              <button className="list-group-item list-group-item-action" value={x[0]} onClick={(e)=>this.selectItem(e)}>{x[0]}
                <span className="badge badge-secondary float-right mt-2">{text} {x[1]}</span>
              </button>
            </div>
          );
        });
        //iterate result list
        return(
          <div className="list-group" id="list-tab" role="tablist">{result_list}</div>
        );
      }










      else {
        // theDf = this.props.df;
        const variable_array = theDf.getSeries(varChosen).distinct().after(0).toArray();
        const result_list = variable_array.map(x => {
          return(
            <div><button className="list-group-item list-group-item-action" value={x} onClick={(e)=>this.selectItem(e)}>{x}</button>
              {/*<span className="badge badge-secondary float-right mt-2">frequency {x[1]}</span>*/}

            </div>
          );
        });
        //iterate result list
        return(
          <div className="list-group" id="list-tab" role="tablist">{result_list}</div>
        );

      }
    }
  }


  render() {
    if (this.props.df && this.props.uploadSuccess && this.state.varChosen === "CPT_CODE") {
      return (
        <div>
          <div className="jumbotron">
            <h4>Step 2. Start with a variable</h4>
            <div className = "row">
              <div className="col-4">
                <div>{this.renderSelection()}</div>
              </div>
              <div className="col-8">
                {this.renderListOfVariables(this.state.varChosen)}
              </div>
            </div>
          </div>
          <ChartByCpt cpt_Graph_Data = {this.state.cpt_Graph_Data}></ChartByCpt>
        </div>

      );

    }
    else if (this.props.df && this.props.uploadSuccess && this.state.varChosen === "BILLING_PROV_NM") {
      return (
        <div>
          <div className="jumbotron">
            <h4>Step 2. Start with a variable</h4>
            <div className="row">
              <div className="col-4">
                <div>{this.renderSelection()}</div>
              </div>
              <div className="col-8">
                {this.renderListOfVariables(this.state.varChosen)}
              </div>
            </div>
            <div>
              <h5>Sort By</h5>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="inputGroupSelect01">Sorting Options</label>
                </div>
                <select className="custom-select" id="inputGroupSelect01" onChange={(e) => this.sortByProvider(e)}>
                  <option selected>Choose a way of sorting doctors</option>
                  <option value="sort_by_name">by names</option>
                  <option value="sort_by_avg_bill">by amount of bill</option>
                  <option value="sort_by_num_procedures">by number of procedures</option>
                </select>
              </div>
            </div>

          </div>
          <ChartByProvider wholeData={this.state.provider_Graph_Data}></ChartByProvider>
        </div>
      )
    }

    else if (this.props.df && this.props.uploadSuccess && this.state.varChosen === "PROC_NAME") {
      return (
        <div>
          <div className="jumbotron">
            <h4>Step 2. Start with a variable</h4>
            <div className = "row">
              <div className="col-4">
                <div>{this.renderSelection()}</div>
              </div>
              <div className="col-8">
                {this.renderListOfVariables(this.state.varChosen)}
              </div>
            </div>
            <div>
              <h5>Sort By</h5>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="inputGroupSelect01">Sorting Options</label>
                </div>
              <select className="custom-select" id="inputGroupSelect01" onChange={(e) => this.sortByProcedure(e)}>
                <option selected>Choose a way of sorting procedures</option>
                <option value="procedure_sort_by_variance">by standard deviation</option>
                <option value="procedure_sort_by_avg_bill">by average amount of bill</option>
                <option value="procedure_sort_by_num_procedures">by number of procedures</option>
              </select>
            </div>
            </div>
          </div>
          <ChartByProcedure procedure_Graph_Data = {this.state.procedure_Graph_Data}></ChartByProcedure>
        </div>
      );


    }

    else{
      return(
        <div>
          <h4>Step 2. Start with a variable</h4>
          <p>no content yet</p>
        </div>
      );
    }
  }





}

export default ListOfVariables;