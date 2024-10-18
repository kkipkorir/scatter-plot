import React from "react";
import { useState,useEffect } from "react";
import * as d3 from 'd3';

const ScatterPlot = ()=>{

    const [data,setData] = useState([]);
    const [message,setMessage]= useState('');;

    useEffect(()=>{
            try {
                setMessage("Fetching data ...")
                fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
                .then((response)=>response.json())
                .then(data=>{
                    setData(data)
                    setMessage("Done")
                });
                
            } catch (error) {
                console.error("This is the error "+ error);
                setMessage('Error');
            }
    
    },[]);

    useEffect(()=>{

         // Set dimensions
      const width = 900;
      const height = 500;
      const padding = 50;

        if(data.length>0){
            //the xscale
        const x =d3.scaleTime()
        .domain([d3.min(data,(d)=>new Date(d.Year-1)),d3.max(data,(d)=>new Date(d.Year+1))])
        .range([padding,width-padding]);


        
        const y = d3.scaleTime()
        .domain([d3.max(data, (d) => new Date(d.Seconds*1000)),
        d3.min(data,(d) => new Date(d.Seconds*1000))])
        .range([height-padding, padding]);  // Reverse the range, so that the smallest times are at the top   
        
        const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"))
        const yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S")).ticks(d3.timeSecond.every(15));
        const svg =  d3.select('#scatter-plot')
        .append('svg')
        .attr('width',width)
        .attr('height',height);

        //create the tool tip
       const toolTip = 
       d3.select("body")
       .append("div")
       .attr("id", "tooltip")
       .style("position", "absolute")
       .style("background", "#f9f9f9")
       .style("padding", "5px")
       .style("border", "1px solid #ccc")
       .style("border-radius", "5px")
       .style("pointer-events", "none")
       .style("opacity", "0");


    //add the data points
    svg
    .selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class','dot')
    .attr('cx',(d)=>x(new Date(d.Year)))
    .attr('cy',(d)=>y(new Date(d.Seconds*1000)))
    .attr('r',"5px")
    .attr('fill',(d)=>d.Doping===""?"blue":'orange')
    .attr('data-yvalue',(d)=>new Date(d.Year,1,0,0,0,d.Seconds))
    .attr('data-xvalue',(d)=>new Date(d.Year,1,0,0,0,d.Seconds))
    .on('mouseover',(event,d)=>{
       const theYear = d.Year;
       const theTime = d.Time;
       const theName = d.Name;
       const theCountry = d.Nationality;
       const theDoping = d.Doping;

        toolTip
        .transition()
        .duration(200)
        .style("opacity", 1); // Fade-in effect for tooltip

        toolTip
        .attr('data-year',new Date(d.Year,1,0,0,0,d.Seconds))
        .html(`${theName} : ${theCountry}<br/>Year: ${theYear}: Time: ${theTime} </br>${theDoping}`)
        .style("top", event.pageY - 28 + "px") // Position tooltip near mouse
        .style("left", event.pageX + 5 + "px")
    })
    .on("mouseout", function () {
      toolTip
        .transition()
        .duration(200)
        .style("opacity", 0);
    });

    
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
        
    //adding Legend
    svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', (-height / 2))
    .attr('y', padding/4)
    .attr('text-anchor', 'middle')
    .style('font-size', '20px')
    .text('Time (Minutes)');
 
    svg
    .append('text')
    .attr('x',width/2)
    .attr('y',height-(padding/4))
    .attr('text-anchor','middle')
    .attr('fonts-size','20px')
    .text('Years');
 
    svg.append('text')
    .attr('x',width-2*padding)
    .attr('y', height/2)
    .attr('text-anchor','end')
    .attr('dominant-baseline','middle')
    .style('font-size','10px')
    .text('Riders with doping allegations');
 
    svg.append('text')
    .attr('x',width-2*padding)
    .attr('y', 20+height/2)
    .attr('id','legend')
    .attr('text-anchor','end')
    .attr('dominant-baseline','middle')
    .style('font-size','10px')
    .text('No doping allegations');
 
    svg.append('circle')
    .attr('cx',width-(2*padding)+10)
    .attr('cy', height/2)
    .attr('r',5)
    .attr('fill','orange');
 
    svg.append('circle')
    .attr('cx',width-(2*padding)+10)
    .attr('cy',20+ height/2)
    .attr('r',5)
    .attr('fill','blue');
  
    }else
    {console.log(message)}},[data,message]);
    

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