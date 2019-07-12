// import { scaleLinear } from 'd3-scale';
// import { scaleBand } from 'd3-scale';
// import data from '../Data/sample_data.csv';

import React from 'react';
import './ChartByProcedure.css';
import * as d3 from "d3";
import * as dataForge from 'data-forge';
import { Boxplot, computeBoxplotStats } from 'react-boxplot';
import d3Tip from 'd3-tip';
import { sliderBottom } from 'd3-simple-slider';




class ChartByProcedure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // dataSorted : [],
      data:null,
      receivedData: false
    };

    this.createBarChart = this.createBarChart.bind(this);
    this.resetZoom = this.resetZoom.bind(this);

  }


  componentDidMount() {
  }

  async componentWillReceiveProps(nextProps) {
    if ( this.props !== nextProps && nextProps.procedure_Graph_Data) {
      // console.log("receiving props in chartByProvider "+ nextProps.procedure_Graph_Data);
      this.createBarChart(nextProps.procedure_Graph_Data);
      this.setState({data: nextProps.procedure_Graph_Data});
      this.setState({receivedData: true});

    }
  }

  componentDidUpdate() {
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
    console.log(defaultTransform);
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
        width: clientWidth - 150,
        height: 500,
        half: 250,
        halfBarWidth : 50,
        tailLength: 30,
        margin: 40
      };
    var graph = anchor.append("g").attr("id", "graph");
    const colors = { blue: '#6b89ba', red: 'red'};



    // group by provider
    const theGroups = theData.groupBy(row => row.BILLING_PROV_NM).after(0);
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
      const chargeStats = computeBoxplotStats(chargeSeries.toArray());
      const paymentStats = computeBoxplotStats(paymentSeries.toArray());
      var maxOfTwo = Math.max(chargeStats.whiskerHigh, paymentStats.whiskerHigh);
      max = Math.max(maxOfTwo, max);
      // console.log("hihihihi" + maxOfTwo);
      var minOfTwo = Math.min(chargeStats.whiskerLow, paymentStats.whiskerLow);
      min = Math.min(minOfTwo, min);
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
      .attr("x1", 0)
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
      .width(300)
      .tickFormat(d3.format('.2%'))
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
      .attr('transform', 'translate(30,30)');
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










    // iterate each group and draw box plot
    for (const group of theGroups) {
      const groupName = group.getSeries('BILLING_PROV_NM').first();
      console.log("a group\n "+ group);
      //console.log("group name  "+ groupName);
      //console.log("max value  "+ max);

      const chargeSeries = group.getSeries("Charges").parseInts();
      const paymentSeries = group.getSeries("Payments").parseInts();

      // console.log("a group payment  "+ paymentSeries);
      const chargeStats = computeBoxplotStats(chargeSeries.toArray());
      const paymentStats = computeBoxplotStats(paymentSeries.toArray());

      // min = chargeSeries.min();
      // max = chargeSeries.max();

      const xPosition = xScale(groupName);

      drawOneBoxPlot(chargeStats, xPosition, max, min, colors.blue);
      drawOneBoxPlot(paymentStats, xPosition + xScale.bandwidth()/2, max, min, colors.red);


      graph.selectAll(".back").data(chargeStats)
        .enter().append("rect")
        .attr("class", "back")
        .attr("x", function(d) { return xPosition; })
        .attr("width", xScale.bandwidth())
        .attr("y", function(d) { return 0; })
        .attr("height", function(d) { return yScale(max); })
        .style("fill", "grey");

      // anchor.addEventListener('scroll', function(evt) {
        // label.node().setAttribute('y', 10 + this.scrollTop);
      // }, false)
    }








    function drawOneBoxPlot(stats, xPosition, max, min ,color) {

      // console.log(color);
      // const anchor = d3.select(node);

      // const yScale = d3.scaleLinear()
      //   .range([dimensions.height, 0])
      //   .domain([min< 0 ? min*1.2 :min*1.2, max*1.2]);
      //
      // const y_axis = d3.axisLeft()
      //   .scale(yScale);

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


      // const tip = d3Tip().attr('class', 'd3-tip').html(function(d) {
        // lines.selectAll('dashLines').style("display",null);
        // lines.style("display",null);
      //   return "value:" + d.toString();
      // });
      // anchor.call(tip);


      // alternative
      // var toolbar = document.getElementById("toolbar");
      // toolbar.onclick = function (e) {
      //   alert("Hello");
      // };


    }
    //end of draw


    // function resetZoom(e){
    //   // console.log(this.node);
    //   var node = this.node;
    //   // const currentTransform = d3.zoomIdentity;
    //   // d3.select(node).attr("transform", currentTransform)
    // }




  }
  //end of createBarChart()


  render() {

    return(
      <div className="scaling-svg-container">
        {this.renderButtons()}
        {/*<button className="btn btn-outline-primary" onClick={this.resetZoom}>reset view</button>*/}
        <svg ref={ node => this.node = node } width="100%" height="auto" class="svg-content"  ></svg>
      </div>
    );


  }





}

export default ChartByProcedure;