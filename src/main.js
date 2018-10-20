const pipeJSON = '{"Humanities": {"Tenured Faculty": [[39, 40, 43, 45, 51, 53, 55, 55, 55, 57], [80, 80, 78, 79, 86, 89, 83, 86, 88, 90]], "Graduate Students": [[443, 433, 410, 420, 388, 361, 352, 356, 325, 307], [371, 355, 337, 327, 333, 322, 332, 333, 311, 321]], "Tenure Eligible Faculty": [[31, 34, 35, 37, 34, 28, 27, 23, 20, 19], [33, 33, 33, 30, 27, 24, 24, 24, 22, 21]], "Undergraduate Major and Concentrator Students": [[480, 513, 461, 412, 433, 444, 465, 462, 421, 387], [359, 351, 341, 308, 314, 289, 314, 349, 340, 257]]}, "Natural Sciences": {"Tenured Faculty": [[16, 15, 16, 17, 19, 19, 20, 21, 24, 30], [115, 116, 119, 119, 117, 120, 121, 123, 123, 125]], "Graduate Students": [[245, 259, 273, 272, 272, 256, 255, 250, 253, 252], [386, 368, 349, 353, 340, 358, 371, 367, 369, 366]], "Tenure Eligible Faculty": [[7, 9, 11, 13, 14, 16, 16, 17, 11, 9], [27, 25, 29, 27, 27, 24, 24, 26, 27, 31]], "Undergraduate Major and Concentrator Students": [[287, 298, 294, 329, 372, 368, 384, 450, 505, 424], [259, 257, 290, 303, 314, 324, 329, 378, 415, 450]]}, "Social Sciences": {"Tenured Faculty": [[22, 24, 26, 27, 30, 31, 32, 30, 30, 31], [79, 83, 83, 87, 90, 90, 88, 90, 90, 90]], "Graduate Students": [[296, 292, 282, 269, 242, 228, 222, 229, 240, 241], [352, 340, 322, 324, 304, 387, 288, 300, 310, 303]], "Tenure Eligible Faculty": [[13, 16, 20, 24, 25, 26, 24, 25, 24, 20], [26, 25, 24, 17, 19, 18, 18, 19, 20, 21]], "Undergraduate Major and Concentrator Students": [[459, 476, 486, 514, 533, 522, 533, 503, 456, 456], [598, 591, 582, 615, 636, 596, 608, 605, 595, 605]]}, "Arts and Sciences": {"Tenured Faculty": [[77, 79, 85, 89, 100, 103, 107, 106, 109, 118], [274, 279, 280, 285, 293, 299, 292, 299, 301, 305]], "Graduate Students": [[984, 984, 965, 961, 902, 845, 829, 835, 818, 800], [1109, 1063, 1008, 1004, 977, 1067, 991, 1000, 990, 990]], "Tenure Eligible Faculty": [[51, 59, 66, 74, 73, 70, 67, 65, 55, 48], [86, 83, 86, 74, 73, 66, 66, 69, 69, 73]], "Undergraduate Major and Concentrator Students": [[1226, 1287, 1241, 1255, 1338, 1334, 1382, 1415, 1382, 1267], [1216, 1199, 1213, 1226, 1264, 1209, 1251, 1332, 1350, 1312]]}}';
const pipeCounts = JSON.parse(pipeJSON);





















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
