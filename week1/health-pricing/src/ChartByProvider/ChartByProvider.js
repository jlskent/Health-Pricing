// import { scaleLinear } from 'd3-scale';
// import { scaleBand } from 'd3-scale';

import React from 'react';
import './ChartByProvider.css';
import * as d3 from "d3";
import * as dataForge from 'data-forge';
import { Boxplot, computeBoxplotStats } from 'react-boxplot';
import d3Tip from 'd3-tip';
import BootstrapTable from 'react-bootstrap-table-next';
import {sliderBottom} from "d3-simple-slider";
import TableComponent from "../TableComponent/TableComponent";
import Dropdown from "react-bootstrap/Dropdown";




class ChartByProvider extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      tableData : [],
      data: null,
      data_list:[],
      files: [],
      receivedData: false

    };
    this.createBarChart = this.createBarChart.bind(this);
    this.updateTableData = this.updateTableData.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.renderTitle = this.renderTitle.bind(this);

  }

  componentDidMount() {
  }



  async componentWillReceiveProps(nextProps) {
    if ( this.props !== nextProps && nextProps.provider_Graph_Data && nextProps.provider_Graph_Data_List.length < 2) {
      // console.log("receiving props in chartByProvider "+ nextProps);
      this.createBarChart(nextProps.provider_Graph_Data);
      this.setState({data: nextProps.provider_Graph_Data});
      this.setState({receivedData: true});
      const providerNameReceived = nextProps.provider_Graph_Data.toArray()[0].BILLING_PROV_NM;
      this.setState({currentProvider: providerNameReceived});
    }

    if ( this.props !== nextProps && nextProps.provider_Graph_Data_List ) {
      // if (this.state.data_list.length === 3) return;
      if ( nextProps.provider_Graph_Data_List.length===2  ){
        this.setState({receivedData: true});
        console.log("receiving props in procedure "+ nextProps.provider_Graph_Data_List.length);
        this.setState({files: nextProps.files});
        this.setState({data_list: nextProps.provider_Graph_Data_List} , () =>{
          this.createBarChart(this.state.data_list[0]);
          const providerNameReceived = this.state.data_list[0].toArray()[0].BILLING_PROV_NM;
          this.setState({currentProvider: providerNameReceived});
        });
        console.log("Chart Component receiving  "+nextProps.provider_Graph_Data_List.length);
      }
    }




  }

  componentDidUpdate() {
  }



  /*
  * handle event when clicking on the certain provider
  * */
  updateTableData (group){
    // const groupName = group.getSeries('CPT_CODE').first();
    let tableData = [...this.state.tableData];
    // tableData.push(group);
    // this.setState({ tableData });

    // console.log(tableData.toString());

    if(tableData.indexOf(group) === -1) {
      tableData.push(group);
      this.setState({ tableData });

    }




    // here to show data being posted !!!!!!
    // console.log("state " + this.state.tableData);

    // this.setState(prevState => ({
    //   tableData: [...prevState.tableData, group]
    // }));

    // this.setState({ tableData: group});


    // console.log("setting state data" + this.state.tableData)
  }




  renderButtons() {
    if (this.state.receivedData){
      return(
        <button className="btn btn-outline-primary" onClick={this.resetZoom}>reset view</button>
      );
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





  createBarChart = (data) => {
    //clean-up old graph
    d3.select("#graph").remove();
    d3.select("#value-fill").remove();
    d3.select("#legend").remove();


    console.log("receiving data in fun" + data)
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
    const theGroups = theData.groupBy(row => row.CPT_CODE);
      // .select(group => {
      //   return {
      //     BILLING_PROV_NM: group.first().BILLING_PROV_NM,
      //     Charges: group.deflate(row => row.Charges),
      //     Payments: group.deflate(row => row.Payments),
      //   };
      // }).inflate().after(0);



    console.log("group by cpt\n "+ theGroups);


    const listOfGroupNames = theGroups
      .select(group => (
         group.first().CPT_CODE)
     ).toArray();
    // console.log("list of groups (grouped by cpt) "+listOfGroupNames);

    // get max/min value of col payment && charges for scaling
    const chargeSeriesAll = theData.getSeries("Charges").parseInts().after(0);
    const paymentSeriesAll = theData.getSeries("Payments").parseInts().after(0);
    var max = 0;
    var min = 0;

    for (const group of theGroups) {
      const chargeSeries = group.getSeries("Charges").parseInts();
      const paymentSeries = group.getSeries("Payments").parseInts();
      const positiveChargeSeries = chargeSeries.after(0).select(value => Math.abs(value));
      const positivePaymentSeries = paymentSeries.after(0).select(value => Math.abs(value));

      if (positiveChargeSeries.toArray().length <1) {return;}


      const chargeStats = computeBoxplotStats(positiveChargeSeries.toArray());
      const paymentStats = computeBoxplotStats(positivePaymentSeries.toArray());
      var maxOfTwo = Math.max(chargeStats.whiskerHigh, paymentStats.whiskerHigh);
      max = Math.max(maxOfTwo, max);
      var minOfTwo = Math.min(chargeStats.whiskerLow, paymentStats.whiskerLow);
      min = Math.min(minOfTwo, min);
    }


      //console.log("max value  "+ max);

    const xScale = d3.scaleBand()
      .range([40, dimensions.width])
      .domain(listOfGroupNames);
      // .padding(0.2);
    const yScale = d3.scaleLinear().nice()
      .range([dimensions.height, 0])
      .domain([min< 0 ? min*1.2 :min*1.2, max*1.2]);


    graph.append("rect")
      .attr("width", dimensions.width)
      .attr("height", dimensions.width)
      .style("fill", "white");


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


    var textSize = Math.min(xScale.bandwidth()/5,10);
    var textSizeY = Math.max(xScale.bandwidth()/5,10);
    if (textSizeY < 10 || textSizeY > 20) textSizeY = 10;

    // continue to draw axis
    graph.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + dimensions.height +")")
      // .style("font-size", function(d) { return ( `${xScale.bandwidth()/5}px`); })
      .style("font-size", function(d) { return ( `${textSize}px`); })
      // .style("font-size", function(d) { return ( "font-max-size: 15px"); })
      .call(x_axis);


    graph.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(40, 0)")
      .style("font-size", function(d) { return ( `${textSizeY}px`); })
      // .style("style", function(d) { return ( "font-min-size: 20px"); })
      .call(y_axis);



    //slider
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


    // const arr = theGroups.toArray();
    // const drawBackGroundRect = (data) => {
    //
    //   graph
    //     .selectAll("rect")
    //     .data(data)
    //     .enter()
    //     .append("rect").attr('class', 'back_ground_bar')
    //     .attr("x", (d) => xScale(d.getSeries('CPT_CODE').first()))
    //     .attr("y", yScale(max*1.2))
    //     .attr("width", xScale.bandwidth())
    //     .attr("height", yScale(min-max))
    //     .style("fill", "green")
    //     // .style("opacity", "0")
    //     .on("click", (d) =>  {
    //       console.log(d);
    //       // update(group);
    //     } );
    // };
    //
    // drawBackGroundRect(arr);

    graph.append("g").attr("id", "whiteBar");



    // iterate each group and draw box plot
    for (const group of theGroups) {


      const groupName = group.getSeries('CPT_CODE').first();
      // console.log("a group\n "+ group);
      //console.log("group name  "+ groupName);
      //console.log("max value  "+ max);


      const chargeSeries = group.getSeries("Charges").parseInts();
      const paymentSeries = group.getSeries("Payments").parseInts();



      const positiveChargeSeries = chargeSeries.after(0).select(value => Math.abs(value));
      const positivePaymentSeries = paymentSeries.after(0).select(value => Math.abs(value));



      // console.log("a group payment  "+ paymentSeries);
      const chargeStats = computeBoxplotStats(positiveChargeSeries.toArray());
      const paymentStats = computeBoxplotStats(positivePaymentSeries.toArray());




      // min = chargeSeries.min();
      // max = chargeSeries.max();

      // console.log("groupName "+groupName);

      const update = (group) => {
        this.updateTableData(group);
      };



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
            const cpt_code = d.getSeries('CPT_CODE').first();
            const position = xScale(cpt_code);
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
          } )
          .on('mouseover' , tipForBar.show)
          .on('mouseout', tipForBar.hide);
      };

      const xPosition = xScale(groupName);


      // so lets pass scale ticks instead
      const minTickPos = yScale.ticks()[0] - (yScale.ticks()[0]-yScale.ticks()[0]);
      const maxTickPos = yScale.ticks()[yScale.ticks().length - 1];
      // console.log("ysclae ticks "+ minTickPos + maxTickPos);

      drawBackGroundRect(xPosition, maxTickPos, minTickPos, group);
      drawOneBoxPlot(chargeStats, xPosition, max, min, colors.blue);
      drawOneBoxPlot(paymentStats, xPosition + xScale.bandwidth()/2, max, min, colors.red);

    }






    /*
    * function to draw invisible rectangle for a single provider
    * for later click on
    * so each group is the same provider and CPT code
    *
    * */









    /*
    * function to draw a box plot of a single provider
    *
    * */
    function drawOneBoxPlot(stats, xPosition, max, min ,color) {

      // console.log("stats per group " + JSON.stringify(stats));


      // console.log(color);
      // // const anchor = d3.select(node);
      //
      // // const yScale = d3.scaleLinear()
      // //   .range([dimensions.height, 0])
      // //   .domain([min< 0 ? min*1.2 :min*1.2, max*1.2]);
      // //
      // // const y_axis = d3.axisLeft()
      // //   .scale(yScale);
      //
      // console.log("max " + max + "min" + min);
      // console.log("stats per group " + JSON.stringify(stats));
      // console.log("yScale q3 " + yScale(stats.quartile3) + ",q1 " + yScale(stats.quartile1));
      // console.log("yScale high " + yScale(stats.whiskerHigh) + ",low " + yScale(stats.whiskerLow));
      // console.log("yScale 0 " + yScale(0) + ",q1 " + yScale(stats.quartile1));



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
      graph.call(tip);



      // console.log("stats " + JSON.stringify(stats));


      var data_sorted = stats.outliers.length>0 ? stats.outliers: [NaN];

      // console.log("stats " + data_sorted);

      // append dots
      anchor.select("g").selectAll("dot")
        .data(data_sorted)
        .enter()

        .each(function (d,i) {
          if(d){
            d3.select(this).append('circle')
              .attr("r", Math.min(xScale.bandwidth() / 25, 4))
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
  }




  renderTitle(){
    if (!this.state.receivedData){
      return(
        <p className="h4" id = "header">BoxPlot Visualization </p>
      )
    }

    else return(
      <div>
          <p className="h4" id = "header">BoxPlot Visualization </p>
          <p className="h4" id = "providerName">Provider: {this.state.currentProvider}</p>
      </div>
    )
  }


  removeTableData = (index) =>{
    this.setState((prevState) => ({
      tableData: prevState.tableData.filter((_, i) => i !== index)
    }));
  };


  renderTimeList(){

    if (this.props.files && this.props.files.length > 1){
      var index = 0;
      const fileList = this.state.files.map(x => {
        const name = x.name;
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


  switchTime(e){
    const index = parseInt(e.target.value);
    console.log("switching time" + e.target.value);
    console.log("data" + this.state.data_list[index]);
    if (this.state.data_list.length > 1) {
      console.log("len >1" );
      this.setState({data: this.state.data_list[index]}, () => {
        this.setState({currentProvider: this.state.data.toArray()[0].BILLING_PROV_NM});
        this.createBarChart(this.state.data);
      });
    }
  }


  render() {
  // console.log("do i have it " + this.props.uploadSuccess);



    return(
      <div className="">
        {this.renderTitle()}
        {this.renderButtons()}
        {this.renderTimeList()}

        <div className="scaling-svg-container">
        <svg ref={ node => this.node = node } width="100%" height="auto" class="svg-content"  ></svg>
        {/*<svg ref={node => this.node = node}  width ="3000" height= "1000" className="svg-content" overflow="auto" ></svg>*/}

        </div>


        <div className="">
          <TableComponent tableData = {this.state.tableData} removeTableData = {this.removeTableData}></TableComponent>
        </div>
      </div>
    );
  }





}

export default ChartByProvider;