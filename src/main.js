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

const width = 700,
  height = 450;

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

  // Add chart title
  svg.append('text')
    .attr('x', gWidth / 2)
    .attr('y', -margin.top / 3)
    .attr('text-anchor', 'middle')
    .attr('class', 'title')
    .text(`${ranks[rank]} by Gender in ${divisions[div]}`);

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

  const labelEndpoints = () => {
    const labels = svg.selectAll('.label')
      .data([percents[0], percents[percents.length - 1]]);

    labels.enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (_, i) => xScale(i === 0 ? START_YEAR :  END_YEAR))
      .attr('y', yScale)
      .text(d3.format('.0%'))
      .style('opacity', 0)
      .style('transform', (_, i) => `translate(${i === 0 ? '5px, 15px' : '-28px, -9px'})`)
      .transition()
        .duration(500)
        .style('opacity', 1);
  }
  // Draw the endpoints of the line
  const drawEndpoints = () => {
    const dots = svg.selectAll('.dot')
      .data([percents[0], percents[percents.length - 1]]);
    dots.enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (_, i) => xScale(i == 0 ? START_YEAR : END_YEAR))
      .attr('cy', yScale)
      .attr('r', 4)
      .style('opacity', 0)
      .transition()
        .duration(500)
        .style('opacity', 1)
  };

  // Draw areas above and below the line
  const drawAreas = () => {
    ['above', 'below'].forEach(side => {
      const isAbove = side === 'above';
      const areaGen = d3.area()
        .x((_, i) => xScale(START_YEAR + i))
        .y0(isAbove ? gHeight : yScale)
        .y1(isAbove ? yScale : 0);

      // Append the path, bind the data, and call the fill below generator
      const area = svg.insert('path', ':first-child')
        .datum(percents)
        .attr('class', `area ${side}`)
        .attr('d', areaGen)
        .style('fill-opacity', 0)
        .transition()
          .duration(500)
          .style('fill-opacity', 1);

      // Label each area
      const labels = svg.selectAll('text.area-label')
        .data(['Men', 'Women']);
      labels.enter()
        .append('text')
        .attr('class', 'area-label')
        .attr('x', gWidth - 6)
        .attr('y', (_, i) => (i*2 + 1) * gHeight / 4)
        .attr('text-anchor', 'end')
        .text(d => d.toUpperCase())
        .attr('opacity', 0)
        .transition()
          .attr('opacity', 0.8);

      svg.append()

      if (!isAbove) { // final call
        area.on('end', () => { drawEndpoints(); labelEndpoints(); })
      }
    });
  };

  // Draw path over 2.5 seconds
  const totalLength = line.node().getTotalLength();
  line
    .attr('stroke-dasharray', totalLength + ' ' + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
      .duration(2500)
      .attr('stroke-dashoffset', 0)
      .on('end', drawAreas) // after path drawn, fill in the areas above and below it
  
  const parityLine = d3.line()
    .x(xScale)
    .y(yScale(0.5));
  svg.append('path')
    .datum([START_YEAR, END_YEAR])
    .attr('class', 'parity-line')
    .attr('d', parityLine);
};

d3.json('data/pipe_counts.json')
  .then(json => {
    data = json;
    let i = 0;
    drawChart(Math.floor(i / 2), i % 2); 
    i++; 
    const int = setInterval(
      () => { 
        drawChart(Math.floor(i / 2), (i % 2) * 3); 
        i++; 
        console.log(i);
        if (i > 8) { clearInterval(int); } 
      },
      3500
    );
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

