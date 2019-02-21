var fs = require('fs');
var contents = fs.readFileSync('config', 'utf8');
var strArr = contents.split("\r\n");
strArr.splice(strArr.length-1,1);
var myObject = {};

module.exports = function(key){
	strArr.map(function (i) {return i.split('=');}).forEach(function (j) {myObject[j[0].trim()] = j[1];});
	return myObject[key];
};
