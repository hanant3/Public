import React, { useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = ({ key, data, genderFilter, ageFilter }) => {
  useEffect(() => {
    if (data) {
      const width = 400;
      const height = 300;
      const margin = { top: 20, right: 20, bottom: 80, left: 50 };

      // Remove previous chart
      d3.select('#LineChart svg').remove();

      const svg = d3.select('#LineChart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

        const fData = data.filter(d => {
          return (genderFilter ? d.Gender === genderFilter : true) &&
                 (ageFilter ? d.Age === ageFilter : true);
        });

      // Filter data to include only "1" values for mental illness
      const filteredData = fData.filter(d => d.mental_illness === '1');
      const filteredData_stamp = fData.filter(d => d['I receive food stamps'] === '1');
      const filteredData_no_stamp = fData.filter(d => d['I receive food stamps'] === '0');

      const Household_Income = d3.rollup(filteredData, v => v.length, d => d['Household Income']);
      const Household_Income_stamp = d3.rollup(filteredData_stamp, v => v.length, d => d['Household Income']);
      const Household_Income_no_stamp = d3.rollup(filteredData_no_stamp, v => v.length, d => d['Household Income']);

      const incomeArray = Array.from(Household_Income);
      incomeArray.sort((a, b) => d3.ascending(a[0], b[0]));
      const sortedHousehold_Income = new Map(incomeArray);

      const incomeArray_stamp = Array.from(Household_Income_stamp);
      incomeArray_stamp.sort((a, b) => d3.ascending(a[0], b[0]));
      const sortedHousehold_Income_stamp = new Map(incomeArray_stamp);

      const incomeArray_no_stamp = Array.from(Household_Income_no_stamp);
      incomeArray_no_stamp.sort((a, b) => d3.ascending(a[0], b[0]));
      const sortedHousehold_no_Income_stamp = new Map(incomeArray_no_stamp);


      console.log('Household_Income : ',sortedHousehold_Income);
      // Create scales for x and y axes
      const categories = Array.from(sortedHousehold_Income.keys());

      const xScale = d3.scaleBand()
        .domain(categories)
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        // .domain([0, d3.max(Household_Income.values())])
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);

      // Create x-axis
      svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-45)');

      // Create y-axis
      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));
      
      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', margin.left / 2 - 17) // Adjust the position based on your preference
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Count of people');

      // Create line chart
      const line_stamp = d3.line()
        .x(d => xScale(d[0]) + xScale.bandwidth() / 2)
        .y(d => yScale(d[1]));

      svg.append('path')
        .datum(sortedHousehold_Income_stamp)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 3.5)
        .attr('d', line_stamp);

      //Add circles as markers
      // svg.selectAll('circle')
      //   .data(sortedHousehold_Income_stamp)
      //   .enter()
      //   .append('circle')
      //   .attr('cx', d => xScale(d[0]) + xScale.bandwidth() / 2)
      //   .attr('cy', d => yScale(d[1]))
      //   .attr('r', 5) // Adjust the radius as needed
      //   .attr('fill', 'white');

      // Add legend
      const legend = svg.append('g')
        .attr('transform', `translate(${width - margin.right}, ${margin.top})`);

      

      const line_no_stamp = d3.line()
        .x(d => xScale(d[0]) + xScale.bandwidth() / 2)
        .y(d => yScale(d[1]));

      svg.append('path')
        .datum(sortedHousehold_no_Income_stamp)
        .attr('fill', 'none')
        .attr('stroke', '#30416b')
        .attr('stroke-width', 3.5)
        .attr('d', line_no_stamp);
      
      // Legends 

      legend.append('rect')
        .attr('x', -125)
        .attr('y', -10)
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', 'steelblue');

      legend.append('text')
        .attr('x', -110)
        .attr('y', 0)
        .attr('dy', '0.4em') 
        .style('font-size', '12px')
        .text('Recieve Food Stamps');

      legend.append('rect')
        .attr('x', -125)
        .attr('y', 10)
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', '#30416b');

      legend.append('text')
        .attr('x', -110)
        .attr('y', 20)
        .attr('dy', '0.4em') 
        .style('font-size', '12px')
        .text('Without Food Stamps');


      // svg.selectAll('circle')
      //   .data(sortedHousehold_no_Income_stamp)
      //   .enter()
      //   .append('circle')
      //   .attr('cx', d => xScale(d[0]) + xScale.bandwidth() / 2)
      //   .attr('cy', d => yScale(d[1]))
      //   .attr('r', 5) // Adjust the radius as needed
      //   .attr('fill', 'white');

    }
  }, [key, data, genderFilter, ageFilter]);

  return (
    <div id="LineChart" style={{ width: '99%', height: '99%' }}></div>
  );
};

export default LineChart;
