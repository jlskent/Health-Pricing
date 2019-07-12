// import DropdownButton from 'react-bootstrap/DropdownButton';
// import Dropdown from 'react-bootstrap/Dropdown';
import React from 'react';
import './ListOfVariables.css';
import ChartByCpt from "../ChartByCpt/ChartByCpt";
import ChartByProvider from "../ChartByProvider/ChartByProvider";
import ChartByProcedure from "../ChartByProcedure/ChartByProcedure";


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

      // editing: false,
      // xAxisVariables : [],
      // yAxisVariables : [],
      // groupByVariables : [],
      // aggregateVariables : [],
      CPT_CODE: [],
      selections : {CPT_CODE: 'CPT_CODE',
        BILLING_PROV_NM: 'BILLING_PROV_NM',
        PROC_NAME: 'PROC_NAME'}
    };

    // bind event handler
    this.renderListOfVariables = this.renderListOfVariables.bind(this);
    this.selectVariable = this.selectVariable.bind(this);

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





  // prepare data
  // select item and get relevant data out of df
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
      if (currentVar == "BILLING_PROV_NM" ){
        // pass all the rows have the current provider name
        this.setState({provider_Graph_Data: filtered})
      }
      if (currentVar == "PROC_NAME" ){
        // pass all the rows have the current procedure name
        this.setState({procedure_Graph_Data: filtered})
      }



    });
  }




  // select one variable from list of cpt, proc code and provider name
  selectVariable(e){
    this.state.editing = true;
    e.preventDefault();
    // note if we use this we can be one step behind
    // this.setState({currentSelection: e.target.value});
    //instead we use callback function
    this.setState({
      currentSelection: e.target.value.toString()
    }, () => {
      this.state.varChosen = this.state.currentSelection;
      this.renderListOfVariables(this.state.currentSelection);
      this.setState({wholeData: this.props.df});
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
    const theDf = this.props.df;
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




      else {
        const variable_array = theDf.getSeries(varChosen).distinct().after(0).toArray();
        const result_list = variable_array.map(x => {
          return(
            <div><button className="list-group-item list-group-item-action" value={x} onClick={(e)=>this.selectItem(e)}>{x}</button>
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
          </div>
          <div><h5></h5></div>
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