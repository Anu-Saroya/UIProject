
// Load data from CSV file
d3.csv("top_100_youtubers.csv").then(function (data) {
    // Function to format a number in a human-readable format

//CHARTS STARTS HERE//
//--------------------------------------------------------------------------------------------//
//SCOREBOARD//
 // Calculate the total views, total likes, total followers, and average engagement rate
var totalViews = d3.sum(data, function (d) { return parseInt(d.Views); });
var totalLikes = d3.sum(data, function (d) { return parseInt(d.Likes); });
var totalFollowers = d3.sum(data, function (d) { return parseInt(d.followers); });

// Directly calculate the engagement rates without checking for "EngagementRate" column
var engagementRates = data.map(function (d) { return parseFloat(d.EngagementRate); });

// Calculate the average engagement rate
var averageEngagementRate = d3.mean(engagementRates);

// Format the total views, total likes, total followers, and average engagement rate
var formattedTotalViews = (totalViews >= 1e12) ? (totalViews / 1e12).toFixed(1) + "T" :
                         (totalViews >= 1e9) ? (totalViews / 1e9).toFixed(1) + "B" :
                         (totalViews >= 1e6) ? (totalViews / 1e6).toFixed(1) + "M" :
                         totalViews.toString();

var formattedTotalLikes = (totalLikes >= 1e12) ? (totalLikes / 1e12).toFixed(1) + "T" :
                         (totalLikes >= 1e9) ? (totalLikes / 1e9).toFixed(1) + "B" :
                         (totalLikes >= 1e6) ? (totalLikes / 1e6).toFixed(1) + "M" :
                         totalLikes.toString();

var formattedTotalFollowers = (totalFollowers >= 1e12) ? (totalFollowers / 1e12).toFixed(1) + "T" :
                             (totalFollowers >= 1e9) ? (totalFollowers / 1e9).toFixed(1) + "B" :
                             (totalFollowers >= 1e6) ? (totalFollowers / 1e6).toFixed(1) + "M" :
                             totalFollowers.toString();

var formattedAverageEngagementRate = averageEngagementRate.toFixed(2) + "%";

// Append scorecards to the scorecard container
var scorecardContainer = d3.select(".scorecard-container");

// Add total views scorecard
var totalViewsCard = scorecardContainer.append("div").classed("scorecard", true);
totalViewsCard.append("div").classed("scorecard-label", true).text("Views");
totalViewsCard.append("div").classed("score", true).text(formattedTotalViews);

// Add total likes scorecard
var totalLikesCard = scorecardContainer.append("div").classed("scorecard", true);
totalLikesCard.append("div").classed("scorecard-label", true).text("Likes");
totalLikesCard.append("div").classed("score", true).text(formattedTotalLikes);

// Add total followers scorecard
var totalFollowersCard = scorecardContainer.append("div").classed("scorecard", true);
totalFollowersCard.append("div").classed("scorecard-label", true).text("Followers");
totalFollowersCard.append("div").classed("score", true).text(formattedTotalFollowers);

// Add average engagement rate scorecard
var averageEngagementRateCard = scorecardContainer.append("div").classed("scorecard", true);
averageEngagementRateCard.append("div").classed("scorecard-label", true).text("Engagement Rate");
averageEngagementRateCard.append("div").classed("score", true).text(formattedAverageEngagementRate);

});

//SCOREBOARD ENDS HERE//

//--------------------------------------------------------------------------------------------//
// Chart 3 Pivot Table Chart START HERE //
const initialWidth = 50; // Set to your initial width percentage
const initialHeight = 50; // Set to your initial height percentage

function createpivotTableChartTable(data) {
    // Create a map to store the count of YouTubers per country
    var countryCountMap = new Map();

    // Count the number of YouTubers per country
    data.forEach(function (d) {
        var country = d.Country;
        if (countryCountMap.has(country)) {
            countryCountMap.set(country, countryCountMap.get(country) + 1);
        } else {
            countryCountMap.set(country, 1);
        }
    });

    // Convert the map to an array for easier table creation
    var countryCounts = Array.from(countryCountMap, ([country, count]) => ({ Country: country, Count: count }));

    // Sort the array based on the Count column in descending order
    countryCounts.sort((a, b) => b.Count - a.Count);

    // Display only the top 10 rows
    var top10CountryCounts = countryCounts.slice(0, 10);

    // Append an SVG container to the "pivotTableChart" div with a responsive viewbox
    var svgContainer = d3.select("#pivotTableChart").append("svg")
        .attr("viewBox", "0 0 " + initialWidth + " " + initialHeight)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .classed("svg-container", true);

    var tableContainer = svgContainer.append("foreignObject")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("xhtml:div")
        .classed("table-container", true);

    // Append a table to the table container
    var tablepivotTableChart = tableContainer.append("table");

    // Append the header row with column names
    var headerpivotTableChart = tablepivotTableChart.append("thead").append("tr");
    Object.keys(top10CountryCounts[0]).forEach(function (key) {
        headerpivotTableChart.append("th").text(key);
    });

    // Create a linear color scale
    var colorScale = d3.scaleLinear()
        .domain([0, d3.max(top10CountryCounts, function (d) { return d.Count; })])
        .range(['#FFED75', '#FFBC58']);

    var rowspivotTableChart = tablepivotTableChart.append("tbody")
        .selectAll("tr")
        .data(top10CountryCounts)
        .enter()
        .append("tr");

    // Populate the rows with data
    rowspivotTableChart.selectAll("td")
        .data(function (d) { return Object.values(d); })
        .enter()
        .append("td")
        .text(function (d) { return d; })
        .classed("heatmap-cell", function (d, i) {
            // Apply heatmap class to the count column
            return i === 1;
        })
        // Set background color for the count column based on the color scale
        .style("background-color", function (d, i) {
            if (i === 1) {
                // Apply the linear color scale to the count value
                return colorScale(d);
            }
            return null;
        });

    // Add a scrollbar to the table
    tablepivotTableChart.style("max-height", "400px");
    tablepivotTableChart.style("overflow-y", "auto");

    // Make the chart responsive
    function resize() {
        // Get the current dimensions of the container
        var containerWidth = window.innerWidth * (initialWidth / 100);
        var containerHeight = window.innerHeight * (initialHeight / 100);

        // Update the SVG container's viewBox
        svgContainer.attr("viewBox", "0 0 " + containerWidth + " " + containerHeight);
    }

    // Initial call to set dimensions
    resize();

    // Call resize function on window resize
    window.addEventListener("resize", resize);
}

