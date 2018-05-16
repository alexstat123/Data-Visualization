console.log("map.js is responding perfectly");


//adjust map colors and canvas dimentions 
var countrySelectColor = '#fde8ca'; // '#fde8ca' 'orange'
var mapColor = "#b2b2b2"; //"#225" , "#cccccc", #b2b2b2
var hostColor = '318dbc';
var someData = [1]

var width = 600,
    height = 420;

// select the canvas
var svg = d3.select("#map-view").append("svg")
    .attr("width", width)
    .attr("height", height);

//set map projection
var projection = d3.geoConicConformal().scale(100)
    .translate([width / 2.5, height / 1.7]);

var path = d3.geoPath()
    .projection(projection);

// put longitude and latitude lines on the map 
svg.append("path")
    .attr("id", "graticule")
    .attr("fill", "none")
    .attr("stroke", "#777")
    .attr("stroke-width", 0.5)
    .attr("stroke-opacity", 0.5)
    .attr("d", path(d3.geoGraticule10()));
// part of latitude and longitude code 
svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("d", path({ type: "Sphere" }));



// load world json file, here you can put "data/world.json" or "https://d3js.org/world-50m.v1.json"
d3.json("data/world.json", function(error, world) {
    if (error) throw error;

    // get list of countries
    var countries = topojson.feature(world, world.objects.countries).features;

    // display all the countries
    svg.selectAll(".country")
        .data(countries)
        .enter().append("path")
        .attr("fill", mapColor)
        .attr("class", "country")
        .attr("d", path)
        .on('click', function(d) {
            //clear map
            clearMap();
            changeColorCountryMouse(d.id);

            // world cups partisipated in
            worldCupaParticipatedIn(d);

            //populate table
            diselectCountry(d)
            
            // populate table with wold cups won, selected country
            wonCups(d);

            // populate table with runner up, selected country
            runnerUp(d);
        })



});

// function that highlighes countries
function diplayCountries(showCountry) {


    var teamList = showCountry;
    for (i = 0; i < teamList.length; i++) {

        svg.selectAll(".country")
            .filter(function(d) {

                return d.id === teamList[i] // 004 is another country

            })
            .style('fill', countrySelectColor)


    }

}

// function that removes countries 
function removeCountries(showCountry) {

    // clear map 
    clearMap();

    var teamList = showCountry;
    for (i = 0; i < teamList.length; i++) {

        svg.selectAll(".country")
            .filter(function(d) {
                return d.id === teamList[i] // 004 is another country

            })
            .style('fill', mapColor)

    }


}


// get latitude and longitude data from winners and runners up, draw circle on the map
function dot(winlatitude, winlongitudine, data, runlatitude, runlongitudine) {

    //longitude and latitude data here


    //display winning city circles 
    svg.selectAll(".city-circle")
        .data(someData)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) {
            var coords = projection([winlongitudine, winlatitude])

            return coords[0];
        })
        .attr("cy", function(d) {
            var coords = projection([winlongitudine, winlatitude])
            return coords[1];
        })
        .style("fill", "yellow")
        .style("stroke", "grey")


    //display runner up city circles 
    svg.selectAll(".city-circle")
        .data(someData)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) {
            var coords = projection([runlongitudine, runlatitude])

            return coords[0];
        })
        .attr("cy", function(d) {
            var coords = projection([runlongitudine, runlatitude])
            return coords[1];
        })
        .style("fill", "#e1e1e1")
        .style("stroke", "grey")

}

// clear canvas from the circles 
function dotOut() {


    svg.selectAll("circle").remove();
}

function showHost(hostcountry) {



    var host = hostcountry;


    svg.selectAll(".country")
        .filter(function(d) {

            return d.id === host // 004 is another country

        })
        .style('fill', hostColor)



}

// chnage the color of the cournty when clicked on it 
function changeColorCountryMouse(country) {

    console.log(country);


    // higlight clicked country
    svg.selectAll(".country")
        .filter(function(d) {

            return d.id === country

        })
        .style('fill', 'orange')

}

function clearMap() {


    svg.selectAll(".country")
        .filter(function(d) {

            return d

        })
        .style('fill', mapColor)

}

function worldCupaParticipatedIn(mapdata) {

    // get data from csv 
    d3.csv("data/fifa-world-cup.csv", function(error, data) {

        var myarray = new Array();
        // format the data
        data.forEach(function(d, i) {

            var teamsArray = d.TEAM_LIST;
            var array = teamsArray.split(",");

            // check if the cuntry participated in any wolrd cups
            var countrySelected = array;
            var checkelement = mapdata.id;
            if (countrySelected.includes(checkelement) == true) {


                myarray.push(d.EDITION);

            }

        });
        // remove il elements from previous selection
        d3.selectAll("li").remove();

        //populate table with participating countries array
        //console.log(myarray);
        var ul = d3.select('#worldcups').append('ul');
        ul.selectAll('li')
            .data(myarray) //mydata //d.EDITION
            .enter()
            .append('li')
            .html(String);


    })



}


// function that shows world cups won by selected country
function wonCups(mapData){
    
    // array that will store world cups won by selected country
    var worldCupsWonArray = new Array();

    // get data from csv file
    d3.csv("data/fifa-world-cup.csv", function(error, data){
     
     data.forEach(function(d, i){
       
       // get coordinates of winning countrys capital citie
       var coords = [d.WIN_LON, d.WIN_LAT]
       
       // if winning city coordinates are in the country then county has won
       var countryContainsWinningCoordinates = d3.geoContains(mapData, coords);
       if(countryContainsWinningCoordinates == true){
            
             worldCupsWonArray.push(d.EDITION);
       } 
       
     })

     console.log(worldCupsWonArray);
     

        //populate table with participating countries array
        var ul = d3.select('#wonStatistic').append('ul');
        ul.selectAll('li')
            .data(worldCupsWonArray) //mydata //d.EDITION
            .enter()
            .append('li')
            .html(String);

    })
    

}

// function that shows number of times selected country came second in world cup
function runnerUp(mapData){

    //array that will store number of times country came second
    var runnerUpArray = new Array();

    // get data from csv file
    d3.csv("data/fifa-world-cup.csv", function(error, data){
     
     // get coordinates of runner up countrys capital citie
     data.forEach(function(d, i){
       
       // if runner up country city cordinates are in the country the it is the runner up
       var coords = [d.RUP_LON, d.RUP_LAT]
      
       
       var countryContainsWinningCoordinates = d3.geoContains(mapData, coords);
       if(countryContainsWinningCoordinates == true){
            
             runnerUpArray.push(d.EDITION);
       } 
       
     })

        //populate table with participating countries array
        var ul = d3.select('#runnerUpcountry').append('ul');
        ul.selectAll('li')
            .data(runnerUpArray) //mydata //d.EDITION
            .enter()
            .append('li')
            .html(String);

    })
}

function diselectCountry(d){

   d3.select('#countryHeader')
                .html(d.id);

   // var ul = d3.select('#countryHeader').append('ul');
   //      ul.selectAll('li')
   //          .data(d.id) //mydata //d.EDITION
   //          .enter()
   //          .append('li')
   //          .html(d.id);
}

