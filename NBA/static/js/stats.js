function test(){
var url ="/api/stats"
d3.json(url).then(function(response){
    console.log(response)
})
}
test();

// creating dropdown menu items
var url ="/api/stats"
var dropdownone = d3.select("#x-stat")
    var dropdowntwo = d3.select("#y-stat")

d3.json(url).then(function(response){
    console.log(Object.keys(response[0]))
    var keys = Object.keys(response[0])

    keys.forEach((key)=>{
        dropdownone.append("option").text(key).property("value",key).attr("id",key)
    });
    keys.forEach((key)=>{
        dropdowntwo.append("option").text(key).property("value",key).attr("id",key)
    });

})

//select dropdown items and set as axes 
var xSelection ="Points";
var ySelection ="Assists";

function reportX(period) {
  if (period=="") return; // please select - possibly you want something else here
xSelection = period;

redraw();
} 

function reportY(period) {
  if (period=="") return; // please select - possibly you want something else here
ySelection = period;

redraw();
} 

var svgWidth = 600;
    
var svgHeight = 600;

var margin = {top: 20, right: 40, bottom: 50, left: 50};
        
var width = svgWidth - margin.left - margin.right;

var height = svgHeight - margin.top - margin.bottom;

//console.log (margin);
/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// function to redraw the graph after selecting new axes for chart 
function redraw(){
    var url ="/api/stats"
// load data
d3.json(url).then(function(data) {

  // change string into number format
  data.forEach(function(d) {
    d[ySelection] = +d[ySelection];
    d[xSelection] = +d[xSelection];
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-.5, d3.max(data, xValue)+.5]);
  yScale.domain([d3.min(data, yValue)-.5, d3.max(data, yValue)+.5]);


chartGroup.selectAll("g").remove();
chartGroup.selectAll("text").remove();
  
// x-axis
var xaxis = chartGroup.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
// add x-label
    chartGroup.append("text")
      .attr("x", width-280)
      .attr("y", height+40)
      .attr("font-size","15")
      .attr("font-weight","bold")
      .text(xSelection);

  // y-axis
  var yaxis = chartGroup.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    //add y-label
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", height-570)
      .attr("x", width-750)
      .attr("font-size","15")
      .attr("font-weight","bold")
      .attr("dy", ".71em")
      .text(ySelection);

  // draw dots
  var circlegroup = chartGroup.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));});
     

      
    circlegroup.on("mouseover", function(d) {
        tooltip.transition()
             .duration(200)
             .style("opacity", .9);
             tooltip.html(`${d.Player_name} <br> ${xSelection}: ${d[xValue]} <br> ${ySelection}: ${d[yValue]}`)
             .style("left", (d3.event.pageX + 10) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
    })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  chartGroup.selectAll("circle")
                       .data(data)
                       .transition()
                       .duration(1000)
                       .attr("cx", xMap)
                        .attr("cy", yMap);


      chartGroup.selectAll(".dot")
      .data(data)
             .exit()
             .remove()

  // draw legend
  var legend = chartGroup.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("id",function(d){return d;})
      .attr("transform", function(d, i) { return "translate(10," + (i) * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;});

    //remove extra legend labels
    // d3.select("#PF-SF").remove();
    // d3.select("#SF-SG").remove();
    // d3.select("#SG-PF").remove();
    // d3.select("#C-PF").remove();
    // d3.select("#SG-SF").remove();

//remove unncessary dropdown menu items
d3.selectAll("#Player_name").remove();
d3.selectAll("#Player_id").remove();
d3.selectAll("#Position").remove();
});
};

// setup x 
var xValue = function(d) { return d[xSelection];}; // data -> value
var xScale = d3.scaleLinear().range([0, width]);// value -> display
var xMap = function(d) { return xScale(xValue(d));}; // data -> display
var xAxis = d3.axisBottom(xScale);

// setup y
var yValue = function(d) { return d[ySelection];}; // data -> value
var yScale = d3.scaleLinear().range([height, 0]); // value -> display
var yMap = function(d) { return yScale(yValue(d));}; // data -> display
var yAxis = d3.axisLeft(yScale);

// setup fill color
var cValue = function(d) { return d.Position;},
color = d3.scaleOrdinal(d3.schemeCategory10);

// add the graph canvas to the body of the webpage
var svg = d3.select("#bubble").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
var chartGroup= svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// add the tooltip area to the webpage
var tooltip = d3.select("#bubble").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// load data
d3.json(url).then(function(data) {

  // change string into number format
  data.forEach(function(d) {
    d[ySelection] = +d[ySelection];
    d[xSelection] = +d[xSelection];
// console.dir (d);
  });

 

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-.5, d3.max(data, xValue)+.5]);
  yScale.domain([d3.min(data, yValue)-.5, d3.max(data, yValue)+.5]);


  // x-axis
  var xaxis = chartGroup.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
      
      chartGroup.append("text")
      .attr("x", width-280)
      .attr("y", height+40)
      .attr("font-size","15")
      .attr("font-weight","bold")
      .text(xSelection);

  // y-axis
    var yaxis =chartGroup.append("g")
      .attr("class", "y axis")
      .call(yAxis);

      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", height-570)
      .attr("x", width-750)
      .attr("font-size","15")
      .attr("dy", ".71em")
      .attr("font-weight","bold")
      .text(ySelection);


  // draw dots
  var circlegroup = chartGroup.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));});

    //tooltip on circle group 
      circlegroup.on("mouseover", function(d) {
        tooltip.transition()
             .duration(200)
             .style("opacity", .9);
             tooltip.html(`${d.Player_name} <br> ${xSelection}: ${d[xValue]} <br> ${ySelection}: ${d[yValue]}`)
             .style("left", (d3.event.pageX + 10) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
    })
             .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                });
   

  // draw legend
  var legend = chartGroup.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("id",function(d){return d})
      .attr("transform", function(d, i) { return "translate(10," + (i) * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { 
        return d;})

//remove extra legend labels 
    // d3.select("#PF-SF").remove();
    // d3.select("#SF-SG").remove();
    // d3.select("#SG-PF").remove();
    // d3.select("#C-PF").remove();
    // d3.select("#SG-SF").remove();

//remove unncessary dropdown menu items
d3.selectAll("#Player_name").remove();
d3.selectAll("#Player_id").remove();
d3.selectAll("#Position").remove();
   
});