d3.csv("top_100_youtubers.csv").then(createpivotTableChartTable);

// Chart 3 Pivot Table Chart ENDS HERE //

//--------------------------------------------------------------------------------------------//

//Chart 2 PivotTable STARTS HERE//
// Load data for Chart 10 from CSV file

// Chart dimensions
// Load data from CSV file
d3.csv("top_100_youtubers.csv").then(function (data) {

    const initialWidth = 80; // Set to your initial width percentage
    const initialHeight = 80; // Set to your initial height percentage

    // Create a map to store the count of YouTubers per country
    var countryCountMap = new Map();

    // Count the number of YouTubers per country
    data.forEach(function (d) {
        var country = d.Country;
        if (countryCountMap.has(country)) {
            countryCountMap.set(country, countryCountMap.get(country) + 1);
        } else {
            countryCountMap.set(country, 1);
        }
    });


    // Convert the map to an array for easier table creation
    var countryCounts = Array.from(countryCountMap, ([country, count]) => ({ Country: country, Count: count }));

    // Sort the array based on the Count column in descending order
    countryCounts.sort((a, b) => b.Count - a.Count);

    var table = d3.select("#pivotDropdownChartTable").append("table");

    // Append the header row with column names
    var header = table.append("thead").append("tr");
    Object.keys(countryCounts[0]).forEach(function (key) {
        header.append("th").text(key);
    });
    // Create a linear color scale
    var colorScale = d3.scaleLinear()
        .domain([0, d3.max(countryCounts, function (d) { return d.Count; })])
        .range(['#FFED75', '#FFBC58']);

    // Populate the dropdown with unique country values for Chart 9
    var countryDropdownpivotDropdownChart = d3.select("#countryDropdownpivotDropdownChart");
    var uniqueCountriespivotDropdownChart = Array.from(countryCountMap.keys());
    countryDropdownpivotDropdownChart.selectAll("option")
        .data(uniqueCountriespivotDropdownChart)
        .enter()
        .append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) { return d; });

    // Handle dropdown change event for Chart 9
    countryDropdownpivotDropdownChart.on("change", function () {
        var selectedCountrypivotDropdownChart = this.value;
        updateHeatmappivotDropdownChart(selectedCountrypivotDropdownChart);
    });

    // Initial heatmap rendering for Chart 9
    updateHeatmappivotDropdownChart(uniqueCountriespivotDropdownChart[0]);

    // Function to update the heatmap based on selected country for Chart 9
    function updateHeatmappivotDropdownChart(selectedCountrypivotDropdownChart) {
        // Remove existing tbody content
        table.select("tbody").remove();

        // Create a new tbody
        var tbody = table.append("tbody");

        var filteredData = countryCounts.filter(function (d) {
            return d.Country === selectedCountrypivotDropdownChart;
        });

        var rows = tbody.selectAll("tr")
            .data(filteredData)
            .enter()
            .append("tr");

        // Populate the rows with data
        rows.selectAll("td")
            .data(function (d) { return Object.values(d); })
            .enter()
            .append("td")
            .text(function (d) { return d; })
            .classed("heatmap-cell", function (d, i) {
                // Apply heatmap class to the count column
                return i === 1;
            })
            // Set background color for the count column based on the color scale
            .style("background-color", function (d, i) {
                if (i === 1) {
                    // Apply the linear color scale to the count value
                    return colorScale(d);
                }
                return null;
            });
    }


//Chart 2 PivotTable ENDS HERE//

//--------------------------------------------------------------------------------------------//
//---------Donut Chart Start HERE------------------ //
// Chart dimensions
function createDonutChart(data) {
    // Fixed width for the chart
    const width = 800;
    const height = 400; // Set a fixed height for the chart
    const radius = Math.min(width, height) / 2;

    // Colors based on the specified scheme
    const colors = [
        "#FFBC58", "#947359", "#CC935E", "#FFED75",
        "#FC9765", "#D1BE9F", "#FFE5BB"
    ];

    // Create an SVG element within the existing donutChartContainer
    var svg = d3.select("#donutChartContainer")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Group data by category
    var categories = d3.nest()
        .key(function(d) { return d.Category; })
        .entries(data);

    // Create a pie chart layout
    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.values.length; });

    // Create an arc generator
    var arc = d3.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius);

    // Generate the pie chart
    var path = svg.selectAll("path")
        .data(pie(categories))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function(_, i) { return colors[i % colors.length]; });

    // Add ticks and tick labels
    var outerRadius = radius - 25; // Adjust the outer radius for ticks
    var ticks = svg.selectAll("g")
        .data(pie(categories))
        .enter()
        .append("g");

    ticks.append("line")
        .attr("x1", 0)
        .attr("y1", -outerRadius)
        .attr("x2", 0)
        .attr("y2", -outerRadius + 10)
        .attr("stroke", "black");

        ticks.append("text")
        .filter(function(d) {
            // Filter out categories with a percentage less than 3%
            var percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
            return percentage >= 3;
        })
        .attr("transform", function (d) {
            var angle = (d.startAngle + d.endAngle) / 2;
            var x = Math.sin(angle) * outerRadius * 0.9; // Adjust the position of labels
            var y = -Math.cos(angle) * outerRadius * 0.9; // Adjust the position of labels
            return "translate(" + x + "," + y + ")";
        })
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
            var percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
            return percentage.toFixed(1) + "%";
        });


        // Initialize the tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 10])
    .html(function (d) {
        var percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
        return `${d.data.key}: ${percentage.toFixed(2)}%`;
    });

// Call the tooltip on the path elements
svg.call(tip);

// Add event listeners to show/hide the tooltip
path.on('mouseover', tip.show)
    .on('mouseout', tip.hide);

        
    // Legends and text styling
    const legend = svg.append("g")
        .attr("transform", `translate(${radius + 20}, -${radius})`)
        .selectAll("g")
        .data(categories.map(d => d.key))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (_, i) => `translate(0, ${i * 20})`);

    const legendWidth = 18;
    const legendHeight = 18;

    legend.append("rect")
        .attr("x", 0)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", (_, i) => colors[i % colors.length]);

    legend.append("text")
        .attr("x", legendWidth + 5)
        .attr("y", legendHeight / 2)
        .attr("dy", "0.35em")
        .text(d => d)
        .style("font-size", "12px");

    // Add an optional outline to the legend box for better visibility
    legend.append("rect")
        .attr("x", 0)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "none");
}

