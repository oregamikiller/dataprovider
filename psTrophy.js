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
var platforms   = ['ps4', 'ps3', 'psvita'];
var tasks        = [];
var tasks0       = [];
var gamelist     = [];





var job = function () {

MongoClient.connect("mongodb://localhost:27017/gamepark", function (err, mdb) {
    db = mdb;
});
    platforms.forEach(function (pf){
        tasks.push(
            rp.get({
                url: "http://d7vg.com/psngame?ob=newest&pf=" + pf + "&dlc=all",
                method: 'GET',
                encoding: 'utf-8',
                headers: {
                    ContentType: 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version'
                }
            })
        );
    });

    Promise.all(tasks).then(function (results){
        results.forEach(function (result, index) {
            $            = cheerio.load(result);
            $(".list").find('tr').each(function (i, elem) {
                var url    = $(this).find('td').eq(1).find('p').find('a').attr("href");
                var title  = $(this).find('td').eq(1).find('p').find('a').text();
                var desc   = $(this).find('td >em').text().replace(new RegExp('\n', 'gm'), '').substr(0, 13);
                var picUrl = $(this).find('td').eq(0).find('a').find('img').attr('src');
                if (url) {
                    var game       = {
                        plantForm: platforms[index],
                        title: title,
                        url: url,
                        picUrl: picUrl,
                        deep: 1,
                        desc: desc,
                        id: parseInt(url.replace('http://d7vg.com/psngame/', '')),
                    };
                    game.timestamp = new Date().getTime();
                    gamelist.push(game);
                    console.log(game);
                    db.collection("gameTrophy").find({'url': url, deep: 1, plantForm:platforms[index]}).toArray(function (err, docs) {
                        if (!err && docs.length < 1) {
                            db.collection("gameTrophy").insert(game);
                        }
                    });
                    var locaton_url = url;
                    tasks0.push(rp.get({
                        url: locaton_url,
                        method: 'GET',
                        encoding: 'utf-8',
                        headers: {
                            ContentType: 'application/x-www-form-urlencoded',
                            'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version'
                        }
                    }));
                }
            });
        });
        return Promise.resolve('ok');
    }).then(function () {
        Promise.all(tasks0).then(function (results) {
            results.forEach(function (result, _i){
                $ = cheerio.load(result);
                $(".list").find('tr').each(function (i, elem) {
                    var index  = $(this).find('td').eq(1).find('.h-p').text().substr(1);
                    var title  = $(this).find('td').eq(1).find('p').find('a').text();
                    var url    = $(this).find('td').eq(1).find('p').find('a').attr('href');
                    var picUrl = $(this).find('td').eq(0).find('a').find('img').attr('src');
                    var desc   = $(this).find('td >em').eq(0).text();
                    var desc_cn= $(this).find('td').eq(1).find('.text-strong').text();
                    if (desc_cn && desc.length > 0) {
                        desc = desc + '|' + desc_cn;
                    }

                    if (url) {
                        var trophy = {
                            index: parseInt(index),
                            title: title,
                            detailUrl: url,
                            picUrl: picUrl,
                            deep: 2,
                            url: gamelist[_i].url,
                            id: parseInt(gamelist[_i].url.replace('http://d7vg.com/psngame/', '')),
                            desc: desc
                        };
                        console.log(trophy);
                        db.collection("gameTrophy").find({'detailUrl': url, deep: 2}).toArray(function (err, docs) {
                            if (!err && docs.length < 1) {
                                db.collection("gameTrophy").insert(trophy);
                            }
                        });
                    }
                });
            });
            return Promise.resolve('ok')
    }).then(function () {
        console.log("all done")
        tasks = [];
        tasks0       = [];
        gamelist     = [];
        return Promise.resolve('ok');
    }).catch(function (e) {
        console.log(e);
    });
    });
};

var rule    = new schedule.RecurrenceRule();
rule.hour = [6, 18];
schedule.scheduleJob(rule, function () {
    job();
    console.log('执行任务!!!');
});
