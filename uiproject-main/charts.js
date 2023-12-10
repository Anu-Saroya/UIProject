
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

//Most Sub HERE//
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