// Fetch data from CSV and create the chart
d3.csv("top_100_youtubers.csv").then(function(data) {
    createDonutChart(data);
}).catch(function(error) {
    // Handle error loading data
    console.error("Error loading data:", error);
});
    //---Donut Chart Ends Here---//

    //--------------------------------------------------------------------------------------------//

    //----Horizontal Bar Chart----//
    
// Load data from CSV file
d3.csv("top_100_youtubers.csv").then(function (data) {
    // Convert followers to numeric values
    data.forEach(function (d) {
        d.followers = +d.followers;
    });

    // Aggregate data by category and sum followers
    const aggregatedData = {};
    data.forEach(function (d) {
        if (!aggregatedData[d.Category]) {
            aggregatedData[d.Category] = 0;
        }
        aggregatedData[d.Category] += d.followers;
    });

    // Convert aggregatedData back into an array of objects
    const aggregatedArray = Object.keys(aggregatedData).map(function (category) {
        return { Category: category, followers: aggregatedData[category] };
    });

    // Sort aggregated data by summed followers in descending order
    aggregatedArray.sort((a, b) => b.followers - a.followers);

    // Set up the chart dimensions
    const margin = { top: 50, right: 20, bottom: 150, left: 160 };
    const width = 1000;
    const height = 800;

    // Create the SVG container with viewBox for responsiveness
    const svg = d3.select("#horizontalBarChart").append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up the xScale
    const maxFollowers = d3.max(aggregatedArray, d => d.followers);
    const maxFollowersRoundedUp = Math.ceil(maxFollowers / 5e8) * 5e8;
    const xScale = d3.scaleLinear()
        .domain([0, maxFollowersRoundedUp])
        .range([0, width])
        .nice();

    const yScale = d3.scaleBand()
        .domain(aggregatedArray.map(d => d.Category))
        .range([0, height])
        .padding(0.1);

    // Add horizontal bars
    svg.selectAll(".bar")
        .data(aggregatedArray)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yScale(d.Category))
        .attr("width", d => xScale(d.followers))
        .attr("height", yScale.bandwidth())
        .attr("fill", "#FFBC58")
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(formatValue(d.followers))
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 20) + "px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add y-axis
    svg.append("g")
        .attr("class", "y-axis")
        .style("font-size", "20px")
        .call(d3.axisLeft(yScale).tickPadding(-2));

    // Add x-axis with custom tick format
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "20px")
        .call(d3.axisBottom(xScale).tickValues(generateTicks()).tickFormat(d => formatTicks(d)));


    // Add x-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width / 2) + "," + (height + margin.top + 40) + ")")
        .text("Followers");

    // Add tooltips
    const tooltip = d3.select("#horizontalBarChart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Function to generate ticks
    function generateTicks() {
        const maxFollowers = d3.max(aggregatedArray, d => d.followers);
        const maxFollowersRoundedUp = Math.ceil(maxFollowers / 5e8) * 5e8; // Round up to the nearest 500M
        const numTicks = maxFollowersRoundedUp / 5e8; // Calculate number of ticks
        return d3.range(0, maxFollowersRoundedUp + 1, 5e8); // Generate ticks at 500M increments
    }

    // Function to format x-axis ticks
    function formatTicks(value) {
        if (value === 0) return "0";
        else if (value === 5e8) return "500M"; // Show 500M instead of 0.5B for the first tick
        else return (value / 1e9) + "B";
    }

    // Function to format value in the tooltip
    function formatValue(value) {
        if (Math.abs(value) >= 1.0e9) {
            return (value / 1.0e9).toFixed(1) + "B";
        } else if (Math.abs(value) >= 1.0e6) {
            return (value / 1.0e6).toFixed(1) + "M";
        } else {
            return value.toFixed(0);
        }
    }
});
    //--------------------------------------------------------------------------------------------//
    // ----- Line Chart -----//

const linemargin = { top: 60, right: 30, bottom: 20, left: 30 };
const linewidth = 800
const lineheight = 400

const svgLine = d3.select("#linechart")
    .append("svg")
    .attr("width", "100%") // Make the width 100%
    .attr("height", "100%") // Make the height 100%
    .attr('viewBox', `0 0 ${linewidth + linemargin.left + linemargin.right} ${lineheight + linemargin.top + linemargin.bottom}`) // Set viewBox for preserving aspect ratio
    .attr('preserveAspectRatio', 'xMinYMin') // Preserve aspect ratio
    .append("g")
    .attr("transform", `translate(${linemargin.left},${linemargin.top})`);

