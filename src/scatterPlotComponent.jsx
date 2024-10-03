import React from "react";
import { useState,useEffect } from "react";
import * as d3 from 'd3';

const ScatterPlot = ()=>{

    const [data,setData] = useState([]);

    useEffect(()=>{
            try {
                fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
                .then((response)=>response.json())
                .then(data=>{
                    setData(data)
                });
                
            } catch (error) {
                console.error("This is the error "+ error);
            }
    
    },[]);

    useEffect(()=>{

         // Set dimensions
      const width = 800;
      const height = 400;
      const padding = 50;

        if(data.length>0){
            //the xscale
        const x =d3.scaleLinear()
        .domain([d3.min(data,(d)=>d.Year),d3.max(data,(d)=>d.Year)])
        .range([padding,width-padding]);


        //the yscale
        const parseTime = d3.timeParse("%M:%S");
        const y = d3.scaleTime()
        .domain([d3.min(data, d => parseTime(d.Time)), d3.max(data, d => parseTime(d.Time))])
        .range([height-padding, padding]);  // Reverse the range, so that the smallest times are at the top   
        
        const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"))
        const yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));

        const svg =  d3.select('#scatter-plot')
        .append('svg')
        .attr('width',width)
        .attr('height',height);

    //add the data points
    svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('circle')
    .attr('class','bar')
    .attr('cx',(d)=>x(d.Year))
    .attr('cy',(d)=>y(parseTime(d.Time)))
    .attr('r',"5px")
    .attr('fill',(d)=>d.Doping===""?'blue':'orange')
    .attr('data-yvalue',(d)=>y(parseTime(d.Time)))
    .attr('data-xvalue',(d)=>x(d.Year));

          // Append X axis
      svg
      .append("g")
      .attr("id","x-axis")
       .attr("class", "tick")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    // Append Y axis
    svg
        .append("g")
        .attr("id","y-axis")
         .attr("class", "tick")
         .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);
        }
    },[data]);
    
    //task remaining
    /* 
    move the scales so that starts from 1992 and its not in the the axis
    style the scatter plot
    tooltip and the submission
    */ 

    return (
        <>
        <div id="title">
            <p>Doping in Professional Bicycle Racing</p>
            <p>35 Fastest times up Alpe d'Huez</p>
        </div>
        <div id="scatter-plot"></div>
        </>
    )
}
 export default ScatterPlot;