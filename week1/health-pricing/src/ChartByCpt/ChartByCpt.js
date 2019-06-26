// import { scaleLinear } from 'd3-scale';
// import { scaleBand } from 'd3-scale';
// import data from '../Data/sample_data.csv';

import React from 'react';
import './ChartA.css';
import * as d3 from "d3";
import * as dataForge from 'data-forge';
import { Boxplot, computeBoxplotStats } from 'react-boxplot';
import d3Tip from 'd3-tip';




class ChartA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSorted : [],
    };

    this.createBarChart = this.createBarChart.bind(this)
  }

  componentDidMount() {
  }

  async componentWillReceiveProps(nextProps) {
    if ( this.props !== nextProps && nextProps.cpt_Graph_Data) {
      console.log("receiving props"+ nextProps);
      this.createBarChart(nextProps.cpt_Graph_Data);
    }
  }

  componentDidUpdate() {
  }


  // constructData() {
  //   console.log(this.props.cpt_Graph_Data)
  // }





  createBarChart(data) {

    console.log(data);
    d3.select("g").remove();

    // load data
    var theData = new dataForge.DataFrame(data);
    console.log("create bar chart "+ theData);
    const chargeSeries = theData.getSeries("Charges").parseInts();
    const dimensions = { width: 900, height: 300, half: 150, halfBarWidth : 50, tailLength: 30};
    var data_sorted = chargeSeries.orderBy(value => value).toArray();
    //console.log("before sorted " + chargeSeries.toArray());
    //console.log("sorted \n" + chargeSeries.orderBy(value => value));
    // data_sorted= [199, 201, 236, 269,271,278,283,291, 301, 303, 341];
    var min = chargeSeries.min();
    var max = chargeSeries.max();


    // compute values for boxplot -replace by api
    // var q1 = d3.quantile(data_sorted, .25);
    // var median = d3.quantile(data_sorted, .5);
    // var q3 = d3.quantile(data_sorted, .75);
    // var interQuantileRange = q3 - q1;
    // var min = q1 - 1.5 * interQuantileRange;
    // var max = q1 + 1.5 * interQuantileRange;
    //console.log("min " + min + " max "+ max + " q1 " +q1 + " q3 " + q3);

    const stats = computeBoxplotStats(data_sorted);
    console.log("stats "  + JSON.stringify(stats));

    /* some notes about box plot
    left line min
    left bar edge q1
    dashline in middle q2/median
    right bar edge q3
    right line max
    outliers larger or smaller than mean

    test data https://www.whatissixsigma.net/box-plot-diagram-to-identify-outliers/
    199, 201, 236, 269,271,278,283,291, 301, 303, and 341
    */


    const node = this.node;
    const anchor = d3.select(node);

    // const tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });


    // create scales
    const xScale = d3.scaleLinear()
      .domain([stats.whiskerLow < 0 ? stats.whiskerLow*1.5 :stats.whiskerLow/1.5, max*1.1])
      .range([0, dimensions.width]);
    const yScale = d3.scaleLinear()
      .range([dimensions.height/2, 0])
      .domain([0, 100]);

    //create axis
    const x_axis = d3.axisBottom()
      .scale(xScale);
    // anchor.append("g").attr("transform", "translate(20," + dimensions.height/2 +")").call(x_axis);
    anchor.append("g").attr("transform", "translate(0," + dimensions.height +")").call(x_axis);

    const y_axis = d3.axisLeft()
      .scale(yScale);
    // moves item 20 right and 0 down
    // anchor.append("g").call(y_axis);
    // anchor.append("g").attr("transform", "translate(20, 0)").call(y_axis);



    // for debugging only
    // const vis = anchor.append("myViz")
    //   .selectAll("div")
    //   .data(chargeSeries.toArray())
    //   .enter().append("div")
    //   .attr("class", function(d) { console.log(d); });


    // draw the center line
    anchor.select("g").append("line")
      .attr("x1", xScale(stats.whiskerLow))
      .attr("x2", xScale(stats.whiskerHigh))
      .attr("y1", -dimensions.half)
      .attr("y2", -dimensions.half)
      .attr("stroke", "black");

    // draw the rect
    // xScale(stats.quartile3) is the x coordinate of q3
    anchor.select("g").append("rect")
      .attr("x", xScale(stats.quartile1))
      .attr("y", - dimensions.half- dimensions.halfBarWidth)
      .attr("width", xScale(stats.quartile3)- xScale(stats.quartile1))
      .attr("height", dimensions.halfBarWidth * 2)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("fill", "#6b89ba");


    // draw text for q1 q3
    anchor.select("g").append("text")
      .attr("x", xScale(stats.quartile1))
      .attr("y", -dimensions.half - dimensions.tailLength)
      .attr("dy", "-5em")
      .attr("font-size", "15px")
      .attr("fill", "black")
      .text((d) => "q1");
    anchor.select("g").append("text")
      .attr("x", xScale(stats.quartile3))
      .attr("y", -dimensions.half - dimensions.tailLength)
      .attr("dy", "-5em")
      .attr("font-size", "15px")
      .attr("fill", "black")
      .text((d) => "q3");


    // draw the low line
    anchor.select("g").append("line").attr('class', 'lines')
      .attr("x1", xScale(stats.whiskerLow))
      .attr("x2", xScale(stats.whiskerLow))
      .attr("y1", -dimensions.half - dimensions.tailLength)
      .attr("y2", -dimensions.half + dimensions.tailLength)
      .attr("stroke", "black");

    // append text
    anchor.select("g").append("text")
      .attr("x", xScale(stats.whiskerLow))
      .attr("y", -dimensions.half - dimensions.tailLength)
      .attr("dy", "-5em")
      .attr("font-size", "15px")
      .attr("fill", "black")
      .text((d) => "low");

    // draw the high line
    anchor.select("g").append("line").attr('class', 'lines')
      .attr("x1", xScale(stats.whiskerHigh))
      .attr("x2", xScale(stats.whiskerHigh))
      .attr("y1", -dimensions.half - dimensions.tailLength)
      .attr("y2", -dimensions.half + dimensions.tailLength)
      .attr("stroke", "black");

    anchor.select("g").append("text")
      .attr("x", xScale(stats.whiskerHigh))
      .attr("y", -dimensions.half - dimensions.tailLength)
      .attr("dy", "-5em")
      .attr("font-size", "15px")
      .attr("fill", "black")
      .text((d) => "high");



    // draw the median line
    anchor.select("g").append("line").attr('class', 'medianLine')
      .attr("x1", xScale(stats.quartile2))
      .attr("x2", xScale(stats.quartile2))
      .attr("y1", -dimensions.half - dimensions.halfBarWidth)
      .attr("y2", -dimensions.half + dimensions.halfBarWidth)
      .attr("stroke", "black");





    //draw iteractive lines
    anchor.select("g").selectAll("dashLines")
        .style("display", "none")
        .append("line").attr('class', 'dashLine')
        .attr("x1", "x1")
        .attr("x2", "x2")
        .attr("y1", -dimensions.height)
        .attr("y2", 0)
        .attr("stroke", "black");




    const tip = d3Tip().attr('class', 'd3-tip').html(function(d) {
      // lines.selectAll('dashLines').style("display",null);
      // lines.style("display",null);
      return "value:" + d.toString();
    });
    anchor.call(tip);

    // draw interactive line


    // showLine(d) {
    //
    // }

    // draw some dots
    anchor.select("g").selectAll("dot")
      .data(data_sorted)
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("cx", (d) => xScale(d))
      .attr("cy", -dimensions.half)
      .attr("fill", "red")
      .on('mouseover', tip.show)

      // .on('mouseover', function () {
      //   return tip.style("visibility", "visible");
      // })
      .on('mouseout', tip.hide);
      // .on('mouseout', function (){
      //   lines.style("display", "none");
      // });



    // draw legend
    // anchor.select("g")
    //   .append("rect")
    //   .attr("x",900)
    //   .attr("y", - dimensions.half*1.5)
    //   .attr("width", 50)
    //   .attr("height", 150)
    //   .attr("stroke", "black")
    //   .attr("stroke-width", 1)











  }



  render() {
  // console.log(this.props.cpt_Graph_Data);
    return(
      <div className="scaling-svg-container">
        <svg ref={ node => this.node = node } width="100%" height={600} class="svg-content" ></svg>
      </div>
    );
  }





}

export default ChartA;