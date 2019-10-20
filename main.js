import { select, json, scaleTime, scaleLinear, max, min, extent, axisBottom, scaleOrdinal, schemeCategory10, timeFormat, format, axisLeft, event } from 'd3'

const width = document.body.clientWidth
const height = document.body.clientHeight - 150

const svg = select('svg')
    .attr('width', width)
    .attr('height', height)
const div = select('div')

const toolTip = select('div')

const render = dataArr => {

    //Declaration of const------------
    const margin = {top: 25, right:75, bottom: 75, left: 100}
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    //
    const color = scaleOrdinal(schemeCategory10)
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
        .attr('fill', 'white')
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
        .attr('fill', 'white')
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
        .on("mouseover", function(d) {
            div.attr('data-name', d.Name)
            div.attr('data-nationality', d.Nationality)
            .html(d.Name + '(' + d.Nationality + ') ' 
                + '<br/>' + 'Year: ' +  d.Year
                + '<br/>' + 'Place: '+ d.Place + 'th' 
                + (d.Doping? '<br/>' + `Doping: ${d.Doping} ` : '') 
               
                )
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("opacity", 1)
        })
        .on("mouseout", function(d) {
            div.style("opacity", 0);
            });
        
    
    //LEGEND

    const legend = svg 
        .selectAll('.legend')
        .data(color.domain())
        .enter().append('g')
        .attr('class', 'legend')
        .attr('id', 'legend')
        
        const backgroundRect = legend.selectAll('rect')
        .data([null])
      backgroundRect.enter().append('rect')
          .attr('id', 'legendBox')
          .attr('x', width - 300)
          .attr('y', height/2 - 30)
          .attr('width', 210)
          .attr('height', 75)
          .attr('rx', 7)
          .attr('fill', 'none')
          .attr('stroke', 'white')

    legend
        .append('circle')
            .attr('r',7)
            .attr('cx', width-115)
            .attr("cy", function(d,i){ return height/2 +20 - i*30})
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', color)

    legend  
        .append('text')
            .attr('id', 'text')
            .attr('x', width-135)
            .attr("y", function(d,i){ return height/2 +20 - i*30})
            .attr('font-size', '14px')
            .attr('fill', 'white')
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(d => d? 'Doping allegations':'No doping allegations')

}

json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
      console.log(data)
      const dataArr = data
        dataArr.forEach((d) => {
            d.Year = +d.Year
           const parsedTime = d.Time.split(':')
           d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1])
    });
    render(dataArr);
  });
