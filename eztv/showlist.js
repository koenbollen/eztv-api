
var sys = require("sys");
var request = require("request");
var htmlparser = require("htmlparser");
var select = require("soupselect").select;

var utils = require("../utils");

module.exports = function(req, res)
{
    request("http://eztv.it/showlist/", function(err, result, body) {
        if(err) throw err;
        if( result.statusCode != 200 ) throw new Error("Invalid statusCode: " + result.statusCode);
        var handler = new htmlparser.DefaultHandler(function (err, dom) {
            if (err) throw err;
            var list = [];
            select(dom, "table.forum_header_border tr[name=hover]").forEach(function(e,i) {
                var show = {};
                var tds = select(e, "td");
                show.href = tds[0].children[0].attribs.href;
                var rx = /\/shows\/(\d+)\/([^\/]+)/;
                var groups = show.href.match(rx);
                show.id = groups[1];
                show.slug = groups[2];
                show.title = utils.alltext(tds[0]);
                show.status = utils.alltext(tds[1]);
                show.class = tds[1].children[0].attribs['class'];
                list.push(show);
            });
            res.end(JSON.stringify(list));
        });
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
    });
};