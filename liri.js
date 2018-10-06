// dot env for information security
require("dotenv").config();

//Variables
var keys = require("./keys.js");
var request = require('request');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var input = process.argv;
var action = input[2];
var inputs = input[3];
var divider = "-------------------------------------------------------------------";

//Switch statement for four code blocks (concert-this, movie-this, spotify-this-song, do-what-it-says)
switch (action) {
    case "concert-this":
    concert(inputs);
    break;
    
    
    case "spotify-this-song":
	spotify(inputs);
	break;

	case "movie-this":
	movie(inputs);
	break;

	case "do-what-it-says":
	doit();
	break;
};

//Function that utilizes the bandsintown API for the concert-this command
function concert(inputs) {
    var artist = process.argv.slice(3).join(" ")
    console.log(artist);
   
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryURL, function (error, response, body) {
        if (error) console.log(error);
		var result  =  JSON.parse(body)[0];
		console.log(divider);
        console.log("Venue Name: " + result.venue.name);
        console.log("Venue Location: " + result.venue.city);
		console.log("Date of Event: " +  moment(result.datetime).format("MM/DD/YYYY"));
		console.log(divider);
    });
}

//Function that uses the spotify API for the spofity-this-song command
function spotify(inputs) {

	var spotify = new Spotify(keys.spotify);
		if (!inputs){
        	inputs = 'The Sign';
    	}
		spotify.search({ type: 'track', query: inputs }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }

			var songInfo = data.tracks.items;
			console.log(divider);
	        console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
			console.log("Album: " + songInfo[0].album.name);
			console.log(divider);
	});
}
//Function utilizing the OMDB API for the movie-this command
function movie(inputs) {

	var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function(error, response, body) {
		if (!inputs){
        	inputs = 'Mr Nobody';
    	}
		if (!error && response.statusCode === 200) {

			console.log(divider);
		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log(divider);
		}
	});
};

//Function that extracts text from the random.txt file and executes it as a command using the spotify-this-song command
function doit() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		// Then split it by commas to make it easier to read
		var dataArr = data.split(",");

		// Spotify the request within the random.txt file 
		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotify(songcheck);
		} 
  	});
};

