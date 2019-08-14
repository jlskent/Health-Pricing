// import { scaleLinear } from 'd3-scale';
// import { scaleBand } from 'd3-scale';
// import data from '../Data/sample_data.csv';
// import TableComponent from "../TableComponent/TableComponent";

import React from 'react';
import './ChartByProcedure.css';
import * as d3 from "d3";
import * as dataForge from 'data-forge';
import { Boxplot, computeBoxplotStats } from 'react-boxplot';
import d3Tip from 'd3-tip';
import { sliderBottom } from 'd3-simple-slider';
import TableComponentForProc from "../TableComponentForProc/TableComponentForProc";
import Dropdown from "react-bootstrap/Dropdown";




class ChartByProcedure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // dataSorted : [],
      data:null,
      data_list:[],
      tableData : [],
      receivedData: false,
      files: []

    };

    this.createBarChart = this.createBarChart.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.updateTableData = this.updateTableData.bind(this);
    this.switchTime = this.switchTime.bind(this);

  }


  componentDidMount() {
    console.log("chart mounted")
  }

  async componentWillReceiveProps(nextProps) {
    // console.log("receiving data inside chart component");

    if ( this.props !== nextProps && nextProps.procedure_Graph_Data && !nextProps.procedure_Graph_Data.length < 2) {
      // console.log("receiving props in chartByProvider "+ nextProps.procedure_Graph_Data);
      this.setState({data: nextProps.procedure_Graph_Data}, () => {
        this.setState({receivedData: true});
        this.createBarChart(this.state.data);
      });


      const procedureCodeReceived = nextProps.procedure_Graph_Data.toArray()[0].PROC_CODE;
      const procedureNameReceived = nextProps.procedure_Graph_Data.toArray()[0].PROC_NAME;
      this.setState({currentProcedureName: procedureNameReceived});
      this.setState({currentProcedureCode: procedureCodeReceived});
      // this.props.setCurrentStep('generateGraph');
    }




    if ( this.props !== nextProps && nextProps.procedure_Graph_Data_List ) {
      // if (this.state.data_list.length === 3) return;
      if ( nextProps.procedure_Graph_Data_List.length===2  ){
        this.setState({receivedData: true});
        this.setState({files: nextProps.files});

        console.log("receiving props in procedure "+ nextProps.procedure_Graph_Data_List.length);

        this.setState({data_list: nextProps.procedure_Graph_Data_List} , () =>{
          const procedureCodeReceived = this.state.data_list[0].toArray()[0].PROC_CODE;
          const procedureNameReceived = this.state.data_list[0].toArray()[0].PROC_NAME;
          console.log("received name" + procedureCodeReceived)

          this.setState({currentProcedureName: procedureNameReceived});
          this.setState({currentProcedureCode: procedureCodeReceived});
          this.createBarChart(this.state.data_list[0]);

        });
        console.log("Chart Component receiving  "+nextProps.procedure_Graph_Data_List.length);
      }
    }
  }


  componentDidUpdate() {
    // this.renderTitle()
  }



  componentWillMount() {
    this.clearTableData()

  }

  renderButtons() {
    if (this.state.receivedData){
      return(
          <button className="btn btn-outline-primary" onClick={this.resetZoom}>reset view</button>
      );
    }
  }




  switchTime(e){
    const index = parseInt(e.target.value);
    console.log("switching time" + e.target.value);
    if (this.state.data_list.length > 1) {
      console.log("len >1" );
      this.setState({data: this.state.data_list[index]}, () => {
        console.log("data" + this.state.data);
        this.setState({currentProcedureName: this.state.data.toArray()[0].PROC_NAME});
        this.setState({currentProcedureCode: this.state.data.toArray()[0].PROC_CODE});
        this.createBarChart(this.state.data);
      });
    }
  }





  renderTimeList(){
    // console.log(this.props.files);
    // console.log(this.props.files.length);

    if (this.state.files && this.state.files.length >1){
      // const reverse = this.state.files.reverse();
      // this.setState({files: reverse})
      var index = 0;
      const fileList = this.state.files.map(x => {

        const name = x.name;
        // console.log("the name "+name);

        return (
          <Dropdown.Item as="button" value = {index++} onClick={(e) => this.switchTime(e)}>{name}</Dropdown.Item>
        );
      });


      return(
        <div  class="dropdown d-inline-block">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">Compare Over Time</Dropdown.Toggle>
            <Dropdown.Menu>
              {fileList}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    } else{
      return (
        <div className="dropdown d-inline-block">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic" disabled>Compare Over Time</Dropdown.Toggle>
            <Dropdown.Menu>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    }
  }



  clearTableData(){
    this.setState({  tableData : []  });
  }


  updateTableData (group) {
    // const groupName = group.getSeries('CPT_CODE').first();
    let tableData = [...this.state.tableData];
    //console.log(tableData.toString());
    if (tableData.indexOf(group) === -1) {
      tableData.push(group);
      this.setState({tableData});
    }
  }



  resetZoom(){
    // console.log(this.node);
    var node = this.node;
    const defaultTransform = d3.zoomIdentity;
    // console.log(defaultTransform);
    d3.select(node).attr("transform", defaultTransform);
    this.createBarChart(this.state.data)
  }






  createBarChart(data) {






    //clean-up old graph
    d3.select("#graph").remove();
    d3.select("#value-fill").remove();
    d3.select("#legend").remove();

    // variables
    var theData = new dataForge.DataFrame(data);
    // console.log("create bar chart provider\n "+ theData);
    var node = this.node;
    var anchor = d3.select(node);
    const clientWidth = this.node.parentNode.clientWidth;
    var dimensions =
      {
        client: clientWidth,
        width: clientWidth - 50,
        height: 500,
        half: 250,
        halfBarWidth : 50,
        tailLength: 30,
        margin: 40
      };
    var graph = anchor.append("g").attr("id", "graph");
    const colors = { blue: '#6b89ba', red: 'red'};



    // group by provider
    const theGroups = theData.groupBy(row => row.BILLING_PROV_NM);
      // .select(group => {
      //   return {
      //     BILLING_PROV_NM: group.first().BILLING_PROV_NM,
      //     Charges: group.deflate(row => row.Charges),
      //     Payments: group.deflate(row => row.Payments),
      //   };
      // }).inflate().after(0);

    const listOfGroupNames = theGroups
      .select(group => (
         group.first().BILLING_PROV_NM)
     ).toArray();
    // console.log(listOfGroupNames);

    // get max/min value of col payment && charges for scaling
    const chargeSeriesAll = theData.getSeries("Charges").parseInts().after(0);
    const paymentSeriesAll = theData.getSeries("Payments").parseInts().after(0);
    // var max = Math.max(chargeSeriesAll.max(), paymentSeriesAll.max());
    // var min = Math.min(chargeSeriesAll.min(), paymentSeriesAll.min());
    var max = 0;
    var min = 0;

    // calculate range
    for (const group of theGroups) {
      const chargeSeries = group.getSeries("Charges").parseInts();
      const paymentSeries = group.getSeries("Payments").parseInts();
      // console.log("hihihihi" + chargeSeries);

      const positiveChargeSeries = chargeSeries.after(0).select(value => Math.abs(value));
      const positivePaymentSeries = paymentSeries.after(0).select(value => Math.abs(value));
      if (positiveChargeSeries.toArray().length <1) {return;}
        const chargeStats = computeBoxplotStats(positiveChargeSeries.toArray());
        const paymentStats = computeBoxplotStats(positivePaymentSeries.toArray());
        var maxOfTwo = Math.max(chargeStats.whiskerHigh, paymentStats.whiskerHigh);
        max = Math.max(maxOfTwo, max);
        // console.log("hihihihi" + maxOfTwo);
        var minOfTwo = Math.min(chargeStats.whiskerLow, paymentStats.whiskerLow);
        min = Math.min(minOfTwo, min);
      // }


    }





    /*
    create axis
    */

    //console.log("max value  "+ max);
    const xScale = d3.scaleBand()
      .range([40, dimensions.width])
      .domain(listOfGroupNames);

    // console.log(xScale);
    const yScale = d3.scaleLinear()
      .range([dimensions.height, 0])
      .domain([min< 0 ? min*1.2 :min*1.2, max*1.2]);
      // .domain([0, max*1.2]);




    /*
    create a background (for drag)
    */
    graph.append("rect")
      .attr("width", dimensions.width)
      .attr("height", dimensions.width)
      .style("fill", "white");





    // draw axis
    var x_axis = d3.axisBottom().scale(xScale);
    var y_axis = d3.axisLeft().scale(yScale);



    // add grid

    //vertical
    graph.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(d3.range(40, dimensions.width, xScale.bandwidth()))
      .enter().append("line")
      .attr("x1", function(d) { return d; })
      .attr("y1", 0)
      .attr("x2", function(d) { return d; })
      .attr("y2", dimensions.height);

    // horizontal
    graph.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(y_axis.scale().ticks().map( (d) => yScale(d)))
      .enter().append("line")
      .attr("x1", 40)
      .attr("y1", function(d) { return d; })
      .attr("x2", dimensions.width)
      .attr("y2", function(d) { return d; });
    // console.log("ticks "+y_axis.scale().ticks());



    // continue to draw axis
    graph.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + dimensions.height +")")
      .style("font-size", function(d) { return ( `${xScale.bandwidth()/15}px`); })
      .call(x_axis);
    graph.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(40, 0)").style("font-size", function(d) { return ( `${xScale.bandwidth()/15}px`); })
      .call(y_axis);



    /*
    create slider
    */
    // construct the slider
    // note we can not append html elements(like div) to svg
    var data = [1, 1.5, 2, 2.5, 3,3.5,4];
    const sliderFill = sliderBottom()
      .min(d3.min(data))
      .max(d3.max(data))
      .width(200)
      .tickFormat(d3.format('.0%'))
      .ticks(5)
      .default(1)
      .fill('#2196f3')
      .handle(
        d3
          .symbol()
          .type(d3.symbolCircle)
          .size(100)()
      )
      .on('onchange', val => {
        slided(val);
      });

    const gRange = anchor
      .append("g")
      .attr("id", "value-fill")
      .attr('x', 800)
      .attr('width', 300)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(60,20)');
    gRange.call(sliderFill);

    // create new zoom behavior
    var zoom = d3.zoom()
      .scaleExtent([1, 4])
      .on("zoom", zoomed);

    // apply zoom behavior to graph
    graph.call(zoom);

    function zoomed(){
      const currentTransform = d3.event.transform;
      // graph.attr("transform", currentTransform);
      graph.attr("transform", currentTransform).call(() => x_axis, y_axis);
    }

    function slided(d) {
      // console.log(d);
      zoom.scaleTo(graph, d);
    }
    /*
    create slider
    */






    /*
    * create legend
    * */
    // console.log("parentnode width" + typeof clientWidth);
    anchor.append("g")
      .attr("id", "legend")
      .attr("transform", "translate(" + (clientWidth-200) +  ",0)");
    d3.select("g#legend")
      .append("circle")
      .attr("cx", 10)
      .attr("cy",10)
      .attr("r", 5)
      .style("fill" , colors.blue);
    d3.select("g#legend")
      .append("circle")
      .attr("cx", 10)
      .attr("cy",40)
      .attr("r", 5)
      .style("fill" , colors.red);
    d3.select("g#legend")
      .append("text")
      .attr("class", "legendText")
      .attr("x", 20)
      .attr("y",10)
      .text("Charge");
    d3.select("g#legend")
      .attr("class", "legendText")
      .append("text")
      .attr("x", 20)
      .attr("y",40)
      .text("Payment");





    /*
    * create grid
    *
    *
    * */

    graph.append("g").attr("id", "whiteBar");


    // iterate each group and draw box plot
    for (const group of theGroups) {
      const groupName = group.getSeries('BILLING_PROV_NM').first();
      // console.log("a group\n "+ group);
      //console.log("group name  "+ groupName);
      //console.log("max value  "+ max);

      const chargeSeries = group.getSeries("Charges").parseInts();
      const paymentSeries = group.getSeries("Payments").parseInts();



      // console.log("a group payment  "+ paymentSeries);


      const positiveChargeSeries = chargeSeries.after(0).select(value => Math.abs(value));
      const positivePaymentSeries = paymentSeries.after(0).select(value => Math.abs(value));


      // if (positiveChargeSeries.toArray().length < 1) {
      //   return;
      // }

      const chargeStats = computeBoxplotStats(positiveChargeSeries.toArray());
      const paymentStats = computeBoxplotStats(positivePaymentSeries.toArray());

      // min = chargeSeries.min();
      // max = chargeSeries.max();

      const xPosition = xScale(groupName);


      const update = (group) => {
        this.updateTableData(group);
      };


      // init tip for bar
      const tipForBar = d3Tip().attr('class', 'd3-tip-for-bar').html(function(d) {
        const chargeSeries = group.getSeries("Charges").parseInts();
        const paymentSeries = group.getSeries("Payments").parseInts();
        const positiveChargeSeries = chargeSeries.after(0).select(value => Math.abs(value));
        const positivePaymentSeries = paymentSeries.after(0).select(value => Math.abs(value));
        const chargeStats = computeBoxplotStats(positiveChargeSeries.toArray());
        const paymentStats = computeBoxplotStats(positivePaymentSeries.toArray());
        let res = "";
        for (var p in paymentStats) {
          if (paymentStats.hasOwnProperty(p)) {
            res += p + ": " + paymentStats[p] + "<br/>";
          }
        }
        return "Payments" + "<br/>" + res + "Click to pin"  ;
      });
      anchor.call(tipForBar);




      const drawBackGroundRect = (xPosition, max, min, group) => {
        var data = [];
        data.push(group);

        graph.select("g#whiteBar")
          .append("g")
          .selectAll("rect")
          .data(data)
          .enter()
          .append("rect").attr('class', 'back_ground_bar')
        // .attr("x", (d) => console.log(d))
        // .attr("x", (d) => console.log(d.toString()))
        // .attr("x", (d) => console.log())

          .attr("x", (d) => {
            const providerNameAsGroup = d.getSeries('BILLING_PROV_NM').first();
            const position = xScale(providerNameAsGroup);
            // console.log(position);
            return position;
          })
          // .attr("y", 300)
          // .attr("width", 200)
          // .attr("height", 400)
          // .attr("y", yScale(max*1.2))

          .attr("y", 0)
          .attr("width", xScale.bandwidth())
          .attr("height", dimensions.height)
          .style("fill", "green")
          .style("opacity", "0")
          .on("click", (d) =>  {
            // console.log(d);
            this.updateTableData(d);
            update(d);
          })
          .on('mouseover' , tipForBar.show)
          .on('mouseout', tipForBar.hide);


        ;
      };



      const minTickPos = yScale.ticks()[0] - (yScale.ticks()[0]-yScale.ticks()[0]);
      const maxTickPos = yScale.ticks()[yScale.ticks().length - 1];
      drawBackGroundRect(xPosition, maxTickPos, minTickPos, group);
      drawOneBoxPlot(chargeStats, xPosition, max, min, colors.blue);
      drawOneBoxPlot(paymentStats, xPosition + xScale.bandwidth()/2, max, min, colors.red);


    }








    function drawOneBoxPlot(stats, xPosition, max, min ,color) {
      //draw center line
      graph.append("line")
        .attr("x1", xPosition + xScale.bandwidth() / 4)
        .attr("x2", xPosition + xScale.bandwidth() / 4)
        .attr("y1", yScale(stats.whiskerLow))
        .attr("y2", yScale(stats.whiskerHigh))
        .attr("stroke", "silver");

      //console.log("y "  + stats.quartile3 + ", " + stats.quartile1);
      // console.log("xPos  "+ xPosition);
      graph.append("rect").attr('class', 'bar')
        .attr("x", xPosition)
        .attr("y", yScale(stats.quartile3))
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", yScale(stats.quartile1) - yScale(stats.quartile3))
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .style("fill", color);


      // draw the low line/ high line
      graph.append("line").attr('class', 'lines')
        .attr("x1", xPosition)
        .attr("x2", xPosition + xScale.bandwidth() / 2)
        .attr("y1", yScale(stats.whiskerLow))
        .attr("y2", yScale(stats.whiskerLow));

      graph.append("line").attr('class', 'lines')
        .attr("x1", xPosition)
        .attr("x2", xPosition + xScale.bandwidth() / 2)
        .attr("y1", yScale(stats.whiskerHigh))
        .attr("y2", yScale(stats.whiskerHigh));


      // // draw the median line
      graph.append("line").attr('class', 'medianLine')
        .attr("x1", xPosition)
        .attr("x2", xPosition + xScale.bandwidth() / 2)
        .attr("y1", yScale(stats.quartile2))
        .attr("y2", yScale(stats.quartile2))
        .attr("stroke", "black");


      const tip = d3Tip().attr('class', 'd3-tip').html(function(d) {
        // lines.selectAll('dashLines').style("display",null);
        // lines.style("display",null);
        return "value:" + d.toString();
      });
      anchor.call(tip);


      // alternative
      // var toolbar = document.getElementById("toolbar");
      // toolbar.onclick = function (e) {
      //   alert("Hello");
      // };


      var data_sorted = stats.outliers.length>0 ? stats.outliers: [NaN];

      // console.log("stats " + data_sorted);

      // append dots
      anchor.select("g").selectAll("dot")
        .data(data_sorted)
        .enter()

        .each(function (d,i) {
          if(d){
            d3.select(this).append('circle')
              .attr("r", xScale.bandwidth() / 25)
              .attr("cx", (d,i) => xPosition + xScale.bandwidth() / 4)
              .attr("cy", (d,i ) => yScale(d))
              .attr("fill", "black")
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
          }else{
            d3.select(this).remove();
          }
        });

    }
    //end of draw





  }
  //end of createBarChart()





  renderTitle(){

    if (!this.state.receivedData){
      return (
        <div>        {/*<p className="h4" id = "header">BoxPlot Visualization </p>*/}
        </div>
      )
    }

    else return(
      <div>
        <p className="h4" id = "header">BoxPlot Visualization </p>
        <p className="h4" id = "procedureCode">Procedure Code: {this.state.currentProcedureCode}</p>
        <p id = "procedureName">({this.state.currentProcedureName})</p>
      </div>
    )
  }



  //used to remove table data (which is a list), the function is passed to child component
  removeTableData = (index) =>{
    this.setState((prevState) => ({
      tableData: prevState.tableData.filter((_, i) => i !== index)
    }));
  };

  render() {
    console.log("rendering from chart")



    return(

    <div>
      {this.renderTitle()}
      {this.renderButtons()}
      {this.renderTimeList()}

      <div className="scaling-svg-container">
        <svg ref={ node => this.node = node } width="100%" height="100%" className="svg-content"  ></svg>
      </div>
      <div className="">
        <TableComponentForProc tableData = {this.state.tableData} removeTableData = {this.removeTableData}></TableComponentForProc>
      </div>
    </div>
    );


  }





}

export default ChartByProcedure;