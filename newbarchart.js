console.log("bar chart is working well, yeehhaaa yea!");
var listCountriesMap = ["USA", "RUS", "ITA"];
// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 400 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set barchart animation speeds
var barsSpeed = 300;
var yAxisSpeed = 800;
var delaySpeed = 20;

// set the ranges
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
var y = d3.scaleLinear()
    .range([height, 0]);



// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("svg");
var g = svg.append("g")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("data/fifa-world-cup.csv", function(error, data) {
    if (error) throw error;


    // format the data
    data.forEach(function(d) {
        d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.YEAR; }));
    y.domain([0, d3.max(data, function(d) { return d.AVERAGE_ATTENDANCE; })]);

    // append the rectangles for the bar chart
    g.selectAll("g")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.YEAR); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.AVERAGE_ATTENDANCE); })
        .attr("height", function(d) { return height - y(d.AVERAGE_ATTENDANCE); })
        .on("mouseover", function(d, i) {
             

            clearMap();
            // convert team list collection into array that d3 understands 
            var teamsArray = d.TEAM_LIST;
            var array = teamsArray.split(",");
            diplayCountries(array);
            var winnerArray = d.winner;

            //place a circle for winner and runner up teams
            dot(d.WIN_LAT, d.WIN_LON, d, d.RUP_LAT, d.RUP_LON);

            // show host countries 
            showHost(d.host_country_code);

            // panel, change title 
            d3.select('#edition')
                .html(d.EDITION);

            // panel, change host info
            d3.select('#host')
                //.style('color','red')
                .html(d.host);

            // panel, change host info
            d3.select('#winner')
                .html(d.winner);

            // panel, change runner up info
            d3.select('#silver')
                .html(d.runner_up);

            // panel, change teams info
			var ul = d3.select('#teams').append('ul');
            var teamsNames = d.TEAM_NAMES;
            var arrayNames = teamsNames.split(",");

            ul.selectAll('li')
                .data(arrayNames)
                .enter()
                .append('li')
                .html(String);

        })
        .on("mouseout", function(d, i) {

            // convert team list collection into array that d3 understands 
            var teamsArray = d.TEAM_LIST;
            var array = teamsArray.split(",");
            removeCountries(array);
            dotOut();

            // panel, remove teams list
            d3.selectAll("li").remove();


        })
        // fill up color of the bars acording to the data
        .attr("fill", function(d) {
            var corlor = Math.round(d.AVERAGE_ATTENDANCE / 200);
			return "rgb(0,0," + (corlor) + ")";
        });



    // add the x Axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-90)");

    // add the y Axis
	g.append("g")
        .call(d3.axisLeft(y));

});

// change data when selecting drop down menue. run different functions depending on data selected
function changeData() {
    var dataFile = document.getElementById('dataset').value;
    if (dataFile == "teams") {
        d3.csv('data/fifa-world-cup.csv', updateTeam);
    }

    if (dataFile == "matches") {
        d3.csv('data/fifa-world-cup.csv', updateMatches);
    }

    if (dataFile == "goals") {
        d3.csv('data/fifa-world-cup.csv', updateGoals);
    }

    if (dataFile == "attendance") {
        d3.csv('data/fifa-world-cup.csv', updateAVERAGE_ATTENDANCE);
    }



}

// run function that reads TEAMS data from csv file
function updateTeam(data) {

    //storage arrays
    TEAMS = [];
    YEAR = [];

   // pushing data into storage arrays
    data.forEach(function(d) {
        
        d.teams = parseFloat(d.TEAMS);
        d.year = parseFloat(d.YEAR)

        
        TEAMS.push(d.TEAMS);
        YEAR.push(d.YEAR)
    });


  
    //update bar chart 
    d3.csv("data/fifa-world-cup.csv", function(error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.TEAMS = +d.TEAMS;
        });

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.YEAR; }));
        y.domain([0, d3.max(data, function(d) { return d.TEAMS; })]);

        // append the rectangles for the bar chart
        g.selectAll("rect")
            .data(data)
            .transition()
            .duration(barsSpeed)
            .delay(function(d, i) { return i * delaySpeed; })
            .attr("x", function(d) { return x(d.YEAR); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.TEAMS); })
            .attr("height", function(d) { return height - y(d.TEAMS); })
            .attr("fill", function(d) {
                var corlor = Math.round(d.TEAMS * 10);
                return "rgb(0,0," + (corlor) + ")";
            });


        // add the y Axis
        g.selectAll("g")
            .data(data)
            .transition()
            .duration(yAxisSpeed)  
            .call(d3.axisLeft(y));

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");


    });

}


