import React, { useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ key, data, genderFilter, ageFilter }) => {
  useEffect(() => {
    if (data) {
      const width = 400;
      const height = 300;
      const margin = { top: 20, right: 20, bottom: 95, left: 50 };

      // Remove previous chart
      d3.select('#BarChart svg').remove();

      const svg = d3.select('#BarChart')
        .append('svg')
        .attr('width', width)
        .attr('height', height+100);

        const fData = data.filter(d => {
          return (genderFilter ? d.Gender === genderFilter : true) &&
                 (ageFilter ? d.Age === ageFilter : true);
        });


      // Filter data for employed and unemployed
      const employedData = fData.filter(d => d['I am currently employed at least part-time'] === '1');
      const unemployedData = fData.filter(d => d['I am currently employed at least part-time'] === '0');

      // Create a map of distinct education values
      const educationValues = Array.from(new Set(fData.map(d => d.Education)));

      // Calculate counts for employed and unemployed for each education value
      const employedCounts = educationValues.map(edu => employedData.filter(d => d.Education === edu).length);
      const unemployedCounts = educationValues.map(edu => unemployedData.filter(d => d.Education === edu).length);

      // Calculate percentages
      const totalCounts = employedCounts.map((count, i) => count + unemployedCounts[i]);
      const employedPercentages = employedCounts.map((count, i) => (count / totalCounts[i]) * 100);
      const unemployedPercentages = unemployedCounts.map((count, i) => (count / totalCounts[i]) * 100);

      // Create scales
      const xScale = d3.scaleBand()
        .domain(educationValues)
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, margin.top]);

      // Draw stacked bars
      svg.selectAll('.bar-employer')
        .data(employedPercentages)
        .enter().append('rect')
        .attr('class', 'bar-employer')
        .attr('x', (d, i) => xScale(educationValues[i]))
        .attr('y', d => yScale(d))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d))
        .attr('fill', 'steelblue');

      // Adding label for employed bars
        // svg.selectAll('.bar-employer-label')
        // .data(employedPercentages)
        // .enter().append('text')
        // .attr('class', 'bar-employer-label')
        // .attr('x', (d, i) => xScale(educationValues[i]) + xScale.bandwidth() / 2)
        // .attr('y', d => yScale(d) - 5) 
        // .attr('text-anchor', 'middle')
        // .style('fill', 'steelblue')
        // .text(d => `${d.toFixed(1)}%`);

      svg.selectAll('.bar-unemployed')
        .data(unemployedPercentages)
        .enter().append('rect')
        .attr('class', 'bar-unemployed')
        .attr('x', (d, i) => xScale(educationValues[i]))
        .attr('y', d => yScale(d))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d))
        .attr('fill', '#30416b');

      // Adding label for unemployed bars
      // svg.selectAll('.bar-unemployed-label')
      // .data(unemployedPercentages)
      // .enter().append('text')
      // .attr('class', 'bar-unemployed-label')
      // .attr('x', (d, i) => xScale(educationValues[i]) + xScale.bandwidth() / 2)
      // .attr('y', d => yScale(d) - 5) 
      // .attr('text-anchor', 'middle')
      // .style('fill', '#30416b')
      // .text(d => `${d.toFixed(1)}%`);

      // Adding legend for employed bars
    svg.append('rect')
    .attr('x', width - margin.right - 120)
    .attr('y', 10)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'steelblue');

    svg.append('text')
    .attr('x', width - margin.right - 100)
    .attr('y', 20)
    .style('font-size', '12px')
    .text('Employed');

    // Adding legend for unemployed bars
    svg.append('rect')
    .attr('x', width - margin.right - 120)
    .attr('y', 30)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', '#30416b');

    svg.append('text')
    .attr('x', width - margin.right - 100)
    .attr('y', 40)
    .style('font-size', '12px')
    .text('Unemployed');

      // X-axis
      svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

      // Y-axis
      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d}%`));

      
    }
  }, [key, data, genderFilter, ageFilter]);

  return (
    <div id="BarChart" style={{ width: '99%', height: '99%' }}></div>
  );
};

export default BarChart;
