import React from 'react';
import './WelcomePage.css';
import * as d3 from "d3";
import {Link} from "react-router-dom";



class WelcomePage extends React.Component {
  constructor() {
    super(); // inherit parent methods

    this.state = {
      header: "Data Explorer",
      text: "A stub is an article deemed too short to provide encyclopedic coverage of a subject. " +
        "This page provides a general guide for dealing with stubs: the first section, Basic information, " +
        "contains information that is recommended for most users; and the second section, Creating stub types, " ,
      data: []
    }



  }

  // load after constructor
  componentDidMount(){
    this.drawCircles()
  }

  // https://codepen.io/ettrics/pen/jERWPP



  drawCircles() {
    // function parentWidth(elem) {
    //   return elem.parentElement.clientWidth;
    // }

    var width =parseFloat( d3.select('#main').style('width'));
    var height = parseFloat(d3.select('#main').style('height'));



    const array = [100, 300,200,10,124,1200, 1400, 400,700, 300, width-40, width-200, width-100];



    height = 800;
    var scale = d3.scaleLinear()
      .domain([0,1])
      .range([0,width]);



    var circleTime = d3.select("#main")
      .append("svg:svg")
      .attr("width", width)
      .attr("height", height);


    circleTime.append("rect")
      .attr("x",0)
      .attr("y",0)
      .attr("height",height)
      .attr("width",width)
      .style("fill", "white")
      .on("mousedown", animate);



    const max = 12;
    const min = 6;



    // make smaller to have full circles
    const group = circleTime.append("g");
    group
      .attr("id", "circleCanvas")
      .attr("width", width-50)
      .attr("height", height-50)
      .attr("transform", "translate(50, 50)");





    group.selectAll("circle")
      .data(array)
      .enter()
      .append("circle")
      .attr("class", "theCircles")
      .attr("cx", function(d,i){return (d/width + scale(Math.random()))})
      .attr("cy", function(d,i){return (.5+i)*d/13 + Math.random()})
      .attr("r", function(d,i){return Math.floor(Math.random() * (max - min + 1)) + min;})
      .attr("fill", function(){return randomcolor()});



    function animate(){
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function(d,i){return (d/width + scale(Math.random()))})
        .attr("cy", function(d,i){return (.5+i + Math.random())*d/13 })
        .attr("r", function(d,i){return Math.floor(Math.random() * (max - min + 1)) + min;})
        .attr("fill", function(){return randomcolor()});
    }

    function randomcolor(){
      return "#" + Math.random().toString(16).slice(2, 8) + "";
    }
  }


  // we have a hard code animation below
  // and we have a d3 circle top


  render(){
    return (
      <div id="main">
        <div className="mainBlock">
          <svg className='' width="400px" height="200px" viewBox="30 27 529 286" version="1.1">
            <g id="graph-copy" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(30.000000, 27.000000)">
              <g id="GRAPHS" transform="translate(64.000000, 16.000000)" stroke-linecap="round" stroke-width="8" stroke-linejoin="round">
                <polyline id="Banks" stroke="#5BCAC1"
                          points="0 1 88.0438662 1 128.985782 137 180.170616 137 224.189573 182 256.947867 91 301.990521 137 346.009479 91 392.087202 91 429.952607 179"></polyline>
                <polyline id="Bridge" stroke="#81DEFF"
                          points="2.04739336 183 54.2559242 227 96.2274882 47 133.080569 1 302.018438 1 346.680361 44.6280822 386.957346 0 427.905213 43"></polyline>
                <polyline id="PayPal" stroke="#F6F5A6"
                          points="2.04739336 180 53.273159 180 99.2985782 91 137.175355 47 219.077488 47 256.947867 90 301.990521 47 349.080569 137 398.228672 137 432 91"></polyline>
              </g>
              <g id="grid" transform="translate(46.618321, 4.750000)" stroke="#FFFFFF" stroke-linecap="square"
                 opacity="0.0800000057">
                <path d="M0.396183206,1.1875 L478.991396,1.1875" id="Line"></path>
                <path d="M0.396183206,32.8541667 L478.991396,32.8541667" id="Line"></path>
                <path d="M0.396183206,64.5208333 L478.991396,64.5208333" id="Line"></path>
                <path d="M0.396183206,96.1875 L478.991396,96.1875" id="Line"></path>
                <path d="M0.396183206,127.854167 L478.991396,127.854167" id="Line"></path>
                <path d="M0.396183206,159.520833 L478.991396,159.520833" id="Line"></path>
                <path d="M0.396183206,191.1875 L478.991396,191.1875" id="Line"></path>
                <path d="M0.396183206,222.854167 L478.991396,222.854167" id="Line"></path>
                <path d="M0.396183206,254.520833 L478.991396,254.520833" id="Line"></path>
              </g>
            </g>
          </svg>

          <h1 className="header">{this.state.header}</h1>
          <h5 className="texts">{this.state.text}</h5>

          <Link to="/upload">
            <button className="btn btn-primary btn-lg" id = "rounded_btn">Start Exploring</button>
          </Link>
        </div>


      </div>

  )
  }



}

export default WelcomePage;