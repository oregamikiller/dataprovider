/**
 * Created by oregami on 16/2/3.
 */
var log         = console.log;
var schedule    = require('node-schedule');
var MongoClient = require('mongodb').MongoClient;
var db          = null;
var cheerio     = require('cheerio');
var request     = require('request');
var iconv       = require('iconv-lite');
var path        = require('path');
var fs          = require('fs');
var Promise     = require('bluebird');
var rp          = require('request-promise');







MongoClient.connect("mongodb://localhost:27017/gamepark", function (err, mdb) {
    db = mdb;
});


rp.get({
    url: "http://psnine.com/node/guide",
    method: 'GET',
    encoding: 'utf-8',
    headers: {
        ContentType: 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version'
    }
}).then(function (res) {
    $            = cheerio.load(res);
    var gameList = [];
    $(".list").find('li').each(function (i, elem) {
        var url    = $(this).find('div .title').find('a').attr("href");
        var title  = $(this).find('div .title').find('a').text();
        var picUrl = $(this).find('div .thumb').eq(0).find('a').find('img').attr('src');
        var author =$(this).find('div .meta > a').text();
        if (url) {
            var game        = {title: title, url: url, picUrl: picUrl, deep: 1, desc:'psnine.com: ' + author, id:parseInt(url.replace('http://psnine.com/topic/','')),};
            game.timestamp  = new Date().getTime();
            gameList.push(game);
            console.log(game);

            db.collection("gameGuide").find({'url': url, deep: 1}).toArray(function (err, docs) {
                if (!err && docs.length < 1) {
                    db.collection("gameGuide").insert(game);
                }
            });
        }
    });
});