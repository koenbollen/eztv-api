
var S = require("string");

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
    return S(result).trim().s;;
}