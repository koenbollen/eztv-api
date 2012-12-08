
var sys = require("sys");
var S = require("string");
var request = require("request");

var utils = module.exports = {};

utils.alltext = function( dom ) {
    if( dom.type == "text" )
        return S(dom.raw).trim().s;
    var result = "";
    if( dom.children === undefined )
        return "";
    dom.children.forEach(function(e) {
        result += utils.alltext(e) + " ";
    });
    return S(result).trim().s;
};

utils.cachedrequest = function( url, ttl, callback/*(err, response, body)*/ )
{
    var cachekey = url;
    if( url.key !== undefined )
        cachekey = url.key;
    GLOBAL.cache(cachekey, ttl, function(passalong) {
        console.log("Fetching " + sys.inspect(url));
        request(url, function(err, response, body){
            if( err ) return passalong(err);
            if( response.statusCode != 200 ) return passalong(new Error("Invalid statusCode: " + response.statusCode));
            passalong(err, response, body);
        });
    }, callback);
};

var months = {
    "Jan": 0,
    "Feb": 1,
    "Mar": 2,
    "Apr": 3,
    "May": 4,
    "Jun": 5,
    "Jul": 6,
    "Aug": 7,
    "Sep": 8,
    "Oct": 9,
    "Nov": 10,
    "Dec": 11
};

utils.parseEztvDate = function( str )
{
    var splits = str.split(" ");
    var day = splits[0].match(/(\d+)(st|nd|rd|th)/)[1];
    var month = months[splits[1]];
    var year = parseInt(splits[2], 10);
    if( year < 100 )
    {
        if( year < 50 )
            year += 2000;
        else
            year += 1900;
    }
    return new Date(year, month, day);
};
