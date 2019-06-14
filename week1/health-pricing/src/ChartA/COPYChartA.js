import React from 'react';
import './ChartA.css';
import { scaleLinear } from 'd3-scale';
import { scaleBand } from 'd3-scale';
import data from '../Data/sample_data.csv';
import * as d3 from "d3";
// import Data from '../Data/Data'


class ChartA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qData : [],
    };

    // this.xScale = scaleBand();
    // this.yScale = scaleLinear();
    this.createBarChart = this.createBarChart.bind(this)
  }

  componentDidMount() {
    this.createBarChart();

  }

  componentDidUpdate() {
    // this.createBarChart()
  }


  createBarChart() {

    var providerArray = [];
    var chargeArray = [];
    var theData = [];

    //retrieve Data obj
    d3.csv(data, function(d) {
      return {
        provider : d['BILLING_PROV_NM'],
        charge : d['Charges'],
        cptCode : d['CPT_CODE'],
      };
    }).then(function(data) {
      data.forEach(function (row) {
        // we got a row object
        // providerArray.push(row.provider);
        // chargeArray.push(row.charge);
        theData.push(row);
      });
      nowDrawTheChart();
    });




    const node = this.node;

    function nowDrawTheChart() {
      // console.log(theData[498].charge);
      // console.log(Object.values(providerArray));
      theData = theData.slice(1,200);
      const margins = { top: 200, right: 20, bottom: 100, left: 60 };
      const dimensions = { width: 1000, height: 600 };
      const barWidth = dimensions.width/theData.length;
      const maxValue = Math.max(...theData.map(d => d.charge));


      const xScale = d3.scaleBand()
        .range([0, dimensions.width])
        .domain(theData.map((x) => x.provider))
        .padding(0.2);

      const yScale = d3.scaleLinear()
        .range([dimensions.height, 0])
        .domain([0, maxValue*1.2]);

      console.log(xScale.bandwidth());

      const anchor = d3.select(node);
      const bars = anchor.selectAll('rect')
        .data(theData)
        .enter()
        .append('rect')
        .attr("x", (d, i) => xScale(d.provider))
        .attr("y", (d, i) => yScale(d.charge))
        .attr("width", xScale.bandwidth())
        .attr("height", (d,i) => dimensions.height - yScale(d.charge))
        .attr("fill", "steelblue");

      const axis = anchor.select("axis x_axis")
        .append('axis x_axis')
        .attr("class", "axis x_axis")
        .attr("transform", "translate(0," + dimensions.height + ")")
        .call(d3.axisBottom(xScale));


      const text = anchor.selectAll('text')
        .data(theData)
        .enter()
        .append('text')
        .attr("x", (d, i) => xScale(d.provider))
        .attr("y", (d, i) => yScale(d.charge))
        .attr("dx", barWidth / 2)
        .attr("dy", "0.5em")// it seems change y position
        .attr("text-anchor", "middle")
        .style("fill", "red")
        .style("font-size", "12px")
        .text(d => d.charge)


    }

    //variables

    // const maxValue = Math.max(...Data.map(d => d.value));

    //get an array to iterate

    // const xScale = this.xScale
    //   .domain(Data.map(d => d.title))
    //   .padding(0.5)
    //   .range([margins.left, svgDimensions.width - margins.right]);
    //
    // const yScale = this.yScale
    //   .domain([0, maxValue])
    //   .range([svgDimensions.height - margins.bottom, margins.top]);
    //
    // const anchor = d3.select(node);
    //
    // anchor.append('rect')
    //   .attr('height', 500)
    //   .attr('width', 500)
    //   .style('fill', 'black')
    //
    //
    // const a = anchor.selectAll('rect')
    //   .Data(Data)
    //   .enter()
    //   .append('rect')
    //   .attr("x", (d, i) => i * 70)
    //   .attr("y", (d, i) => 10 * d)
    //   .attr("width", 25)
    //   .attr("height", (d, i) => d)
    //   .attr("fill", "green");








  }



  render() {
    console.log("chartA");
    return(
    <svg ref={ node => this.node = node } width={1000} height={600}></svg>
    );
  }





}

export default ChartA;