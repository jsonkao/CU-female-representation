const START_YEAR = 2004;
const END_YEAR = 2013;
const YEARS = d3.range(START_YEAR, END_YEAR + 1);

const divisions = [
  'Arts and Sciences', 
  'Humanities', 
  'Natural Sciences', 
  'Social Sciences'
];
const ranks = [
  'Undergraduate Major and Concentrator Students',
  'Graduate Students',
  'Tenure Eligible Faculty',
  'Tenured Faculty',
];
let data;

const getPercents = (divIdx, rankIdx) => {
  if (divIdx >= divisions.length || rankIdx >= ranks.length) {
    throw new RangeError('Division or rank does not exist.');
  }
  div = divisions[divIdx];
  rank = ranks[rankIdx];
  const [women, men] = data[div][rank];

  return women.map((w, i) => w / (w + men[i]));
};

const width = 600,
  height = 400;

const drawChart = (div, rank) => {
  const margin = {top: 50, right: 50, bottom: 50, left: 50};
  const gWidth = width - margin.left - margin.right;
  const gHeight = height - margin.top - margin.bottom;

  const percents = getPercents(div, rank);

  // X scale will use the years from 2004 to 2013
  const xScale = d3.scaleLinear()
    .domain([START_YEAR, END_YEAR])
    .range([0, gWidth]);
  // Y scale will use our percentages
  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([gHeight, 0]);

  // Add chart svg to the page, use margin conventions
  const svg = d3.select('div#chart-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Call the x axis and remove thousand-grouping formatting from years
  // (e.g. 2,004 --> 2004)
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${gHeight})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format('')));
  // Call the y axis, applying percent formatting
  svg.append('g')
    .attr('class', 'y axis')
    .call(d3.axisLeft(yScale).tickFormat(d3.format('.0%')));

  const lineGen = d3.line()
    .x((_, i) => xScale(START_YEAR + i))
    .y(yScale);
  const line = svg.append('path')
    .datum(percents)
    .attr('class', 'line')
    .attr('d', lineGen);
  const totalLength = line.node().getTotalLength();
  line
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
      .duration(3000)
      .attr("stroke-dashoffset", 0)
      .on('end', () => {
        // This area generator fills below the line
        const fillBelow = d3.area()
          .x((_, i) => xScale(START_YEAR + i))
          .y0(gHeight)
          .y1(yScale)
        // This area generator fills above the line
        const fillAbove = d3.area()
          .x((_, i) => xScale(START_YEAR + i))
          .y0(yScale)
          .y1(0);
        // Append the path, bind the data, and call the fill below generator
        svg.insert('path', ':first-child')
          .datum(percents)
          .attr('class', 'area below')
          .attr('d', fillBelow)
          .style('opacity', 0)
          .transition(3000)
          .style('opacity', 1)

        // Append the path, bind the data, and call the fill above generator
        svg.insert('path', ':first-child')
          .datum(percents)
          .attr('class', 'area above')
          .attr('d', fillAbove)
          .style('opacity', 0)
          .transition(3000)
          .style('opacity', 1);
          
        });
  


  const parityLine = d3.line()
    .x(xScale)
    .y(yScale(0.5));
  svg.append('path')
    .datum([START_YEAR, END_YEAR])
    .attr('class', 'parity-line')
    .attr('d', parityLine);
  
  svg.append('rect')
    .attr('')

};

d3.json('data/pipe_counts.json')
  .then(json => {
    data = json;
    drawChart(0, 0);
  });



/*
const width = 600;
const height = 300;
const numPoints = 10;
const svg = d3
  .select('svg#you-draw-it')
  .attr('width', width)
  .attr('height', height);

const bands = svg
  .append('g')
  .selectAll('rect.band')
  .data(new Array(numPoints));

bands
  .enter()
  .append('rect')
  .attr('height', height)
  .attr('width', width / numPoints)
  .attr('class', 'band')
  .attr('x', (_, i) => width * i / numPoints);

// when time for 2 fillBt's, check out https://d3indepth.com/shapes/, stack.offset()
const fillBt = d3.area().y0(height);

const pathdata = {};
const path = svg.append('path').attr('class', 'yourpath');

const capture = svg
  .append('rect')
  .attr('class', 'background')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all');

capture.on('mousedown', () => {
  capture
    .on('mousemove', function(d, i) {
      position = Math.round(d3.event.offsetX / (width / numPoints));
      pathdata[position] = [position * width / numPoints, d3.mouse(this)[1]];
      path.datum(Object.values(pathdata)).attr('d', fillBt);
    })
    .on('mouseup', () => {
      capture.on('mousemove', null).on('mouseup', null);
    });
});
*/

