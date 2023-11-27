import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const Network_visual = ({ key, raw_data, genderFilter, ageFilter }) => {
  useEffect(() => {
    if (raw_data) {
      const width = 928;
      const height = 600;
      
      const fData = raw_data.filter(d => {
        return (genderFilter ? d.Gender === genderFilter : true) &&
               (ageFilter ? d.Age === ageFilter : true);
      });

      const symptoms = ['Anxiety','Depression','Obsessive thinking','Mood swings','Panic attacks','Compulsive behavior','Tiredness']
      const data_nested = {}
      const symptom_counts = {}

      for (var i = 0; i < fData.length; i++) {
        for(var j=0;j < symptoms.length;j++){
          if(fData[i][symptoms[j]] === '1'){
            if(!(symptoms[j] in symptom_counts)){
              symptom_counts[symptoms[j]] = 0;
            }
            symptom_counts[symptoms[j]] += 1;
            for(var k=j + 1;k < symptoms.length;k++){
              if(fData[i][symptoms[k]] === '1'){
                if(!(symptoms[j] in data_nested)){
                  data_nested[symptoms[j]] = {};
                }
                if(!(symptoms[k] in data_nested[symptoms[j]])){
                  data_nested[symptoms[j]][symptoms[k]] = 1;
                } else {
                  data_nested[symptoms[j]][symptoms[k]] += 1;
                }
              }
            }
          }
        }
      }
      const data = {'links':[],'nodes':[]}
      for (let symptom in data_nested){
        for (let symptom2 in data_nested[symptom]){
          data.links.push({'source':symptom,'target':symptom2,'value':data_nested[symptom][symptom2]})
        }
      }
      for(i=0;i< symptoms.length;i++){
        data.nodes.push({'id':symptoms[i],'group':i})
      }

      // Specify the color scale.
      const color = d3.scaleOrdinal(d3.schemeCategory10);
      
      // The force simulation mutates links and nodes, so create a copy
      // so that re-evaluating this cell produces the same result.
      const links = data.links.map(d => ({...d}));
      const nodes = data.nodes.map(d => ({...d}));
      
      console.log(nodes)
      console.log(links)
      // Create a simulation with several forces.
      const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id))
          .force("linkDistance", d3.forceLink().distance(600))
          .force("charge", d3.forceManyBody().strength(-6000))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .on("tick", ticked);
    
      // Create the SVG container.
      d3.select('#Network_visual svg').remove();
      const svg = d3.select('#Network_visual')
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto;");
    
      // Add a line for each link, and a circle for each node.
      const link = svg.append("g")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
          .attr("stroke-width", d => Math.sqrt(d.value*10));
    
      const node = svg.append("g")
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5)
        .selectAll()
        .data(nodes)
        .join("circle")
          .attr("r", 30)
          .attr("fill", d => color(d.group));
    
      node.append("title")
          .text(d => d.id);
    
      // Add a drag behavior.
      node.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
      // Set the position attributes of links and nodes each time the simulation ticks.
      function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
      }
    
      // Reheat the simulation when drag starts, and fix the subject position.
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
    
      // Update the subject (dragged node) position during drag.
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
    
      // Restore the target alpha so the simulation cools after dragging ends.
      // Unfix the subject position now that it’s no longer being dragged.
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
    
      // When this cell is re-run, stop the previous simulation. (This doesn’t
      // really matter since the target alpha is zero and the simulation will
      // stop naturally, but it’s a good practice.)
      //invalidation.then(() => simulation.stop());
    }

        
    
  }, [raw_data]);

  return (
    <div id="Network_visual" style={{ width: '100%', height: '100%' , backgroundColor: 'white'}}></div>
  );
};

export default Network_visual;