// run function that reads MATCHES data from csv file
function updateMatches(data) {

    //storage arrays
    MATCHES = [];
    YEAR = [];
    
    // pushing data into storage arrays
    data.forEach(function(d) {
        
        d.teams = parseFloat(d.MATCHES);
        d.year = parseFloat(d.YEAR)

        MATCHES.push(d.MATCHES);
        YEAR.push(d.YEAR)
    });




    //update bar chart 
	d3.csv("data/fifa-world-cup.csv", function(error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.MATCHES = +d.MATCHES;
        });

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.YEAR; }));
        y.domain([0, d3.max(data, function(d) { return d.MATCHES; })]);

        // append the rectangles for the bar chart
        g.selectAll("rect")
            .data(data)
            .transition()
            .duration(barsSpeed)
            .delay(function(d, i) { return i * delaySpeed; })
            .attr("x", function(d) { return x(d.YEAR); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.MATCHES); })
            .attr("height", function(d) { return height - y(d.MATCHES); })
            .attr("fill", function(d) {
                var corlor = Math.round(d.MATCHES * 3);
                console.log(corlor);
                //console.log(data);

                return "rgb(0,0," + (corlor) + ")";
            });



        // add the y axis
        g.selectAll("g")
            .data(data)
            .transition()
            .duration(yAxisSpeed) // 500 is best here 
            .call(d3.axisLeft(y));
        
        // add the x axis
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");


    });

}


function updateGoals(data) {
    console.log("updateMatches function is working!");
    
    //storage arrays
    GOALS = [];
    YEAR = [];
    
    // pushing data into storage arrays
    data.forEach(function(d) {
        
        d.teams = parseFloat(d.GOALS);
        d.year = parseFloat(d.YEAR)

        
        GOALS.push(d.GOALS);
        YEAR.push(d.YEAR)
    });



    


    //update bar chart 
	d3.csv("data/fifa-world-cup.csv", function(error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.GOALS = +d.GOALS;
        });

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.YEAR; }));
        y.domain([0, d3.max(data, function(d) { return d.GOALS; })]);

        // append the rectangles for the bar chart
        g.selectAll("rect")
            .data(data)
            .transition()
            .duration(barsSpeed)
            .delay(function(d, i) { return i * delaySpeed; })
            .attr("x", function(d) { return x(d.YEAR); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.GOALS); })
            .attr("height", function(d) { return height - y(d.GOALS); })
            .attr("fill", function(d) {
                var corlor = Math.round(d.GOALS * 1.5);
                console.log(corlor);
                //console.log(data);

                return "rgb(0,0," + (corlor) + ")";
            });



        // add the y Axis
        g.selectAll("g")
            .data(data)
            .transition()
            .duration(yAxisSpeed) // 500 is best here 
            .call(d3.axisLeft(y));
        
        // add the x - axis
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");


    });

}

// run function that reads AVERAGE_ATTENDANCE data from csv file
function updateAVERAGE_ATTENDANCE(data) {
    console.log("updateMatches function is working!");

    // storage arrays
    AVERAGE_ATTENDANCE = [];
    YEAR = [];

    data.forEach(function(d) {
        
        d.teams = parseFloat(d.AVERAGE_ATTENDANCE);
        d.year = parseFloat(d.YEAR)

        
        AVERAGE_ATTENDANCE.push(d.AVERAGE_ATTENDANCE);
        YEAR.push(d.YEAR)
    });



    


    //update bar chart 
	d3.csv("data/fifa-world-cup.csv", function(error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
        });

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.YEAR; }));
        y.domain([0, d3.max(data, function(d) { return d.AVERAGE_ATTENDANCE; })]);

        // append the rectangles for the bar chart
        g.selectAll("rect")
            .data(data)
            .transition()
            .duration(barsSpeed)
            .delay(function(d, i) { return i * delaySpeed; })
            .attr("x", function(d) { return x(d.YEAR); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.AVERAGE_ATTENDANCE); })
            .attr("height", function(d) { return height - y(d.AVERAGE_ATTENDANCE); })
            .attr("fill", function(d) {
                var corlor = Math.round(d.AVERAGE_ATTENDANCE / 200);
                console.log(corlor);
                //console.log(data);

                return "rgb(0,0," + (corlor) + ")";
            });



        // add the y Axis
        g.selectAll("g")
            .data(data)
            .transition()
            .duration(yAxisSpeed) // 500 is best here 
            .call(d3.axisLeft(y));
        
        // add the x axis
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");


    });

}