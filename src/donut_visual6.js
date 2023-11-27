import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Donut_visual6 = ({ key, data, genderFilter, ageFilter }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const svgRef = useRef(null);

  useEffect(() => {
    if (data) {
      const width = 110;
      const height = 140;
      const radius = Math.min(width, height) / 2;
      const svg = d3.select(svgRef.current);

      svg.selectAll('*').remove(); // Clear previous content

      const g = svg
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      const fData = data.filter(
        (d) =>
          (genderFilter ? d.Gender === genderFilter : true) &&
          (ageFilter ? d.Age === ageFilter : true)
      );

      const colorScale = d3
        .scaleOrdinal()
        .domain(['Unemployed', 'Employed'])
        .range(['steelblue', '#30416b']);

      const filteredData = fData.filter((d) => d["Compulsive behavior"] === '1');

      const countData = {
        Unemployed: filteredData.filter((d) => d['I am currently employed at least part-time'] === '0').length,
        Employed: filteredData.filter((d) => d['I am currently employed at least part-time'] === '1').length,
      };

      const pie = d3.pie().value((d) => d.value);
      const pieData = Object.entries(countData).map(([category, count]) => ({ category, value: count }));

      const arc = d3
        .arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

      

      const arcs = g
        .selectAll('arc')
        .data(pie(pieData))
        .enter()
        .append('g')
        .attr('class', 'arc')
        .on('mouseover', (e,d) => {
          const [x, y] = arc.centroid(d);
          // Show tooltip on mouseover
          console.log("pie data : ",d)
          setTooltipContent(`${d.data.category}: ${d.data.value}`);
          d3.select('#tooltip')
            .style('left', `${x + width / 2}px`)
            .style('top', `${y + height / 2}px`)
            .transition()
            .style('opacity', 0.9);
        })
        .on('mousemove', (event) => {
          // Update tooltip position on mousemove
          d3.select('#tooltip')
            .style('left', `${event.pageX}px`)
            .style('top', `${event.pageY}px`);
        })
        .on('mouseout', () => {
          // Hide tooltip on mouseout
          setTooltipContent('');
          d3.select('#tooltip')
            .transition()
            .style('opacity', 0);
        });

      arcs
        .append('path')
        .attr('d', arc)
        .attr('fill', (d) => colorScale(d.data.category));

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', radius * 1.25)
        .style('font-size', '12px')
        .text('Compulsive behavior');
    }
  }, [key, data, genderFilter, ageFilter]);
 
  return (
    <div id="Donut_visual6" style={{ width: '99%', height: '99%' }}>
      {/* Tooltip */}
      {tooltipContent && <div id="tooltip" className="tooltip">{tooltipContent}</div>}
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
};

export default Donut_visual6;
