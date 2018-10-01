require("dotenv").config();
var fs = require("fs");
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var moment = require('moment');
var time = moment().format('HH:mm:ss');
var request = require('request');
var axios = require("axios");
// var bandsintown = require('bandsintown')("codingbootcamp");


// var https = require('https');
var Spotify1 = new Spotify(keys.Keys.spotify);

var firstParm = process.argv[2];
var secondParm = process.argv[3];
var logTxt = 'command log at: ' + time + '. Params: ' + firstParm + '; ' + secondParm + '; \n';


switch(firstParm) {

  case 'concert-this': {
    console.log('concert-this');
    bands(secondParm);
    break;
  }
  case 'spotify-this-song': {
    spotifyFunc(secondParm);
    break;
  }
  case 'movie-this': {
    omdb(secondParm);
    break;
  }
  case 'do-what-it-says': {
    console.log('do-what-it-says');
    break;
  }
}

function log(){
  fs.appendFile('./log.txt', logTxt, function (err) {
    if (err) throw err;
  });

}

function bands(arg){
  request("https://rest.bandsintown.com/artists/" + arg + "/events?app_id=ea94f426-4fab-4bb1-b6ba-bd86821d522f&date=2000-01-01%2C2018-09-09", function(error, response, body) {
    if (!error && response.statusCode === 200) {

      var data = JSON.parse(body);

      for (var i = 0; i < data.length; i++){
      
      var dateOfConcert = data[i].datetime;
      var dateOfConcertMJS = moment(dateOfConcert).format("MM/DD/YYYY");
      
        console.log('Name of the venue: ' + data[i].venue.name);
        console.log('Venue location: ' + data[i].venue.city + ', ' + data[i].venue.country);
        console.log('Date of the Event: ' + dateOfConcertMJS + ' \n');
      }

    } else console.log("error", error);

  });
}


// function omdbReq(arg){
//   request("http://www.omdbapi.com/?t=" + arg + "&y=&plot=short&apikey=trilogy",
//   function(error, response) {
//     if (error) {
//       console.log("error", error);
//       return;
//     }
//     var resp = response.body;
//     resp = JSON.parse(resp);
    
//     console.log(resp.Title);
//     console.log(resp.Year);
//     console.log(resp.imdbRating);
//     console.log(resp.Ratings[1].Value);
//     console.log(resp.Country);
//     console.log(resp.Language);
//     console.log(resp.Plot);
//     console.log(resp.Actors);
//     }
//   );
// }

function omdb(arg){
  axios.get("http://www.omdbapi.com/?t=" + arg + "&y=&plot=short&apikey=trilogy").then(
  function(response) {
    console.log(response.data.Title);
    console.log(response.data.Year);
    console.log(response.data.imdbRating);
    console.log(response.data.Ratings[1].Value);
    console.log(response.data.Country);
    console.log(response.data.Language);
    console.log(response.data.Plot);
    console.log(response.data.Actors);
    },
    function(error){
      console.log("error", error);
    }
  );
}


function spotifyFunc(arg){ 
  Spotify1.search({ type: 'track', query: arg, limit: '1'}, function(err, data) {
      log();
    
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      console.log(data.tracks.items[0].album.artists[0].name);
      console.log(data.tracks.items[0].name);
      console.log(data.tracks.items[0].preview_url);
      console.log(data.tracks.items[0].album.name);
  });
}

