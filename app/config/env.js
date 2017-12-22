var path = require('path');
var rootPath = path.normalize(__dirname + '/../'); // normalizes to base path
console.log(rootPath);
module.exports = {
    development: {
        rootPath: rootPath,
        database: 'bgdesktop',
        host: "localhost.berkeleygroup.co.uk",
        port: process.env.PORT || 3000
    },
    test: {
        rootPath: rootPath,
        database: 'bgtestdesktop',
        host: "localhost.berkeleygroup.co.uk",
        port: process.env.PORT || 3000
    },
    production: {
        rootPath: rootPath,
        database: 'mongodb://bginteractive.berkeleygroup.co.uk/bgdesktop',
        host: "bginteractive.berkeleygroup.co.uk",
        port: process.env.PORT || 80
    }
};
