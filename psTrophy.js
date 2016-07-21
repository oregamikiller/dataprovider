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





var job = function () {

MongoClient.connect("mongodb://localhost:27017/gamepark", function (err, mdb) {
    db = mdb;
});
rp.get({
    url: "http://d7vg.com/psngame?ob=newest&pf=ps4&dlc=all",
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
        var desc   = $(this).find('td >em').text().replace(new RegExp('\n','gm'),'').substr(0,13);
        var picUrl = $(this).find('td').eq(0).find('a').find('img').attr('src');
        if (url) {
            var game        = {plantForm: 'ps4', title: title, url: url, picUrl: picUrl, deep: 1, desc:desc, id:parseInt(url.replace('http://d7vg.com/psngame/','')),};
            game.timestamp  = new Date().getTime();
            gameList.push(game);
            console.log(game);

            db.collection("gameTrophy").find({'url': url, deep: 1}).toArray(function (err, docs) {
                if (!err && docs.length < 1) {
                    db.collection("gameTrophy").insert(game);
                }
            });
            var locaton_url = url;
            rp.get({
                url: locaton_url,
                method: 'GET',
                encoding: 'utf-8',
                headers: {
                    ContentType: 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version'
                }
            }).then(function (res) {
                $ = cheerio.load(res);
                $(".list").find('tr').each(function (i, elem) {
                    var index  = $(this).find('td').eq(1).find('.h-p').text().substr(1);
                    var title  = $(this).find('td').eq(1).find('p').find('a').text();
                    var url    = $(this).find('td').eq(1).find('p').find('a').attr('href');
                    var picUrl = $(this).find('td').eq(0).find('a').find('img').attr('src');
                    var desc   = $(this).find('td >em').eq(0).text();

                    if (url) {
                        var trophy = {
                            index: parseInt(index),
                            title: title,
                            detailUrl: url,
                            picUrl: picUrl,
                            plantForm: 'ps4',
                            deep: 2,
                            url: locaton_url,
                            id: parseInt(locaton_url.replace('http://d7vg.com/psngame/','')),
                            desc: desc
                        }
                        console.log(trophy);
                        db.collection("gameTrophy").find({'detailUrl': url, deep: 2}).toArray(function (err, docs) {
                            if (!err && docs.length < 1) {
                                db.collection("gameTrophy").insert(trophy);
                            }
                        });
                    }
                });
            });
        }
    });
});

};

var rule    = new schedule.RecurrenceRule();
rule.hour = [6, 18];
schedule.scheduleJob(rule, function () {
    job();
    console.log('执行任务!!!');
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