d3.csv("avg_view_every_year.csv").then(data => {
    data.forEach(d => {
        d.Year = +d.Year;
        Object.keys(d).slice(1).forEach(channel => {
            d[channel] = +d[channel];
        });
    });

    const x = d3.scaleLinear().domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)]).range([0, linewidth]);
    const y = d3.scaleLinear().domain([0, 60000000]).range([lineheight, 0]);

    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Value));

    const color = d3.scaleOrdinal()
        .domain(Object.keys(data[0]).slice(1))
        .range(["#FFBC58", "#947359", "#CC935E", "#776C5B", "#FC9765"]);

    const brush = d3.brushX()
        .extent([[0, 0], [linewidth, lineheight]])
        .on("end", brushed);

    svgLine.append("g")
        .call(brush);

    // Function brushed
    function brushed(event) {
        if (event && event.selection) {
            const selectedYears = event.selection.map(x.invert);

            // Update the style of the selected data
            Object.keys(data[0]).slice(1).forEach(channel => {
                svgLine.selectAll(`.${channel}-line`)
                    .style("stroke", d => (d.Year >= selectedYears[0] && d.Year <= selectedYears[1]) ? "red" : color(channel));
            });
        }
    }


    Object.keys(data[0]).slice(1).forEach(channel => {
        svgLine.append("path")
            .data([data])
            .attr("class", `${channel}-line`)
            .style("stroke", color(channel))
            .style("fill", "none")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5")
            .attr("d", line.y(d => y(d[channel])).defined(d => !isNaN(d[channel])));

        svgLine.selectAll(`.${channel}-label`)
            .data(data)
            .enter().append("text")
            .attr("class", `${channel}-label`)
            .attr("x", d => x(d.Year))
            .attr("y", d => y(d[channel]))
            .text(d => d3.format(".2s")(d[channel]))
            .attr("dy", -10)
            .attr("text-anchor", "middle")
            .style("fill", color(channel));

        svgLine.selectAll(`.${channel}-circle`)
            .data(data)
            .enter().append("circle")
            .attr("class", `${channel}-circle`)
            .attr("cx", d => x(d.Year))
            .attr("cy", d => y(d[channel]))
            .attr("r", 4)
            .style("fill", color(channel))
            .style("stroke", "#fff")
            .style("stroke-width", 2)
            .on("mouseover", function (event, d) {
                d3.select(this).append("title")
                    .text(`${d.Year}: ${d3.format(".2s")(d[channel])}`);
            })
            .on("mouseout", function () {
                d3.select(this).select("title").remove();
            });
    });

    svgLine.append("g")
        .attr("transform", `translate(0, ${lineheight})`)
        .call(d3.axisBottom(x).ticks(6).tickFormat(d3.format("d")));

    svgLine.append("g")
        .call(d3.axisLeft(y).tickValues([0, 20000000, 40000000, 60000000]).tickFormat(d3.format(".2s")))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Views");

    // Add legend
    const legend = svgLine.append("g")
        .attr("transform", `translate(0, -20)`)
        .selectAll("g")
        .data(Object.keys(data[0]).slice(1).reverse())
        .enter().append("g")
        .attr("transform", (d, i) => `translate(${i * 150}, 0)`);

    // Use a circle and line in the legend
    const legendRadius = 4;  // Set the radius of the circle

    legend.append("circle")
        .attr("cx", legendRadius)
        .attr("cy", legendRadius)
        .attr("r", legendRadius)
        .attr("fill", color);

    legend.append("line")
        .attr("x1", legendRadius * -2) // Move the line to the right of the circle
        .attr("y1", legendRadius)
        .attr("x2", legendRadius * 4) // Adjust the length of the line
        .attr("y2", legendRadius)
        .style("stroke", color)
        .style("stroke-width", 2);

    legend.append("text")
        .attr("x", legendRadius * 3 + 5) // Adjust the position of the text
        .attr("y", legendRadius)
        .attr("dy", ".35em")
        .text(d => d);
});

    //--------------------------------------------------------------------------------------------//

    //TABLE MOST SUBSCRIBED DAILYTUBE CHANNEL START HERE//
function createTopSubscribedChart(data) {
    // Sort the data based on the "followers" column in descending order
    data.sort((a, b) => parseInt(b.followers) - parseInt(a.followers));

    // Select the top subscribed channel
    var topSubscribedChannel = data[0];

    // Create an SVG container for the chart with viewBox for responsiveness
    var svg = d3.select("#topSubscribedChart").append("svg")
        .attr("viewBox", "0 0 300 100")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .classed("svg-container", true)
        .style("font-size", "25px") ;


    // Calculate font sizes based on the container width
    var containerWidth = 500; // Adjust based on your container size
    var fontSizeChannelName = containerWidth * 0.05; // Example relative font size for channel name
    var fontSizeFollowerInfo = containerWidth * 0.05; // Example relative font size for follower information

    // Format the total followers
    var formattedTotalFollowers = (topSubscribedChannel.followers >= 1e12) ? (topSubscribedChannel.followers / 1e12).toFixed(1) + "T" :
                                 (topSubscribedChannel.followers >= 1e9) ? (topSubscribedChannel.followers / 1e9).toFixed(1) + "B" :
                                 (topSubscribedChannel.followers >= 1e6) ? (topSubscribedChannel.followers / 1e6).toFixed(1) + "M" :
                                 topSubscribedChannel.followers.toString();

    // Display the top subscribed channel and its total followers with responsive styling
    svg.append("text")
        .attr("x", 50)
        .attr("y", 50)
        .style("text-anchor", "center")
        .append("tspan")
            .attr("fill", "#776C5B") // Grey color for channel name
            .attr("font-weight", "bold") // Bold font for channel name
            .style("font-size", fontSizeChannelName + "px") // Responsive font size
            .text(topSubscribedChannel.ChannelName + ":" )
        .append("tspan")
            .attr("fill", "#CC935E") // Custom color for follower information
            .style("font-size", fontSizeFollowerInfo + "px") // Responsive font size
            .text(" " + formattedTotalFollowers);
}

// Load data and create chart
d3.csv("top_100_youtubers.csv").then(createTopSubscribedChart);
//TABLE MOST SUBSCRIBED DAILYTUBE CHANNEL ENDS HERE//

//--------------------------------------------------------------------------------------------//
      //PIE CHART STARTS HERE//
// Function to create the pie chart
function createPieChart(data) {
    // Fixed width for the chart
    const width = 800;
    const height = 400; // Set a fixed height for the chart
    const radius = Math.min(width, height) / 2;

    // Colors based on the specified scheme
    const colors = [
        "#FFBC58", "#947359", "#CC935E", "#FFED75",
        "#FC9765", "#D1BE9F", "#FFE5BB"
    ];

    // Create an SVG element within the existing pieChartContainer
    var svg = d3.select("#pieChartContainer")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Group data by category
    var categories = d3.nest()
        .key(function(d) { return d.Category; })
        .entries(data);

    // Create a pie chart layout
    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.values.length; });

    // Create an arc generator
    var arc = d3.arc()
        .innerRadius(0) // For pie chart, inner radius is 0
        .outerRadius(radius);

    // Generate the pie chart
    var path = svg.selectAll("path")
        .data(pie(categories))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function(_, i) { return colors[i % colors.length]; });
        

     // Add ticks and tick labels
     var outerRadius = radius - 25; // Adjust the outer radius for ticks
    var ticks = svg.selectAll("g")
        .data(pie(categories))
        .enter()
        .append("g");

    ticks.append("line")
        .attr("x1", 0)
        .attr("y1", -outerRadius)
        .attr("x2", 0)
        .attr("y2", -outerRadius + 10)
        .attr("stroke", "black");

    ticks.append("text")
        .filter(function(d) {
            // Filter out categories with a percentage less than 3%
            var percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
            return percentage >= 3;
        })
        .attr("transform", function (d) {
            var angle = (d.startAngle + d.endAngle) / 2;
            var x = Math.sin(angle) * outerRadius * 0.9; // Adjust the position of labels
            var y = -Math.cos(angle) * outerRadius * 0.9; // Adjust the position of labels
            return "translate(" + x + "," + y + ")";
        })
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
            var percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
            return percentage.toFixed(1) + "%";
        });

        
    // Initialize the tooltip
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 10])
            .html(function(d) {
                var percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
        return `${d.data.key}: ${percentage.toFixed(2)}%`;
            });

        // Call the tooltip on the path elements
        svg.call(tip);

        // Add event listeners to show/hide the tooltip
        path.on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    


    // Legends and text styling
    const legend = svg.append("g")
        .attr("transform", `translate(${radius + 20}, -${radius})`)
        .selectAll("g")
        .data(categories.map(d => d.key))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (_, i) => `translate(0, ${i * 20})`);

    const legendWidth = 18;
    const legendHeight = 18;

    legend.append("rect")
        .attr("x", 0)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", (_, i) => colors[i % colors.length]);

    legend.append("text")
        .attr("x", legendWidth + 5)
        .attr("y", legendHeight / 2)
        .attr("dy", "0.35em")
        .text(d => d)
        .style("font-size", "12px");

    // Add an optional outline to the legend box for better visibility
    legend.append("rect")
        .attr("x", 0)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "none");
}


