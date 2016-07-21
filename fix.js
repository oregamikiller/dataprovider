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







MongoClient.connect("mongodb://oregami:random66@localhost:27017/gamepark", function (err, mdb) {
    db = mdb;
});


rp.get({
    url: "http://d7vg.com/psngame?ob=newest&pf=ps4&dlc=all&page=37",
    method: 'GET',
    encoding: 'utf-8',
    headers: {
        ContentType: 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version'
    }
}).then(function (res) {
    $            = cheerio.load(res);
    var gameList = [];
    $(".list").find('tr').each(function (i, elem) {
        var url    = $(this).find('td').eq(1).find('p').find('a').attr("href");
        var title  = $(this).find('td').eq(1).find('p').find('a').text();
        var desc   = $(this).find('td >em').text().replace(new RegExp('\n','gm'),'').substr(0,14);
        var picUrl = $(this).find('td').eq(0).find('a').find('img').attr('src');
        if (url) {
            var game        = {plantForm: 'ps4', title: title, url: url, picUrl: picUrl, deep: 1, desc:desc, id:parseInt(url.replace('http://d7vg.com/psngame/','')),};
            game.timestamp  = new Date().getTime();
            gameList.push(game);
            console.log(game);

            db.collection("gameTrophy").updateOne(
                { "url" : url, 'deep':1 },
                {
                    $set: { "desc": desc },
                }, function(err, results) {
                    console.log('done');
                });
        }
    });
});


function dateFormat(short) {
    var date = new Date();
    var yy   = date.getFullYear();
    var MM   = date.getMonth() + 1;
    if (MM < 10) {
        MM = '0' + MM
    }
    ;
    var dd = date.getDate();
    if (date < 10) {
        dd = '0' + dd
    }
    ;
    var hh = date.getHours();
    if (hh < 10) {
        hh = '0' + hh
    }
    ;
    var mm = date.getMinutes();
    if (mm < 10) {
        mm = '0' + mm
    }
    ;
    var ss = date.getSeconds();
    if (ss < 10) {
        ss = '0' + ss
    }
    ;

    var result = yy + '年' + MM + '月' + dd + '日' + hh + ':' + mm + ':' + ss;
    if (short) {
        result = yy + '年' + MM + '月' + dd + '日';
    }
    return result;
}

