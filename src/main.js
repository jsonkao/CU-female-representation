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
