// import { scaleLinear } from 'd3-scale';
// import { scaleBand } from 'd3-scale';
// import data from '../Data/sample_data.csv';

import React from 'react';
import './ChartByProvider.css';
import * as d3 from "d3";
import * as dataForge from 'data-forge';
import { Boxplot, computeBoxplotStats } from 'react-boxplot';
import d3Tip from 'd3-tip';




class ChartByProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSorted : [],
    };

    // this.xScale = scaleBand();
    // this.yScale = scaleLinear();
    this.createBarChart = this.createBarChart.bind(this)
  }

  componentDidMount() {
  }

  async componentWillReceiveProps(nextProps) {
    if ( this.props !== nextProps && nextProps.wholeData) {
      console.log("receiving props in chartByProvider "+ nextProps);
      this.createBarChart(nextProps.wholeData);
    }
  }

  componentDidUpdate() {
  }





  createBarChart(data) {
    //clean-up old graph
    d3.select(this.node).selectAll("line").remove();
    d3.select(this.node).selectAll("rect").remove();
    d3.select(this.node).selectAll("text").remove();
    d3.select(this.node).selectAll("circle").remove();


    // variables
    var theData = new dataForge.DataFrame(data);
    console.log("create bar chart provider\n "+ theData);
    var node = this.node;
    var anchor = d3.select(node);
    const dimensions = { width: 1000, height: 500, half: 250, halfBarWidth : 50, tailLength: 30, margin: 40};


    // group by provider
    const theGroups = theData.groupBy(row => row.CPT_CODE).after(0);
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
    console.log("list of groups (grouped by cpt) "+listOfGroupNames);

    // get max/min value of col payment && charges for scaling
    const chargeSeriesAll = theData.getSeries("Charges").parseInts().after(0);
    const paymentSeriesAll = theData.getSeries("Payments").parseInts().after(0);
    var max = 0;
    var min = 0;

    for (const group of theGroups) {
      const chargeSeries = group.getSeries("Charges").parseInts();
      const paymentSeries = group.getSeries("Payments").parseInts();
      const chargeStats = computeBoxplotStats(chargeSeries.toArray());
      const paymentStats = computeBoxplotStats(paymentSeries.toArray());
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
    const yScale = d3.scaleLinear()
      .range([dimensions.height, 0])
      .domain([min< 0 ? min*1.2 :min*1.2, max*1.2]);
      // .domain([0, max*1.2]);

    const x_axis = d3.axisBottom()
      .scale(xScale);
    // anchor.append("g").attr("transform", "translate(0," + dimensions.height +")").call(x_axis);

    anchor.append("g").attr("transform", "translate(0," + dimensions.height +")").style("font", "2px times").call(x_axis);

    const y_axis = d3.axisLeft()
      .scale(yScale);
    anchor.append("g").attr("transform", "translate(40, 0)").style("font", "4px times").call(y_axis);
    // anchor.select("g").attr("transform", "translate(40, 0)");
    anchor.append("p");


    //
    // var currentTransform = null;
    // var zoom = d3.zoom()
    //   .scaleExtent([0.5, 5])
    //   .translateExtent([
    //     [-dimensions.width * 2, -dimensions.height * 2],
    //     [dimensions.width * 2, dimensions.height * 2]
    //   ])
    //   .on("zoom", zoomed);
    //
    // function zoomed() {
    //   currentTransform = d3.event.transform;
    //   anchor.attr("transform", currentTransform);
    //   gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
    //   gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
    //   slider.property("value", d3.event.scale);
    // }





    // iterate each group and draw box plot
    for (const group of theGroups) {
      const groupName = group.getSeries('CPT_CODE').first();
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

      drawOneBoxPlot(chargeStats, xPosition, max, min, "#6b89ba");
      drawOneBoxPlot(paymentStats, xPosition + xScale.bandwidth()/2, max, min, "red");


      anchor.selectAll(".back").data(chargeStats)
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

      console.log(color);
      // const anchor = d3.select(node);

      // const yScale = d3.scaleLinear()
      //   .range([dimensions.height, 0])
      //   .domain([min< 0 ? min*1.2 :min*1.2, max*1.2]);
      //
      // const y_axis = d3.axisLeft()
      //   .scale(yScale);

      console.log("max " + max + "min" + min);
      console.log("stats per group " + JSON.stringify(stats));
      console.log("yScale q3 " + yScale(stats.quartile3) + ",q1 " + yScale(stats.quartile1));
      console.log("yScale high " + yScale(stats.whiskerHigh) + ",low " + yScale(stats.whiskerLow));

      console.log("yScale 0 " + yScale(0) + ",q1 " + yScale(stats.quartile1));



      //draw center line
      anchor.append("line")
        .attr("x1", xPosition + xScale.bandwidth() / 4)
        .attr("x2", xPosition + xScale.bandwidth() / 4)
        .attr("y1", yScale(stats.whiskerLow))
        .attr("y2", yScale(stats.whiskerHigh))
        .attr("stroke", "silver");

      //console.log("y "  + stats.quartile3 + ", " + stats.quartile1);
      // console.log("xPos  "+ xPosition);
      anchor.append("rect").attr('class', 'bar')
        .attr("x", xPosition)
        .attr("y", yScale(stats.quartile3))
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", yScale(stats.quartile1) - yScale(stats.quartile3))
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .style("fill", color);


      // draw the low line/ high line
      anchor.append("line").attr('class', 'lines')
        .attr("x1", xPosition)
        .attr("x2", xPosition + xScale.bandwidth() / 2)
        .attr("y1", yScale(stats.whiskerLow))
        .attr("y2", yScale(stats.whiskerLow));

      anchor.append("line").attr('class', 'lines')
        .attr("x1", xPosition)
        .attr("x2", xPosition + xScale.bandwidth() / 2)
        .attr("y1", yScale(stats.whiskerHigh))
        .attr("y2", yScale(stats.whiskerHigh));


      // // draw the median line
      anchor.append("line").attr('class', 'medianLine')
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



    }
  }



  render() {
  // console.log(this.props.cpt_Graph_Data);
    return(
      <div className="scaling-svg-container">
        <svg ref={ node => this.node = node } width="100%" height="auto" class="svg-content"  ></svg>
        {/*<svg ref={node => this.node = node}  width ="3000" height= "1000" className="svg-content" overflow="auto" ></svg>*/}
      </div>
    );
  }





}

export default ChartByProvider;