// Fetch data from CSV and create the pie chart
d3.csv("top_100_youtubers.csv").then(function(data) {
    createPieChart(data);
}).catch(function(error) {
    // Handle error loading data
    console.error("Error loading data:", error);
});

//PIE Chart ENDS HERE //
//--------------------------------------------------------------------------------------------//

    //----Scatter Chart Starts Here----------//

var data = [
    { Country: 'IN', ChannelName: 'T-Series', Followers: 220000000, Likes: 1602680172 },
    { Country: 'US', ChannelName: 'ABCkidTV - Nursery Rhymes', Followers: 138000000, Likes: 220990134.6 },
    { Country: 'IN', ChannelName: 'SET India', Followers: 137000000, Likes: 174875242.6 },
    { Country: 'US', ChannelName: 'PewDiePie', Followers: 111000000, Likes: 2191405542 },
    { Country: 'US', ChannelName: 'MrBeast', Followers: 98100000, Likes: 1731833461 },
    { Country: 'US', ChannelName: 'Like Nastya', Followers: 97300000, Likes: 280877652.4 },
    { Country: 'US', ChannelName: '✿ Kids Diana Show', Followers: 97200000, Likes: 235190437.5 },
    { Country: 'US', ChannelName: 'WWE', Followers: 89400000, Likes: 543800874.3 },
    { Country: 'IN', ChannelName: 'Zee Music Company', Followers: 85500000, Likes: 210395355.3 },
    { Country: 'US', ChannelName: 'Vlad and Niki', Followers: 83500000, Likes: 146245435.4 },
    { Country: 'US', ChannelName: '5-Minute Crafts', Followers: 77000000, Likes: 158230212.5 },
    { Country: 'KR', ChannelName: 'BLACKPINK', Followers: 75100000, Likes: 617573972 },
    { Country: 'IN', ChannelName: 'Goldmines Telefilms', Followers: 72000000, Likes: 63642295.56 },
    { Country: 'CA', ChannelName: 'Justin Bieber', Followers: 69400000, Likes: 39350061.94 },
    { Country: 'IN', ChannelName: 'SAB TV', Followers: 69300000, Likes: 109283010.7 },
    { Country: 'US', ChannelName: 'BANGTANTV', Followers: 69100000, Likes: 1640737553 },
    { Country: 'KR', ChannelName: 'ibighit', Followers: 67300000, Likes: 636497162.1 },
    { Country: 'BR', ChannelName: 'Canal KondZilla', Followers: 65800000, Likes: 116511691.1 },
    { Country: 'IN', ChannelName: 'zeetv', Followers: 62100000, Likes: 37475050.79 },
    { Country: 'IN', ChannelName: 'Shemaroo Filmi Gaane', Followers: 60700000, Likes: 12480195.26 },
    { Country: 'US', ChannelName: 'Pinkfong Baby Shark - Kids\' Songs & Stories', Followers: 58700000, Likes: 17219955 },
    { Country: 'US', ChannelName: 'Dude Perfect', Followers: 57800000, Likes: 244293352.9 },
    { Country: 'US', ChannelName: 'Movieclips', Followers: 57300000, Likes: 39953044.15 },
    { Country: 'IN', ChannelName: 'ChuChu TV Nursery Rhymes & Kids Songs', Followers: 57100000, Likes: 31942735 },
    { Country: 'US', ChannelName: 'Marshmello', Followers: 55500000, Likes: 51156331.51 },
    { Country: 'IN', ChannelName: 'Colors TV', Followers: 53400000, Likes: 182929448 },
    { Country: 'IN', ChannelName: 'Wave Music', Followers: 52800000, Likes: 135816576.6 },
    { Country: 'US', ChannelName: 'EminemMusic', Followers: 52600000, Likes: 45500762.85 },
    { Country: 'IN', ChannelName: 'Aaj Tak', Followers: 52300000, Likes: 204913414.4 },
    { Country: 'US', ChannelName: 'Ed Sheeran', Followers: 52100000, Likes: 97976609.8 },
    { Country: 'IN', ChannelName: 'Tips Official', Followers: 52000000, Likes: 35849829.85 },
    { Country: 'IN', ChannelName: 'Sony Music India', Followers: 51600000, Likes: 406235612.4 },
    { Country: 'US', ChannelName: 'Ariana Grande', Followers: 51500000, Likes: 44484407.8 },
    { Country: 'IN', ChannelName: 'T-Series Bhakti Sagar', Followers: 51300000, Likes: 27470145.64 },
    { Country: 'US', ChannelName: 'El Reino Infantil', Followers: 50900000, Likes: 11453139.1 },
    { Country: 'US', ChannelName: 'LooLoo Kids - Nursery Rhymes and Children\'s Songs', Followers: 49400000, Likes: 25323367.15 },
    { Country: 'IN', ChannelName: 'YRF', Followers: 46900000, Likes: 230841570.4 },
    { Country: 'US', ChannelName: 'Taylor Swift', Followers: 46800000, Likes: 22039543.26 },
    { Country: 'US', ChannelName: 'JuegaGerman', Followers: 45900000, Likes: 641782272.8 },
    { Country: 'US', ChannelName: 'Billie Eilish', Followers: 45900000, Likes: 37371320.82 },
    { Country: 'MX', ChannelName: 'Badabun', Followers: 45600000, Likes: 288740569.4 },
    { Country: 'SV', ChannelName: 'Fernanfloo', Followers: 45100000, Likes: 937427149.9 },
    { Country: 'IN', ChannelName: 'Infobells - Hindi', Followers: 44700000, Likes: 24257065.2 },
    { Country: 'BR', ChannelName: 'Felipe Neto', Followers: 44200000, Likes: 763318297 },
    { Country: 'US', ChannelName: 'whinderssonnunes', Followers: 43800000, Likes: 196137065.7 },
    { Country: 'US', ChannelName: 'BRIGHT SIDE', Followers: 43700000, Likes: 36932146.78 },
    { Country: 'CL', ChannelName: 'HolaSoyGerman.', Followers: 43300000, Likes: 222616795.2 },
    { Country: 'BR', ChannelName: 'Você Sabia?', Followers: 43100000, Likes: 449621753.4 },
    { Country: 'US', ChannelName: 'Katy Perry', Followers: 43000000, Likes: 5322828.259 },
    { Country: 'US', ChannelName: 'SonyMusicIndiaVEVO', Followers: 42300000, Likes: 117320899.9 },
    { Country: 'NO', ChannelName: 'Alan Walker', Followers: 42000000, Likes: 55641776.54 },
    { Country: 'PR', ChannelName: 'Bad Bunny', Followers: 41600000, Likes: 138038669.5 },
    { Country: 'US', ChannelName: 'Like Nastya Show', Followers: 41300000, Likes: 39269151.6 },
    { Country: 'BY', ChannelName: 'A4', Followers: 40600000, Likes: 766852538 },
    { Country: 'RU', ChannelName: 'Get Movies', Followers: 40500000, Likes: 16319224.4 },
    { Country: 'IN', ChannelName: 'Speed Records', Followers: 40500000, Likes: 155670991.2 },
    { Country: 'US', ChannelName: 'elrubiusOMG', Followers: 40400000, Likes: 814895443 },
    { Country: 'PH', ChannelName: 'ABS-CBN Entertainment', Followers: 39800000, Likes: 240442177.4 },
    { Country: 'US', ChannelName: 'Rihanna', Followers: 39400000, Likes: 1205009.12 },
    { Country: 'US', ChannelName: 'Little Baby Bum - Nursery Rhymes & Kids Songs', Followers: 39200000, Likes: 5749294.194 },
    { Country: 'MX', ChannelName: 'Luisito Comunica', Followers: 39000000, Likes: 247337977.2 },
    { Country: 'RU', ChannelName: 'Маша и Медведь', Followers: 38300000, Likes: 23751378.74 },
    { Country: 'US', ChannelName: 'TheEllenShow', Followers: 38300000, Likes: 167231088.8 },
    { Country: 'IN', ChannelName: 'Shemaroo', Followers: 38200000, Likes: 19334895.6 },
    { Country: 'IN', ChannelName: 'Voot Kids', Followers: 38100000, Likes: 46360335.99 },
    { Country: 'BR', ChannelName: 'Luccas Neto', Followers: 37500000, Likes: 156622828.8 },
    { Country: 'BR', ChannelName: 'GR6 EXPLODE', Followers: 37500000, Likes: 245579644.7 },
    { Country: 'US', ChannelName: 'xxxtentacion', Followers: 37400000, Likes: 33550305.4 },
    { Country: 'IN', ChannelName: 'Ishtar Music', Followers: 37400000, Likes: 18094604 },
    { Country: 'US', ChannelName: 'One Direction', Followers: 37200000, Likes: 18852717 },
    { Country: 'US', ChannelName: 'Kimberly Loaiza', Followers: 36900000, Likes: 240742149.4 },
    { Country: 'TH', ChannelName: 'WorkpointOfficial', Followers: 36800000, Likes: 80346776.67 },
    { Country: 'US', ChannelName: 'Shakira', Followers: 36700000, Likes: 16923109.41 },
    { Country: 'US', ChannelName: 'Daddy Yankee', Followers: 36600000, Likes: 188506752.5 },
    { Country: 'US', ChannelName: 'Toys and Colors', Followers: 36300000, Likes: 50988592.12 },
    { Country: 'US', ChannelName: 'WWE', Followers: 89400000, Likes: 543800874.3 },
    { Country: 'IN', ChannelName: 'Zee Music Company', Followers: 85500000, Likes: 210395355.3 },
    { Country: 'US', ChannelName: 'Vlad and Niki', Followers: 83500000, Likes: 146245435.4 },
    { Country: 'US', ChannelName: '5-Minute Crafts', Followers: 77000000, Likes: 158230212.5 },
    { Country: 'KR', ChannelName: 'BLACKPINK', Followers: 75100000, Likes: 617573972 },
    { Country: 'IN', ChannelName: 'Goldmines Telefilms', Followers: 72000000, Likes: 63642295.56 },
    { Country: 'CA', ChannelName: 'Justin Bieber', Followers: 69400000, Likes: 39350061.94 },
    { Country: 'IN', ChannelName: 'SAB TV', Followers: 69300000, Likes: 109283010.7 },
    { Country: 'US', ChannelName: 'BANGTANTV', Followers: 69100000, Likes: 1640737553 },
    { Country: 'KR', ChannelName: 'ibighit', Followers: 67300000, Likes: 636497162.1 }
  ];
  
  var colorScale = d3.scaleOrdinal()
    .domain(["IN", "US", "KR", "CA", "BR", "SV", "MX", "RU", "TH", "NO","CL","PR","BY","PH"])
    .range(["#000000", "#fc9647", "#CC935E", "#FFED75", "#FFBE5C", "#CCA770", "#776c5b", "#FFBC58", "#6a6257",'#e46808']);
  
  // Create SVG element
  var svg = d3.select('#scatterPlotContainer')
    .append('svg')
    .attr("width", "100%") // Make the width 100%
    .attr("height", "100%") // Make the height 100%
    .attr('preserveAspectRatio', 'xMinYMin')
    .attr('viewBox', '0 0 600 400')
    .classed('svg-content', true);
  
  // Define scales with swapped domains
  const xScale = d3.scaleLinear()
    .domain([0, 4e9])  
    .range([0, 500]);
  
  const yScale = d3.scaleLinear()
    .domain([0, 300000000])  
    .range([300, 0]);
  
  // Create y-axis with custom ticks
  svg.append("g")
    .attr("transform", "translate(50, 50)")
    .call(d3.axisLeft(yScale).tickFormat(d3.format(".2s")).tickValues([0, 100000000, 200000000, 300000000]))
    .selectAll("text")
    .attr("dy", "1em");
  
  // Create x-axis with custom ticks and format
  svg.append("g")
    .attr("transform", "translate(50, 350)")
    .call(d3.axisBottom(xScale).tickFormat(d3.format(".1s")).tickValues([0, 1e9, 2e9, 3e9, 4e9]))
    .selectAll("text")
    .attr("dy", "1em");
  
  // Add y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -200) 
    .attr("y", 20)   
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text("Followers");
  
  // Add x-axis label
  svg.append("text")
    .attr("x", 250) 
    .attr("y", 400) 
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text("Likes");
  
  // Create scatter plot points with country-specific colors
  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => xScale(d.Likes) + 50)  
    .attr("cy", d => yScale(d.Followers) + 50) 
    .attr("r", 6) 
    .attr("class", d => d.Country) 
    .style("fill", d => colorScale(d.Country)); 
  
  // Add legend
  var legend = svg.selectAll(".legend")
    .data(colorScale.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(500," + (i * 20 + 50) + ")");
  
  legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorScale);
  
  legend.append("text")
    .attr("x", 25)
    .attr("y", 9)
    .attr("dy", ".3em")
    .style("text-anchor", "start")
    .text(d => d);
  
  // Add labels
  svg.selectAll(".label")
    .data(data)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", d => xScale(d.Likes) + 50) 
    .attr("y", d => yScale(d.Followers) + 50 - 10)  
    .attr("text-anchor", "middle")
    .attr("font-size", "10px");

