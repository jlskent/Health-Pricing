import React from 'react';
import './ListOfVariables.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';


class ListOfVariables extends React.Component {


  constructor(props){
    // get parent(Update) state
    super(props);
    // create some local variables
    this.state = {
      currentVariable: [{
        CPT_CODE: 'CPT_CODE',
        PROVIDER_NAME: 'PROVIDER_NAME',
        PROCUDURE: 'PROCUDURE'
      }],
      xAxisVariables : [],
      yAxisVariables : [],
      groupByVariables : [],
      aggregateVariables : [],
      CPT_CODE: []
    };



    // bind event handler
    // this.onXAxisSelected = this.onXAxisSelected.bind(this);
    this.renderResults = this.renderResults.bind(this);
  }

  // componentDidMount() {
    // this.loadData();
    // console.log("from parent "+this.props.columns);
    // console.log("this.xAxisVariables "+this.state.xAxisVariables)
  // }

  loadData(){
    // this.setState((prevState, props) => {
    //   return {CPT_CODE: prevState.CPT_CODE + this.props.columns};
    // });
    // console.log("loading data in child component " + this.props.df);
  }


  renderProvider(){
    // take each element in results dictionary
    const theDf = this.props.df;
    //console.log("child df " + theDf);
    if (theDf) {
      const cpt_series = theDf.getSeries("BILLING_PROV_NM").take(10);
      //console.log("series " + cpt_series);
      const cpt_array = cpt_series.toArray();
      const result_list = cpt_array.map(x => {
        //console.log("list " + x);
        return(
          <option data-tokens="ketchup mustard">{x}</option>
        );
      });
      //iterate result list
      return(
        <select className="selectpicker" data-live-search="true">{result_list}</select>
      );
    }
  }


  renderResults(){
    // take each element in results dictionary
    const theDf = this.props.df;
    //console.log("child df " + theDf);
    if (theDf) {
      const cpt_series = theDf.getSeries("CPT_CODE");
      //console.log("series " + cpt_series);
      const cpt_array = cpt_series.toArray();
      const result_list = cpt_array.map(x => {
        //console.log("list " + x);
        return(
          <Dropdown.Item as="button">{x}</Dropdown.Item>
        );
      });
      //iterate result list
      return(
        <DropdownButton id="btn btn-outline-primary" title="CPT Code">{result_list}  <Dropdown.Divider />
        </DropdownButton>
      );
    }
  }

  render() {
//
    if (this.props.df && this.props.uploadSuccess) {
      return (
        <div>
          <div><h4>List Of Variables</h4></div>
          <div>
            {this.renderResults()}
          </div>
          <div>{this.renderProvider()}</div>
        </div>
      );
    } else{
      return(
        <div>
          <h4>List Of Variables</h4>
          <p>no content yet</p>
        </div>
      );
    }
  }





}

export default ListOfVariables;