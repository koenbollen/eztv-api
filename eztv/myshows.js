
var sys = require( "sys" );
var request = require( "request" );
var htmlparser = require( "htmlparser" );
var select = require("soupselect").select;
var S = require("string");
var utils = require( "../utils" );

exports.list = function(req, res) {
    var url = "http://eztv.it/myshows/list/";
    var user = req.query.user;
    var token = req.query.token;
    var j = request.jar();
    j.add( request.cookie( "username="+user ) );
    j.add( request.cookie( "password="+token ) );
    utils.cachedrequest({key: url+user, url: url, jar:j}, 10*60*1000, function(err, response, body) {
        if (err) throw err;
        var handler = new htmlparser.DefaultHandler(function (err, dom) {
            if (err) throw err;
            var list = [];
            select(dom, "table.forum_header_border tr[name=hover]").forEach(function(e,i) {
                var show = {};
                var tds = select(e, "td");
                show.href = tds[1].children[0].attribs.href;
                var rx = /\/shows\/(\d+)\/([^\/]+)/;
                var groups = show.href.match(rx);
                show.id = groups[1];
                show.slug = groups[2];
                show.title = utils.alltext(tds[1]);
                show.status = utils.alltext(tds[2]);
                show.class = tds[2].children[0].attribs['class'];
                list.push(show);
            });
            res.end(JSON.stringify(list));
        });
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
    });
};

exports.index = function(req, res)
{
    var url = "http://eztv.it/myshows/";
    var user = req.query.user;
    var token = req.query.token;
    var j = request.jar();
    j.add( request.cookie( "username="+user ) );
    j.add( request.cookie( "password="+token ) );
    utils.cachedrequest({key: url+user, url: url, jar:j}, 10*60*1000, function(err, response, body) {
        if (err) throw err;
        var handler = new htmlparser.DefaultHandler(function (err, dom) {
            if (err) throw err;
            var shows = {};
            var episodes = [];
            select(dom, "table.forum_header_border tr[class=table]").forEach(function(e,i) {
                var a = select(e, "a")[1];
                var href = a.attribs.href;
                var rx = /\/shows\/(\d+)\/([^\/]+)/;
                var groups = href.match(rx);
                var showid = groups[1];
                var showtitle = utils.alltext(a);
                shows[showid] = showtitle;
            });
            var trs = select(dom, "table.forum_header_border tr[name=hover]");
            trs.forEach(function(e,i) {
                if( i >= trs.length/2 )
                    return;
                var episode = {};
                var tds = select(e, "td");
                episode.id = select(tds[0], "a")[0].attribs.href.match(/\/myshows\/(\d+)\//)[1];
                episode.showid = select(tds[1], "a")[0].attribs.href.match(/\/shows\/(\d+)\//)[1];
                episode.show = shows[episode.showid];
                episode.name = utils.alltext(tds[1]);
                episode.date = utils.parseEztvDate(utils.alltext(tds[3]));
                episode.torrents = [];
                select(tds[2], "a").forEach(function(e){
                    if( S(e.attribs.class).startsWith("download_") )
                        episode.torrents.push( e.attribs.href );
                    if( S(e.attribs.class).startsWith("magnet") )
                        episode.magnet = e.attribs.href;
                });
                episodes.push(episode);
            });
            res.end(JSON.stringify(episodes));
        });
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
    });
};






