// import DropdownButton from 'react-bootstrap/DropdownButton';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
// import * as dataForge from "data-forge";
import React from 'react';
import './ListOfVariables.css';
import ChartByCpt from "../ChartByCpt/ChartByCpt";
import ChartByProvider from "../ChartByProvider/ChartByProvider";
import ChartByProcedure from "../ChartByProcedure/ChartByProcedure";
import { create, all } from 'mathjs'
import ToggleButton from 'react-bootstrap/ToggleButton';

import { Button, ButtonGroup } from 'react-bootstrap';

import update from 'immutability-helper';


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
      filterZeroChecked: false,
      KeepProcedureIsOneChecked: false,


      wholeDataList: [],
      cpt_Graph_Data_List: [],
      provider_Graph_Data_List: [],
      procedure_Graph_Data_List: [],
      filteredData_List: [],




      sortBy : {
        sort_by_cpt_freq: 'sort_by_cpt_freq',
        sort_by_avg_bill: 'sort_by_avg_bill',
        sort_by_num_procedures: 'sort_by_num_procedures',
        sort_by_name: 'sort_by_name',
        procedure_sort_by_name : 'procedure_sort_by_name',
        procedure_sort_by_payments_variance : 'procedure_sort_by_payments_variance',
        procedure_sort_by_charges_variance : 'procedure_sort_by_charges_variance',
        procedure_sort_by_adjustments : 'procedure_sort_by_adjustments',
        procedure_sort_by_num_procedures : 'procedure_sort_by_num_procedures',
        procedure_sort_by_avg_bill: 'procedure_sort_by_avg_bill'

      },

      CPT_CODE: [],
      selections : {
        CPT_CODE: 'CPT_CODE',
        BILLING_PROV_NM: 'BILLING_PROV_NM',
        PROC_NAME: 'PROC_NAME'
      },






  };

    // bind event handler
    this.renderListOfVariables = this.renderListOfVariables.bind(this);
    this.selectVariable = this.selectVariable.bind(this);
    this.sortByProvider = this.sortByProvider.bind(this);
    this.sortByProcedure = this.sortByProcedure.bind(this);
    this.handleCheckboxFilterZero = this.handleCheckboxFilterZero.bind(this);
    this.handleCheckboxKeepProcedureIsOne = this.handleCheckboxKeepProcedureIsOne.bind(this);

  }



  // async componentWillReceiveProps(nextProps) {
    // if ( this.props !== nextProps) {
      // this.props.setCurrentStep('chooseVariable');
      // console.log('setting step')

    // }
  // }

  componentDidMount() {

    // this.loadData();
    // console.log("from parent "+this.props.columns);
  }

  componentWillMount() {


    // this.setState({  filterZeroChecked: false  });
    // this.setState({wholeData: this.props.df});
  }

  componentDidUpdate() {
    // if(this.state.wholeData) {
    //   this.props.setCurrentStep('chooseVariable');
    // }

    // this.renderListOfVariables(this.state.currentSelection);
  }




  /*
  * Functions that handles sorting option as LAST tep
  * so if we choose any sorting, it displays on the right
  * the data is stored in dataAfterSorting
  *
  * */


  // if selected provider name and sort option, we update the dataframe and then call re-render
  sortByProvider(e){
    e.preventDefault();

    const currentSortBy = e.target.value;
    this.setState({  sortBy: currentSortBy  });
    // console.log("e  " + currentSortBy);
    // const theDf = this.props.df;
    // console.log("child df " + theDf);
    if (currentSortBy) {
      var df = this.state.filteredData ? this.state.filteredData: this.props.df;
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



  // if selected procedure name and sort option, we update the dataframe and then call re-render
  sortByProcedure(e){
    // e.preventDefault();

    const currentSortBy = e.target.value;

    this.setState({  sortBy: currentSortBy  });
    console.log("e  " + currentSortBy);
    // const theDf = this.props.df;
    // console.log("child df " + theDf);
    if (currentSortBy) {
      var df = this.state.filteredData ? this.state.filteredData: this.props.df;
      // var sortedDf;
      switch(currentSortBy) {
        case "procedure_sort_by_name":
          const dfSortedByName = df.orderBy(row => row.PROC_NAME);
          this.setState( {dataAfterSorting: dfSortedByName},
            () => this.renderListOfVariables(this.state.varChosen)
          );
          break;
        case "procedure_sort_by_payments_variance":
          const config = { };
          const math = create(all, config);
          console.log("sorting ");

          const dfSortedByStd = df.groupBy(row => row.PROC_NAME)
            .select(group => {
              // console.log(group.toString());
              const arr = group.deflate(row => row.Payments).parseFloats().toArray();
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

        case "procedure_sort_by_adjustments":
          // const config_adjustments = { };
          // const math_adjustments = create(all, config_adjustments);

          const df_sorted_by_adjustments = df.groupBy(row => row.PROC_NAME)
            .select(group => {
              return {
                PROC_NAME: group.first().PROC_NAME,
                Average: group.deflate(row => row.Adjustments).parseFloats().average(),
              };
            }).inflate().after(0).orderByDescending(row => row.Average);


          const formatted_adjustments = df_sorted_by_adjustments.transformSeries({
            Average: value => (value != null) ? value.toFixed(3) : "DataPoint not enough"
          });

          this.setState( {dataAfterSorting: formatted_adjustments},
            () => this.renderListOfVariables(this.state.varChosen)
          );
          break;


        case "procedure_sort_by_charges_variance":
          const config_charges = { };
          const math_charges = create(all, config_charges);

          const df_sorted_by_charges_std = df.groupBy(row => row.PROC_NAME)
            .select(group => {
              // console.log(group.toString());
              const arr_charges = group.deflate(row => row.Charges).parseFloats().toArray();
              // console.log( "arr "+ arr  );
              // over N, default over N-1
              var std_charges = math_charges.std(arr_charges);

              // var variance = math.variance(arr, 'uncorrected');
              if (arr_charges.length<2) std_charges = null;
              return {
                PROC_NAME: group.first().PROC_NAME,
                Std: std_charges
              };
            }).inflate().after(0).orderByDescending(row => row.Std);


          const formatted_charges = df_sorted_by_charges_std.transformSeries({
            Std: value => (value != null) ? value.toFixed(3) : "DataPoint not enough"
          });

          this.setState( {dataAfterSorting: formatted_charges},
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






  /*
  * Functions that handles FIRST step
  * so if we choose filter, save filtered state to filteredData
  * otherwise filteredData = this.props.df(parent df)
  *
  * */


  handleCheckboxFilterZero = (e) =>{
    this.setState({  filterZeroChecked : !this.state.filterZeroChecked  });
    //console.log("checked" + this.state.filterZeroChecked);
    // if checked, backup whole data and update parent prop
    if(this.props.df) {
      // this actually means checked
      if (!this.state.filterZeroChecked) {
        var theDf= this.state.KeepProcedureIsOneChecked ? this.state.filteredData : this.props.df;
        const filtered = theDf.where(row => row.Charges != "0");
        this.setState({
          filteredData : filtered
        }, () => {
          // this.props.updateFunction(filtered);
        })
      } else{
        // update parent prop with wholeData
        this.setState({
          filteredData : this.props.df
        }, () => {
          // this.props.updateFunction(filtered);
        })
        // this.props.updateFunction(this.state.wholeData);
      }
    }



    // if (this.props.dfList){
    //   // this actually means checked
    //   if (!this.state.filterZeroChecked) {
    //
    //     this.props.dfList.forEach((element) => {
    //       // this actually means checked
    //       if (!this.state.filterZeroChecked) {
    //         var theDf= this.state.KeepProcedureIsOneChecked ? this.state.filteredData : this.props.df;
    //         const filtered = theDf.where(row => row.Charges != "0");
    //         this.setState({
    //           filteredData : filtered
    //         }, () => {
    //           // this.props.updateFunction(filtered);
    //         })
    //       }
    //       else {
    //         // update parent prop with wholeData
    //         this.setState({filteredData : this.props.df}, () => {})
    //       }
    //
    //       console.log(element);
    //     });
    //
    //   }
    //
    //
    // }





  };


  handleCheckboxKeepProcedureIsOne = (e) =>{
    this.setState({  KeepProcedureIsOneChecked : !this.state.KeepProcedureIsOneChecked  });
    //console.log("checked" + this.state.filterZeroChecked);
    // if checked, backup whole data and update parent prop
    if(this.props.df){
      console.log("have df");
      if (!this.state.KeepProcedureIsOneChecked) {
        var theDf= this.state.filterZeroChecked ? this.state.filteredData : this.props.df;
        const filtered = theDf.where(row => row.PROCQTY === '1');
        this.setState({
          filteredData : filtered
        }, () => {
          // this.props.updateFunction(filtered);
        })
      } else{
        // update parent prop with wholeData
        this.setState({
          filteredData : this.props.df
        }, () => {
          // this.props.updateFunction(filtered);
        })
        // this.props.updateFunction(this.state.wholeData);
      }

      console.log("I am here");
    }


  };







  /*
  * Functions that selects item on the right
  * select item and get relevant data out of df -> pass it to graph
  * *
  * */

  selectItem(e){
    e.preventDefault();
    // console.log("target value " + typeof e.target.value);
    // comment back to use
    this.props.setCurrentStep('generateGraph');



    this.setState({
      currentItem: e.target.value.toString()

  }, () => {

      if (this.props.dfList.length === 2)
      {
        this.processMultipleDf();
      }
      else
      {

        // now that we have specific cpt code, query the dataframe, and pass cpt_Graph_Data to draw chart
        const currentItem = this.state.currentItem;
        const currentVar = this.state.currentSelection;

        console.log("currentItem "+ currentItem.toString());
        // console.log("currentVariable "+ this.state.currentSelection.toString());
        // eg filter row[some cpt code 33999] = 33999

        var filtered = this.props.df.where(row => row[currentVar] === currentItem);
        if( this.state.filteredData ){
          filtered = this.state.filteredData.where(row => row[currentVar] === currentItem);
        }

        this.setState({  cpt_Graph_Data: filtered  },
          () =>{
            // this.props.setCurrentStep('generateGraph');
          });

        if (currentVar === "BILLING_PROV_NM" ){
          // pass all the rows have the current provider name
          this.setState({  provider_Graph_Data: filtered  },
            () =>{
              // this.props.setCurrentStep('generateGraph');
            })

        }
        if (currentVar === "PROC_NAME" ){
          // pass all the rows have the current procedure name
          this.setState({  procedure_Graph_Data: filtered  },
            () =>{
              // this.props.setCurrentStep('generateGraph');
            })
        }
      }




    });


  }







  /*
  * Function that select one variable from list of cpt, proc code and provider name
  * After Selecting Filtering Options
  *
  * *
  * */

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
        this.setState({ wholeData: this.props.df });


        // if (this.props.dfList){
        //   // now store wholeData in an array and push every df
        //   this.props.dfList.forEach((element) => {
        //     this.setState(prevState => ({
        //       wholeData: [...prevState.wholeData, element]
        //     }));
        //   });
        // }

      this.renderListOfVariables(this.state.currentSelection);
        this.state.editing = false;
      });
    });



    // old
    // this.state.dataAfterSorting = null;
    // note if we use this we can be one step behind
    // this.setState({currentSelection: e.target.value});
    //instead we use callback function
    // this.setState({
    //   currentSelection: e.target.value.toString()
    // }, () => {
    //   this.state.varChosen = this.state.currentSelection;
    //   this.setState({wholeData: this.props.df});
    //   this.renderListOfVariables(this.state.currentSelection);
    //   this.state.editing = false;
    // });



  }







  /*
  * Html Element that provides filtering options
  *
  * */

  renderFilterDataOption(){
    return (
      <div id = "theDiv">
        {/*<i className="material-icons">filter_1</i>*/}
        <h5 className="inline_h5">a. Filter data</h5>
        <div>
        <ButtonGroup toggle className = "btn-group">
          <ToggleButton type="checkbox" variant="light" size = "sm" className = "toggle_btn" checked={this.state.filterZeroChecked} onChange ={(e) => this.handleCheckboxFilterZero(e)}>
            Ignore rows with 0 Charge
          </ToggleButton>

          <ToggleButton type="checkbox" variant="light" size = "sm" className = "toggle_btn"  checked={this.state.KeepProcedureIsOneChecked} onChange ={(e) => this.handleCheckboxKeepProcedureIsOne(e)}>
            Only keep rows whose procedure quantity is one
          </ToggleButton>
        </ButtonGroup>
        </div>
      </div>
    )
  }





  /*
  * Html Element that creates variables to choose from on the left
  *
  * */
  renderSelection(){
    //console.log(Object.keys(this.state.selections));
    const list = Object.keys(this.state.selections).map(x => {
      // console.log(x);
      var text = "";
      if (x === 'CPT_CODE') {  text = 'Cpt Code'};
      if (x === 'BILLING_PROV_NM') {  text = 'Provider Name'};
      if (x === 'PROC_NAME') {  text = 'Procedure Name'};


      return(
          <button className="list-group-item list-group-item-action" value={x} onClick={(e)=>this.selectVariable(e)}>{text}</button>
      );
    });
    return (
      <div className="list-group" id="list-tab" role="tablist">{list}</div>
    );
  }







  /*
  * Html Element that shows list of items on the right
  * cpt requires frequency
  *
  * */

  renderListOfVariables(varChosen){
    // take each element in results dictionary

    // we already get sorted df if we did sorting
    var theDf= this.state.filteredData? this.state.filteredData: this.props.df;

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
            <div className="">
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



      else if (varChosen === "PROC_NAME" && this.state.sortBy && this.state.sortBy !='procedure_sort_by_name') {
        var text = "";
        // if (this.state.sortBy === 'procedure_sort_by_name') {  text = "Name "  }
        if (this.state.sortBy === 'procedure_sort_by_payments_variance') {  text = "Payment Standard deviation: "  }
        if (this.state.sortBy === 'procedure_sort_by_charges_variance') {  text = "Charges Standard deviation: "  }
        if (this.state.sortBy === 'procedure_sort_by_adjustments') {  text = "Average adjustment "  }
        if (this.state.sortBy === 'procedure_sort_by_avg_bill') {  text = "Average Bill: "  }
        if (this.state.sortBy === 'procedure_sort_by_num_procedures') {  text = "Number of procedures: "  }

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




  /*
  * code for multiple df
  *
  * */


  processMultipleDf(){

    console.log("** processing multiple df, len " + this.props.dfList.length);

    if (this.props.dfList.length < 2){
      console.log("!!!len smaller thant two, return");

      return;
    }
    else {


      // called after filter
      const selectItem = () =>
      {
        if (this.state.varChosen && this.state.currentItem)
        {
          const currentItem = this.state.currentItem;
          const currentVar = this.state.currentSelection;
          // console.log("**select items for multiple df");
          // console.log(currentVar);
          // console.log(currentItem);

          let ifFilterUseFilterElseUseDf = this.state.filteredData_List? this.state.filteredData_List : this.props.dfList;


          // might be a good way to do setState in array, can not do for (set sestate)
          let finalList = [];
          // console.log("**constructing list of data with element "+filtered)
          if (currentVar === 'CPT_CODE')
          {
            for (let i = 0; i < this.props.dfList.length; i++)
            {
              const contains = this.props.dfList[i].any(row => row[currentVar] === currentItem);
              let filtered = ifFilterUseFilterElseUseDf[i].where(row => row[currentVar] === currentItem);
              if (!contains) {  filtered = this.props.dfList[i];  }
              finalList.push(filtered);
            }
            this.setState({cpt_Graph_Data_List: finalList}, () => {
            });
          }


          if (currentVar === 'BILLING_PROV_NM')
          {
            for (let i = 0; i < this.props.dfList.length; i++)
            {
              const contains = this.props.dfList[i].any(row => row[currentVar] === currentItem);
              let filtered = ifFilterUseFilterElseUseDf[i].where(row => row[currentVar] === currentItem);
              if (!contains) {  filtered = this.props.dfList[i];  }
              finalList.push(filtered);
            }


            this.setState({provider_Graph_Data_List: finalList}, () => {
            });
          }

          if (currentVar === 'PROC_NAME')
          {
            for (let i = 0; i < this.props.dfList.length;i++)
            {
              const contains = this.props.dfList[i].any(row => row[currentVar] === currentItem);
              let filtered = ifFilterUseFilterElseUseDf[i].where(row => row[currentVar] === currentItem);
              if (!contains) {  filtered = this.props.dfList[i]  }
              finalList.push(filtered);

            }
            this.setState({procedure_Graph_Data_List: finalList}, () => {
              // console.log("**len inside loop " + this.state.procedure_Graph_Data_List.length)
            });


          }
          // console.log("**constructing list of data of len " + this.state.procedure_Graph_Data_List.length)
          console.log("**constructing list of data of len " + this.state.provider_Graph_Data_List.length)

        }


      };




      // filter every df in list first
      const filter = () =>
        {

          let finalList = [];
          if (this.state.filterZeroChecked) {
            console.log("filter 0 checked");
            for (let i = 0; i < this.props.dfList.length; i++){
              const theDf= this.props.dfList[i];
              let filtered = theDf.where(row => row.Charges != "0");
              finalList.push(filtered);
            }
          }
          else{
            finalList = this.props.dfList;
            // for (let i = 0; i < this.props.dfList.length; i++){
            //   const theDf= this.props.dfList[i];
            //   finalList[i] = theDf;
            // }
          }

          if (this.state.KeepProcedureIsOneChecked) {
            finalList.forEach(function(item, i) {  finalList[i] = finalList[i].where(row => row.PROCQTY === '1'); });

            // for (let i = 0; i < this.props.dfList.length; i++){
            //   const theDf= this.state.filterZeroChecked ? finalList[i] : this.props.dfList[i];
            //   let filtered = theDf.where(row => row.PROCQTY === '1');
            // }
          }

          console.log("finallist "+ finalList[0]);
          console.log("finallist "+ finalList[1]);

          this.setState({ filteredData_List: finalList } , () =>{
            selectItem();
          });

        };






        filter();
        // selectItem();





    }


  }




  renderTestButton(){
    return(
      <div>
        {/*<button className="list-group-item list-group-item-action" value="" onClick={()=>this.processMultipleDf()}>test</button>*/}
      </div>
    );
  }





  render() {
    // console.log("df" + this.props.dfList[0]);
    // console.log("df2" + this.props.dfList[1]);
    if (!this.props.df || !this.props.uploadSuccess ) {
      return(
        <div>
          {this.renderTestButton()}
          {/*<h4>Step 2. Start with a variable</h4>*/}
        </div>
      );
    }

    if (this.props.currentStep === 'uploadFile') {
      return(
        <div>
          {/*<h4>Step 2. Start with a variable</h4>*/}
          {/*<p>no content yet</p>*/}
        </div>
      );
    }

    // else if (this.props.currentStep === 'chooseVariable'){
    if (this.state.varChosen === "CPT_CODE") {
      if (this.props.currentStep === 'chooseVariable') {
        return (
          <div>
            <div className="jumbotron">
              {this.renderTestButton()}

              <h4>Step 2. Start with a variable</h4>
              {this.renderFilterDataOption()}
              <h5>b. Browse by</h5>
              <div className="row">
                <div className="col-4">
                  <div>{this.renderSelection()}</div>
                </div>
                <div className="col-8">
                  {this.renderListOfVariables(this.state.varChosen)}
                </div>
              </div>
            </div>
            {/*<ChartByCpt cpt_Graph_Data={this.state.cpt_Graph_Data}></ChartByCpt>*/}
          </div>
        );
      } else
        {
        return(
          <ChartByCpt cpt_Graph_Data={this.state.cpt_Graph_Data} cpt_Graph_Data_List = {this.state.cpt_Graph_Data_List} files = {this.props.files}></ChartByCpt>
        );
      }


    }
    else if (this.state.varChosen === "BILLING_PROV_NM") {
      if (this.props.currentStep === 'chooseVariable') {
        return (
          <div>
            <div className="jumbotron">
              {this.renderTestButton()}

              <h4>Step 2. Start with a variable</h4>
              {this.renderFilterDataOption()}
              <h5>b. Browse by</h5>

              <div className="row">

                <div className="col-4">
                  <div>{this.renderSelection()}</div>
                </div>
                <div className="col-8">
                  {this.renderListOfVariables(this.state.varChosen)}
                </div>
              </div>
              <div>
                {/*<i className="material-icons">sort</i>*/}
                <h5 className="inline_h5">c. Sort By</h5>
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
            {/*<ChartByProvider wholeData={this.state.provider_Graph_Data}></ChartByProvider>*/}
          </div>
        )
      } else{
          return(
            <ChartByProvider provider_Graph_Data={this.state.provider_Graph_Data} provider_Graph_Data_List = {this.state.provider_Graph_Data_List} files = {this.props.files}></ChartByProvider>
          );
        }


    }

    else if (this.state.varChosen === "PROC_NAME") {
      if (this.props.currentStep === 'chooseVariable') {
        return (
          <div>
            <div className="jumbotron">
              {this.renderTestButton()}

              <h4>Step 2. Start with a variable</h4>
              {this.renderFilterDataOption()}
              <h5>b. Browse by</h5>
              <div className="row">
                <div className="col-4">
                  <div>{this.renderSelection()}</div>
                </div>
                <div className="col-8">
                  {this.renderListOfVariables(this.state.varChosen)}
                </div>
              </div>
              <div>
                <h5>c. Sort By</h5>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">Sorting Options</label>
                  </div>
                  <select className="custom-select" id="inputGroupSelect01" onChange={(e) => this.sortByProcedure(e)}>
                    <option selected>Choose a way of sorting procedures</option>
                    <option value="procedure_sort_by_name">by name</option>
                    <option value="procedure_sort_by_payments_variance">by payment standard deviation</option>
                    <option value="procedure_sort_by_charges_variance">by charges standard deviation</option>
                    <option value="procedure_sort_by_adjustments">by adjustments</option>
                    <option value="procedure_sort_by_avg_bill">by average amount of bill</option>
                    <option value="procedure_sort_by_num_procedures">by number of procedures</option>
                  </select>
                </div>
                {/*{this.props.currentStep === 'generateGraph' && <ChartByProcedure procedure_Graph_Data = {this.state.procedure_Graph_Data}></ChartByProcedure>}*/}
              </div>
            </div>
            {/*<ChartByProcedure procedure_Graph_Data = {this.state.procedure_Graph_Data}></ChartByProcedure>*/}
          </div>
        );
      }
      else{
        return(
          <ChartByProcedure procedure_Graph_Data = {this.state.procedure_Graph_Data} procedure_Graph_Data_List = {this.state.procedure_Graph_Data_List} files = {this.props.files}></ChartByProcedure>
        );
      }
    }
    // }
    // end of df/does not have df

    // else{
    //   console.log(" hi"+ this.props.currentStep)
    //   // console.log(" hi"+ this.state.procedure_Graph_Data)
    //   return (
    //     <div>
    //     </div>
    //   );
    // }





      // render
  }



}

export default ListOfVariables;