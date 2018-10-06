var liri = require("./liriClass.js");

var grabData = new liri(process.argv[2], process.argv[3]);

grabData.command();