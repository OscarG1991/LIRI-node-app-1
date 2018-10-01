var axios = require("axios");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var Spotify1 = new Spotify(keys.Keys.spotify);



module.exports = {
    log: log(logStr),
    omdb: omdb(),
    spotifyFunc: spotifyFunc()

}


function log(logStr){
    fs.appendFile('./log.txt', logStr, function (err) {
      if (err) throw err;
    });
  
  }
  
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