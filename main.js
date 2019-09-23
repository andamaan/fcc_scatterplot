import { select, json, scaleTime, scaleLinear, max, min, extent, axisBottom, scaleOrdinal, schemeCategory10, timeFormat, format, axisLeft } from 'd3'

const svg = select('svg')
const div = select('div')


const width = +svg.attr('width')
const height = +svg.attr('height')

const render = dataArr => {

    //Declaration of const------------
    const margin = {top: 50, right:20, bottom: 75, left: 100}
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    //
    const color = scaleOrdinal(schemeCategory10)
    //
    const title= "Doping in Professional Bicycle Racing"
    //DATA VALUES
    const xValue = d => d.Year
    const xAxisLabel = 'Year'
    const yValue = dataArr.map(d => d.Time)
    const yAxisLabel = 'Minutes'
    //SCALES
    const xScale = scaleLinear()
        .domain([min(dataArr, d => d.Year -1 ), max(dataArr, d => d.Year +1)])
        .range([0, innerWidth])
    const yScale = scaleTime()
        .domain(extent(dataArr, d => d.Time))
        .range([innerHeight, 0])
    //FORMATING
    const tf = timeFormat("%M:%S")
    const yAxis = axisLeft(yScale)
        .tickFormat(tf)    
    //AXIS
    const xAxis = axisBottom(xScale)
        .tickFormat(format("d"))

    //Drawing of the graph-------------
    //TOOLTIP
    div
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .style('opacity', 0)    
    //GRAPH
    svg
    .attr("class", "graph")
    .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
    //AXIS
    const xAxisG = select('g')
        .append('g')
        .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${innerHeight})`) 

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 60)
        .attr('x', innerWidth/2)
        .text(xAxisLabel)
        .attr('fill', 'black')
        .style('font-size', '18px')

    const yAxisG = select('g')
        .append('g')
        .call(yAxis)
            .attr('id', 'y-axis')

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -150)
        .attr('y', -60)
        .text(yAxisLabel)
        .attr('fill', 'black')
        .style('font-size', '18px')

    //DATA
    select('g').selectAll('.dot')
        .data(dataArr)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r',7)
        .attr('cx', d => xScale(d.Year))
        .attr('cy', d => yScale(d.Time))
        .attr('class', 'bar')
        .attr('data-xValue', xValue)
        .attr('data-yValue', yValue)
        .style('fill', d => color(d.Doping != ""))
        .style("opacity", 0.7)
        //HOVERING EVENT
        .on("mouseover", function(d){
            div.style("opacity", 1  )
            div.style('fill', 'black')
            div.attr('data-year', d.Year)
            div.html(d.Name + ": " + d.Nationality + "<br/>"
            + "Year: " +  d.Year + ", Time: " + timeFormat(d.Time) 
            + (d.Doping?"<br/><br/>" + d.Doping:""))
                .style('left', (event.pageX) + "px")
                .style('top', (event.pageY - 28) + "px")
        })
        .on('mouseout', d => div.style('opacity', 0))
    
    //LEGEND
    const legend = svg 
        .selectAll('.legend')
        .data(color.domain())
        .enter().append('g')
        .attr('class', 'legend')
        .attr('id', 'legend')
        
    legend
        .append('rect')
            .attr('x', width-18)
            .attr("y", function(d,i){ return height/2 - i*30})
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', color)

    legend  
        .append('text')
            .attr('x', width-24)
            .attr("y", function(d,i){ return height/2 - i*30 + 10})
            .attr('font-size', '14px')
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(d => d? 'Riders with doping allegations':'No doping allegations')

}

json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
      const dataArr = data
        dataArr.forEach((d) => {
            d.Year = +d.Year
           const parsedTime = d.Time.split(':')
           d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1])
    });
    render(dataArr);
  });