//--------------------------------------------------------------------------------------------//

    // Stacked Chart Starts Here
// set the dimensions and margins of the graph

var margin = { top: 60, right: 10, bottom: 60, left: 50 }, // Increased bottom margin
  width = 600,
  height = 400;

// Read the CSV file and create the stacked bar chart
d3.csv('top_100_youtubers.csv', function (d, i, columns) {
  var q1 = Number(d["Income q1"]);
  var q2 = Number(d["Income q2"]);
  var q3 = Number(d["Income q3"]);
  var q4 = Number(d["Income q4"]);
  return {
    ChannelName: d.ChannelName,
    "Income q1": q1,
    "Income q2": q2,
    "Income q3": q3,
    "Income q4": q4,
    Total: q1 + q2 + q3 + q4
  }
}).then(function (data) {

  // Filter and sort the data to get the top 5 YouTube channels
  var topChannels = d3.nest()
    .key(function (d) { return d.ChannelName; })
    .rollup(function (values) {
      return {
        "Income q1": d3.sum(values, function (d) { return d["Income q1"]; }),
        "Income q2": d3.sum(values, function (d) { return d["Income q2"]; }),
        "Income q3": d3.sum(values, function (d) { return d["Income q3"]; }),
        "Income q4": d3.sum(values, function (d) { return d["Income q4"]; }),
        Total: d3.sum(values, function (d) { return d.Total })
      };
    })
    .entries(data)
    .map(function (d, i) {
      return {
        ChannelName: d.key,
        "Income q1": d.value["Income q1"],
        "Income q2": d.value["Income q2"],
        "Income q3": d.value["Income q3"],
        "Income q4": d.value["Income q4"],
        Total: d.value.Total,
      }
    }).sort(function (a, b) {
      return b.Total - a.Total;
    })
    .slice(0, 5);

  var keys = ["Income q1", "Income q2", "Income q3", "Income q4"];

  // Create scales for x-axis and y-axis
  var xScale = d3.scaleBand()
    .domain(topChannels.map(function (d) { return d.ChannelName; }))
    .range([0, width])
    .padding(0.1);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(topChannels, function (d) {
      return d.Total;
    })])
    .range([height, 0]);

  // Create the color scale
  var colorScale = d3.scaleOrdinal()
    .domain(['q1', 'q2', 'q3', 'q4'])
    .range(["#FFBC58", "#947359", "#CC935E", "#FC9765"]);

  // Create the stacked bar chart
  var svg = d3.select('#stackedchart').append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr('preserveAspectRatio', 'xMinYMin')
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create a tooltip element
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltipstacked")
    .style("position", "absolute")
    .style("visibility", "hidden");

  var rects = svg.selectAll('g')
    .data(d3.stack().keys(keys)(topChannels))
    .enter().append('g');

  rects
    //.attr('transform', function (d) { console.log(d); return 'translate(' + xScale(d.key) + ',' + 0 + ')'; })
    .attr('fill', function (d) { return colorScale(d.key); })
    .selectAll('rect')
    .data(function (d) {
      for (var i = 0; i < d.length; i++)
        d[i].index = d.index;
      return d;
    })
    .enter().append('rect')
    .attr('x', function (d) { return xScale(d.data.ChannelName); })
    .attr('y', function (d) { return yScale(d[1]); })
    .attr('width', xScale.bandwidth())
    .attr('height', function (d) { return yScale(d[0]) - yScale(d[1]); })
    .attr('class', function (d, i, node) {
      return 'rect group' + d.index;
    })
    .on("mouseover", function (d, i, node) {
      // Show income value on hover
      var incomeValue = d.data.ChannelName + " " + d3.format("$.2s")(d[1]);
      tooltip.text(incomeValue)
        .style('visibility', 'visible')
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY - 15) + 'px');
    })
    .on("mouseout", function () {
      tooltip.style('visibility', 'hidden');
    });

  var texts = svg.selectAll('.rect-text')
    .data(d3.stack().keys(keys)(topChannels));
  rects.selectAll('text')
    .data(function (d) { return d; })
    .enter()
    .append('text')
    .text(function (d) { return d3.format("$.2s")(d[1]); })
    .attr('x', function (d) { return xScale(d.data.ChannelName) + xScale.bandwidth() / 2; })
    .attr('y', function (d) { return yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2; })
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("fill", '#fff');

  // Add x-axis with rotated labels
  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-45)');

  // Add y-axis with more ticks
  svg.append('g')
    .call(d3.axisLeft(yScale).ticks(10).tickFormat(d3.format("$.2s")));

  // Add Legend
  var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + (width / 2 - 2 * 100) + ', -50)');

  legend.selectAll('rect')
    .data(keys)
    .enter().append('rect')
    .attr('x', function (d, i) { return i * 100; })
    .attr('y', 0)
    .attr('width', 18)
    .attr('height', 18)
    .attr('fill', colorScale)
    .on("mouseover", function (d, i, node) {
      var selector = '.group' + i;
      d3.selectAll(".rect").transition()
        .style("opacity", 0.3);
      d3.selectAll(selector).transition()
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      tooltip.style('visibility', 'hidden');
      d3.selectAll(".rect").transition()
        .style("opacity", 1);
    });

  legend.selectAll('text')
    .data(['Income q1', 'Income q2', 'Income q3', 'Income q4'])
    .enter().append('text')
    .attr('x', function (d, i) { return 20 + i * 100; })
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'start')
    .text(function (d) {
      return d;
    });

});

    
    //--------------------------------------------------------------------------------------------//

    //--Vertical Chart Stars Here--//

