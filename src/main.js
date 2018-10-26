const START_YEAR = 2004;
const END_YEAR = 2013;
const YEARS = d3.range(START_YEAR, END_YEAR + 1);
const numYears = YEARS.length;

const divisions = [
  'Arts and Sciences',
  'Natural Sciences',
  'Humanities',
  'Social Sciences',
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

const width = 860,
  height = 500;

function LineGraph(div, rank, selectorId) {
  const titleText = `${ranks[rank]} by Gender in the ${divisions[div]}`;
  const data = getPercents(div, rank);
  const container = d3.select(`#${selectorId}`);

  const margin = { top: 10, right: 70, bottom: 50, left: 70 };
  // Add chart svg to the page, use margin conventions
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  const gWidth = width - margin.left - margin.right;
  const gHeight = height - margin.top - margin.bottom;

  // X scale will use the years from 2004 to 2013
  const xScale = d3
    .scaleLinear()
    .domain([START_YEAR, END_YEAR])
    .range([0, gWidth]);
  // Y scale will use our percentages
  const yScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([gHeight, 0]);
  const datumFromYear = year => data[year - START_YEAR];
  const yScaleFromYear = year => yScale(datumFromYear(year))

  this.getScales = () => ({ xScale, yScale });
  this.getDimensions = () => ({ gWidth, gHeight });
  this.getSVG = () => svg;
  this.getLastDatum = () => data[data.length - 1];

  this.labelAxes = () => {    
    svg.append('text') // y-axis
      .attr('x', 0)
      .attr('y', gHeight / 2)
      .text('Percent Women')
      .attr('class', 'y axis-label');
    svg.append('text') // x-axis
      .attr('x', gWidth / 2)
      .attr('y', gHeight)
      .attr('text-anchor', 'middle')
      .attr('class', 'parity-label')
      .attr('class', 'x axis-label')
      .text('Year');

  };

  this.drawSkeleton = () => {
    // Add chart title
    const title = container
      .insert('p', ':first-child')
      .attr('class', 'title')
      .text(titleText);

    // Call the x axis and remove thousand-grouping formatting from years
    // (e.g. 2,004 --> 2004)
    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${gHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('')));
    // Call the y axis, applying percent formatting
    svg
      .append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScale).tickFormat(d3.format('.0%')));

    const parityLine = d3
      .line()
      .x(xScale)
      .y(yScale(0.5));
    svg
      .append('path')
      .datum([START_YEAR, END_YEAR])
      .attr('class', 'parity-line')
      .attr('d', parityLine);
    // Add parity label
    svg
      .append('text')
      .attr('x', gWidth / 2)
      .attr('y', gHeight / 2 + 5)
      .attr('alignment-baseline', 'hanging')
      .attr('text-anchor', 'middle')
      .attr('class', 'parity-label')
      .text('Equal Number of Women and Men'.toUpperCase());

    this.labelAxes();
  };

  this.drawLine = (duration = 2500) => {
    const lineGenerator = d3.line()
      .x((_, i) => xScale(START_YEAR + i))
      .y(yScale);
    const line = svg
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', lineGenerator);

    // Draw path over a specified amount of time
    const totalLength = line.node().getTotalLength();
    return line
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
        .duration(duration)
        .attr('stroke-dashoffset', 0);
  };

  this.drawArea = (isAbove = true) => {
    const areaGenerator = d3.area()
      .x((_, i) => xScale(START_YEAR + i))
      .y0(isAbove ? gHeight : yScale)
      .y1(isAbove ? yScale : 0);
    // Append the path, bind the data, and call the area generator
    return svg
      .insert('path', ':first-child')
      .datum(data)
      .attr('class', `area ${isAbove ? 'above' : 'below'}`)
      .attr('d', areaGenerator)
      .style('fill-opacity', 0)
      .transition()
        .duration(500)
        .style('fill-opacity', 1)
        .on('end', () => {
          svg
            .append('rect')
            .attr('class', `area-label-container ${isAbove? 'men' : 'women'}`)
            .attr('x', gWidth / 2)
            .attr('y', gHeight * (1 - data[Math.floor(data.length/2)]) + (isAbove ? -1 : 1) * gHeight / 5)
            .attr('opacity', 0)
            .transition()
              .duration(500)
              .attr('opacity', 0.9)
          svg.append('text')
            .attr('class', 'area-label')
            .attr('x', gWidth / 2)
            .attr('y', gHeight * (1 - data[Math.floor(data.length/2)]) + (isAbove ? -1 : 1) * gHeight / 5)
            .attr('text-anchor', 'middle')
            .text(isAbove ? 'MEN' : 'WOMEN')
            .attr('opacity', 0)            
            .transition()
              .duration(500)
              .attr('opacity', 0.8)
        });    
  };

  this.drawEndpoints = () => {
    const dots = svg
      .selectAll('.dot')
      .data([ START_YEAR, END_YEAR ]);
    dots
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', xScale)
      .attr('cy', yScaleFromYear)
      .attr('r', 4.5)
      .style('opacity', 0)
      .transition()
        .duration(500)
        .style('opacity', 1);

    const labels = svg
      .selectAll('.label')
      .data([ START_YEAR, END_YEAR ]);
    return labels
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', xScale)
      .attr('y', yScaleFromYear)
      .text(y => d3.format('.0%')(datumFromYear(y)))
      .style('opacity', 0)
      .style(
        'transform',
        (_, i) => `translate(${i === 0 ? '6px, 19px' : '-32px, -11px'})`,
      )
      .transition()
      .duration(500)
      .style('opacity', 1);
  };
};

