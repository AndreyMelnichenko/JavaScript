var fs = require('fs');
var contents = fs.readFileSync('config', 'utf8');
console.log(contents);