d3.csv("top_100_youtubers.csv").then(function (data) {
    // Create an object to store counts for each country
    const countryCounts = {};

    // Count occurrences of each country
    data.forEach(function (d) {
        const country = d.Country;
        if (countryCounts[country]) {
            countryCounts[country]++;
        } else {
            countryCounts[country] = 1;
        }
    });

    // Convert counts to an array of objects
    const countsArray = Object.keys(countryCounts).map(country => ({
        country: country,
        count: countryCounts[country]
    }));

    // Sort the countsArray in descending order based on count
    countsArray.sort((a, b) => b.count - a.count);

    // Take only the first 10 elements
    const top10Countries = countsArray.slice(0, 10);

    // Create the chart using top10Countries instead of countsArray
    const svg = d3.select("#verticalBarChart")
        .append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr('preserveAspectRatio', 'xMinYMin')
        .attr('viewBox', '0 0 600 400')

    const margin = { top: 30, right: 20, bottom: 60, left: 50 };
    const width = 600;
    const height = 400;

    // Define graph title
    svg.append("text")
        .attr("x", width / 2 + margin.left)
        .attr("y", margin.top * 0.6)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")

    // Define left axis title
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left * 0.05)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Number of DailyTubers");

    // Define x axis title
    svg.append("text")
        .attr("x", 250)
        .attr("y", 400)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Likes")
        .text("Country");

    function handleBarClick(d) {
        const clickedBar = d3.select(this);
        const clickedCountry = d.country;

        // Reset opacity for all bars
        svg.selectAll(".bar").attr("opacity", 0.5);

        // Highlight the clicked bar
        clickedBar.attr("opacity", 1).attr("fill", "orange");
    }

    //svg.attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom);

    const x = d3.scaleBand()
        .range([margin.left, width - margin.right])
        .domain(top10Countries.map(d => d.country))
        .padding(0.2);

    const y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, d3.max(countsArray, d => d.count) + 10]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(0)")
        .style("text-anchor", "middle");

    // Create the y-axis with custom ticks and hide the axis line
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5))
        .select(".domain").remove(); // Remove the y-axis line

    // Create the bar chart using top10Countries
    svg.selectAll(".bar")
        .data(top10Countries)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.country))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.bottom - y(d.count))
        .attr("fill", "#FFBC58")
        .on("mouseover", function (d) {
            d3.select(this)
                .attr("stroke", "lightgray")
                .attr("stroke-width", "2px");

            const tooltipWidth = tooltip.node().offsetWidth;
            const tooltipHeight = tooltip.node().offsetHeight;

            tooltip.style("opacity", 1)
                .html(`Count: ${d.count}`)
                .style("left", (d3.event.pageX + 10) + "px") // Offset from the mouse pointer
                .style("top", (d3.event.pageY - tooltipHeight - 10) + "px"); // Above the mouse pointer
        })
        .on("mouseout", function () {
            d3.select(this)
                .attr("stroke", "none");
            tooltip.style("opacity", 0);
        })
        .on("click", handleBarClick);

    // Reset opacity when clicking off bars
    svg.on("click", function () {
        const isBarClicked = d3.event.target.classList.contains("bar");

        if (!isBarClicked) {
            svg.selectAll(".bar").attr("opacity", 1);
        }
    });

    // Add tooltip
    const tooltip = d3.select("#verticalBarChart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}).catch(function (error) {
    console.log(error); // Log any potential errors in loading the data
});
    
    //--------------------------------------------------------------------------------------------//

