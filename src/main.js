const width = 600;
const height = 300;
const numPoints = 10;
const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

const background = svg.append('rect')
  .attr('class', 'background')
  .attr('width', width)
  .attr('height', height);

const bands = svg.append('g');

bands.selectAll('rect.band')
  .data(new Array(numPoints))
  .enter()
  .append('rect')
  .attr('height', height)
  .attr('width', width / numPoints)
  .attr('class','band')
  .attr('x', (_, i) => width * i / numPoints);

const line = d3.line()
  .x(d => d[0])
  .y(d => d[1]);

const pathdata = {};
const path = svg.append('path')
  .attr('class', 'yourpath');

background
  .on('mousedown',() => {
    background
      .on('mousemove', function(d, i) {
        position = Math.round(d3.event.offsetX / (width / numPoints));
        pathdata[position] = [position * width / numPoints, d3.mouse(this)[1]];
        path.datum(Object.values(pathdata)).attr('d', line);
      })
      .on('mouseup',() => {
        background
          .on('mousemove', null)
          .on('mouseup', null);
      });
  });