class Activity {
  constructor(div) {
    this.div = div;
    this.id = divisions[div].replace(/\s/g, '-');
    this.container = d3.select('div#container')
      .append('div')
      .attr('class', 'chart-container')

    this.drawChart(0);
    this.youDrawIt(3);
  }

  drawChart(rank) {
    this.container
      .append('div')
      .attr('id', this.id + '-chart');
    const chart = new LineGraph(
      this.div,
      rank,
      this.id + '-chart',
    );
    chart.drawSkeleton();
    chart
      .drawLine()
      .on('end', () => {
        chart.drawArea(true); // draw and label area above line
        chart.drawArea(false); // draw and label area below line
        chart.drawEndpoints(); // label line endpoints
      });
  }

  youDrawIt(rank) {
    // this.container.append('p').text('Instructions? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dapibus nulla et arcu ullamcorper tincidunt.');
    const container = this.container
      .append('div')
      .attr('id', this.id + '-youdrawit');
    const chart = new LineGraph(
      this.div,
      rank,
      this.id + '-youdrawit',
    );
    const svg = chart.getSVG();
    const { gWidth, gHeight } = chart.getDimensions();
    const numBands = numYears - 1;
    const bands = svg
      .append('g')
      .selectAll('rect.band')
      .data(new Array(numBands));
    const bandWidth = gWidth / numBands;
    bands
      .enter()
      .append('rect')
      .attr('height', gHeight)
      .attr('width', bandWidth)
      .attr('class', 'band')
      .attr('x', (_, i) => bandWidth * i);

    const lineGen = d3.line().defined(d => d);
    const path = svg.append('path').attr('class', 'yourpath');

    const capture = svg
      .append('rect')
      .attr('width', gWidth)
      .attr('height', gHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');

    let isFirstTouch;
    let maxBand;
    let pathData;

    const btnContainer = container.append('div').classed('btn-container', true);

    const reset = () => {
      isFirstTouch = true;
      maxBand = -1;
      pathData = new Array(numBands + 1);
      path
        .transition()
        .style('visibility', 'hidden')
        .on('end', () => path.attr('d', null).style('visibility', 'visible'));
      svg.selectAll('rect.band').classed('highlighted', false);
      btnContainer.selectAll('button').attr('disabled', true);
      svg.selectAll('.dot').remove();
    };
    const restartBtn = btnContainer.append('button')
      .classed('button', true)
      .attr('disabled', true)
      .text('Start Over')
      .on('click', reset);

    const concludeDrawing = () => {
      btnContainer.selectAll('button').attr('disabled', true)
      chart
        .drawLine()
        .on('end', () => {
          svg.selectAll('.dot').remove();

          // stops mouse events from propagating up to capture, disabling drag funcitonality
          capture.attr('pointer-events', 'none');

          chart
            .drawEndpoints()
            .on('end', () => {
              restartBtn.attr('disabled', null).text('Next Graph').on('click', next);
            });
        });
    };
    const doneBtn = btnContainer.append('button')
      .classed('button', true)
      .attr('disabled', true)
      .text("I'm Done")
      .on('click', () => concludeDrawing());

    const { xScale, yScale } = chart.getScales();
    reset();
    capture.on('mousedown', () => {
      capture
        .on('mousemove', function(d, i) {
          const [x, y] = d3.mouse(this);
          const bandNum = Math.round(x / (gWidth / numBands));
          if (bandNum > maxBand) {
            maxBand = bandNum;
          }
          pathData[bandNum] = [bandNum * bandWidth, y];
          if (isFirstTouch) {
            restartBtn.attr('disabled', null);
            for (let i = 0; i < bandNum; i++) {
              pathData[i] = [i * bandWidth, y];
            }
            isFirstTouch = false;
          }

          if (!pathData.includes(undefined)) { // all points have been drawn
            doneBtn.attr('disabled', null);
          }
          svg.selectAll('rect.band').classed('highlighted', (_, i) => i >= maxBand);
          path.datum(pathData).attr('d', lineGen);

          const definedPathData = Object.values(pathData);
          const dots = svg
            .selectAll('.dot')
            .data(definedPathData);
          dots
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', 4.5)
            .merge(dots)
            .attr('cx', d => d[0])
            .attr('cy', d => d[1]);
        })
        .on('mouseup', () => {
          capture.on('mousemove', null).on('mouseup', null);
        });
    });
    chart.drawSkeleton();
    capture.raise(); // moves our pointer event capturer on top of chart elements
  };
}

let actNum = 0;
const next = () => actNum < 4 && new Activity(actNum++);

d3.json('data/pipe_counts.json').then(json => {
  data = json;
  alert('This is a work in progress of a You-Draw-It. On the blank charts, draw/predict the female representation line.');
  next();
});

/*
// when time for 2 fillBt's, check out https://d3indepth.com/shapes/, stack.offset()
const fillBt = d3.area().y0(height);
*/
