require("dotenv").config();
var fs = require("fs");
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var Spotify1 = new Spotify(keys.Keys.spotify);
var moment = require('moment');
var time = moment().format('HH:mm:ss');
var request = require('request');
var axios = require("axios");
var firstParm = process.argv[2];
var secondParm = process.argv[3];
var logTxt = 'command log at: ' + time + '. Params: ' + firstParm + '; ' + secondParm + '; \n';

function command(arg){

  switch(arg) {
    case 'concert-this': {
      bands(secondParm);
      break;
    }
    case 'spotify-this-song': {
      spotifyFunc(secondParm);
      break;
    }
    case 'movie-this': {
      if (!secondParm) secondParm = "Mr. Nobody";
      omdb(secondParm);
      break;
    }
    case 'do-what-it-says': {
      doWhatItSays();
    }
  }
}

function doWhatItSays(){

    fs.readFile("random.txt", "utf8", function(error, data){
      if (error) return;

      firstParm = data.split(",")[0].trim();
      secondParm = data.split(",")[1].trim();
      
      command(firstParm);
    });
}


function bands(arg){
  request("https://rest.bandsintown.com/artists/" + arg + "/events?app_id=ea94f426-4fab-4bb1-b6ba-bd86821d522f&date=2000-01-01%2C2018-09-09", function(error, response, body) {
    if (!error && response.statusCode === 200) {

      var data = JSON.parse(body);

      var count = 0;
      for (var i = data.length-1; i > 0; i--){
        count++;
        if (count > 10) return;

        var dateOfConcert = data[i].datetime;
        var dateOfConcertMJS = moment(dateOfConcert).format("MM/DD/YYYY");

        var result = {
          "Name of the venue: " : data[i].venue.name,
          "Venue location: " : data[i].venue.city + ', ' + data[i].venue.country,
          "Date of the Event: " : dateOfConcertMJS
        }
        consoleLog(result);
      }

    } else console.log("error", error);

  });
}

function spotifyFunc(arg){ 

  if (arg === undefined) arg = "the sign year:1993";

  Spotify1.search({ type: 'track', query: arg, limit: '1'}, function(err, data) {

    log();
    
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var result = {
      "Band name: " : data.tracks.items[0].album.artists[0].name,
      "Song name: " : data.tracks.items[0].name,
      "preview_url: " : data.tracks.items[0].preview_url,
      "Album name: " : data.tracks.items[0].album.name
    }
    consoleLog(result);
  });
}



function omdb(arg){
  axios.get("http://www.omdbapi.com/?t=" + arg + "&y=&plot=short&apikey=trilogy").then(
  function(response) {

      var result = {
        "Title: " : response.data.Title,
        "Year: " : response.data.Year,
        "imdbRating: " : response.data.imdbRating,
        "Rotten Tomatoes Rating: " : response.data.Ratings ? response.data.Ratings[1].Value : "",
        "Country: " : response.data.Country,
        "Language: " : response.data.Language,
        "Plot: " : response.data.Plot,
        "Actors: " : response.data.Actors
      }
      consoleLog(result);
    },
    function(error){
      console.log("error", error);
    }
  );
}

function consoleLog(obj){
  for (var key in obj){
    console.log(key + obj[key]);
  }
}

function log(){
  fs.appendFile('./log.txt', logTxt, function (err) {
    if (err) throw err;
  });

}



command(firstParm);

