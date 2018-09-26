require("dotenv").config();
var fs = require("fs");
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var moment = require('moment');
var time = moment().format('HH:mm:ss');
var music = new Spotify(keys.Keys.spotify);

var firstParm = process.argv[2];
var secondParm = process.argv[3];
var logTxt = 'command log at: ' + time + '. Params: ' + firstParm + '; ' + secondParm + '; \n';


switch(firstParm) {
  
  case 'concert-this': {
    console.log('concert-this');
    break;
  }
  case 'spotify-this-song': {
    spotifyFunc;
    break;
  }
  case 'movie-this': {
    console.log('movie-this');
    break;
  }
  case 'do-what-it-says': {
    console.log('do-what-it-says');
    break;
  }
}


var spotifyFunc = music.search({ type: 'track', query: secondParm, limit: '1', year: null }, function(err, data) {

  fs.appendFile('./log.txt', logTxt);
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  console.log(data.tracks.items[0].album.artists[0].name);
  console.log(data.tracks.items[0].name);
  console.log(data.tracks.items[0].preview_url);
  console.log(data.tracks.items[0].album.name);
});


  


// spotify
//   .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
//   .then(function(data) {
//     console.log(data); 
//   })
//   .catch(function(err) {
//     console.error('Error occurred: ' + err); 
//   });