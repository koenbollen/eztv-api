
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
    GLOBAL.cache(url, ttl, function(passalong) {
        console.log("Fetching " + url)
        request(url, function(err, response, body){
            if( err ) return passalong(err);
            if( response.statusCode != 200 ) return passalong(new Error("Invalid statusCode: " + response.statusCode));
            passalong(err, response, body);
        });
    }, callback);
};