//---Most Sub Chart Starts HERE---//
    
function createTopSubscribedChart(data) {
    // Sort the data based on the "followers" column in descending order
    data.sort((a, b) => parseInt(b.followers) - parseInt(a.followers));

    // Select the top subscribed channel
    var topSubscribedChannel = data[0];

    // Create an SVG container for the chart with viewBox for responsiveness
    var svg = d3.select("#topSubscribedChart").append("svg")
        .attr("viewBox", "0 0 300 100")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .classed("svg-container", true)
        .style("font-size", "30px") ;


    // Calculate font sizes based on the container width
    var containerWidth = 500; // Adjust based on your container size
    var fontSizeChannelName = containerWidth * 0.07; // Example relative font size for channel name
    var fontSizeFollowerInfo = containerWidth * 0.07; // Example relative font size for follower information

    // Format the total followers
    var formattedTotalFollowers = (topSubscribedChannel.followers >= 1e12) ? (topSubscribedChannel.followers / 1e12).toFixed(1) + "T" :
                                 (topSubscribedChannel.followers >= 1e9) ? (topSubscribedChannel.followers / 1e9).toFixed(1) + "B" :
                                 (topSubscribedChannel.followers >= 1e6) ? (topSubscribedChannel.followers / 1e6).toFixed(1) + "M" :
                                 topSubscribedChannel.followers.toString();

    // Display the top subscribed channel and its total followers with responsive styling
    svg.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .style("text-anchor", "start")
        .append("tspan")
            .attr("fill", "#776C5B") // Grey color for channel name
            .attr("font-weight", "bold") // Bold font for channel name
            .style("font-size", fontSizeChannelName + "px") // Responsive font size
            .text(topSubscribedChannel.ChannelName + ":" )
        .append("tspan")
            .attr("fill", "#CC935E") // Custom color for follower information
            .style("font-size", fontSizeFollowerInfo + "px") // Responsive font size
            .text(" " + formattedTotalFollowers);
}

// Load data and create chart
d3.csv("top_100_youtubers.csv").then(createTopSubscribedChart);



//--------------------------------------------------------------------------------------------//
});
