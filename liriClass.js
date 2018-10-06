require("dotenv").config();
var fs = require("fs");
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotifyObj = new Spotify(keys.Keys.spotify);
var moment = require('moment');
var time = moment().format('HH:mm:ss');
var request = require('request');
var axios = require("axios");
var logTxt = 'command log at: ' + time + '. Params: ' + process.argv[2] + '; ' + process.argv[3] + '; \n';


class Liri {

    constructor(firstArg, secondArg){
      this.firstArg = firstArg;
      this.secondArg = secondArg;
    }

    command(){
      switch(this.firstArg) {

        case 'concert-this': {
          if (!this.secondArg) this.secondArg = "nirvana";
          this.bands(this.secondArg);
          break;
        }
        case 'spotify-this-song': {
          this.spotifyFunc(this.secondArg);
          break;
        }
        case 'movie-this': {
          if (!this.secondArg) this.secondArg = "Mr. Nobody";
          this.omdb(this.secondArg);
        break;
        }
        case 'do-what-it-says': {
          this.doWhatItSays();
        }
      }
    }

    doWhatItSays(){

      var self = this;

      fs.readFile("random.txt", "utf8", function(error, data){
        
        if (error) return;
  
        self.firstArg = data.split(",")[0].trim();
        self.secondArg = data.split(",")[1].trim();
        
        self.command();
      });
    }

    bands(arg){

      var self = this;

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
            self.consoleLog(result);
          }
    
        } else console.log("error", error);
      
        });
      }

    spotifyFunc(arg){ 

      this.log();

      var result = {};

      var self = this;

      if (arg === undefined) arg = "the sign year:1993";
    
      spotifyObj.search({ type: 'track', query: arg, limit: '1'}, function(err, data) {
        
          if (err) {
            return console.log('Error occurred: ' + err);
          }
          result = {
            "Band name: " : data.tracks.items[0].album.artists[0].name,
            "Song name: " : data.tracks.items[0].name,
            "preview_url: " : data.tracks.items[0].preview_url,
            "Album name: " : data.tracks.items[0].album.name
          }

          self.consoleLog(result);
      });

    }

    omdb(){

      var self = this;

      axios.get("http://www.omdbapi.com/?t=" + this.secondArg + "&y=&plot=short&apikey=trilogy").then(
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
          self.consoleLog(result);
        },
        function(error){
          console.log("error", error);
        }
      );
    }

    consoleLog(obj){
      for (var key in obj){
        console.log(key + obj[key]);
      }
    }
      
    log(){
      fs.appendFile('./log.txt', logTxt, function (err) {
        if (err) throw err;
      });
    }
}

module.exports = Liri;
