require("dotenv").config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var music = new Spotify(keys.spotifyKeys);


console.log(keys.spotifyKeys);


  
 
music.search({ type: 'track', query: 'All the Small Things', limit: '1' }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
console.log(data.tracks.items[0]); 
});

// spotify
//   .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
//   .then(function(data) {
//     console.log(data); 
//   })
//   .catch(function(err) {
//     console.error('Error occurred: ' + err); 
//   });