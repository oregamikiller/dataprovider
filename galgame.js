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
var target     = 'http://seiya-saiga.com/game/galge.html';
var list = [];
var detaillist = [];


MongoClient.connect("mongodb://localhost:27017/gamepark", function (err, mdb) {
    db = mdb;
});

rp.get({
    url: target,
    method: 'GET',
    encoding: null,
    headers: {
        ContentType: 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version'
    }
}).then(function (res) {
    $ = cheerio.load(iconv.decode(res, "shift_jis"));

    $("tbody").find('tr').each(function (i, elem) {
       var title = $(this).find('td').eq(0).find('b').find('a').text();
        if(title)
        {var url = 'http://seiya-saiga.com/game/' + $(this).find('td').eq(0).find('b').find('a').attr('href');
            var item = {title:title, url: url };
            list.push(item);
        }
    });
    return Promise.resolve('ok');
}).then(function () {
    list.forEach(function (item) {
        tasks.push(rp.get({
            url: item.url,
            method: 'GET',
            encoding: null,
            headers: {
                ContentType: 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version'
            }
        }));
    });
    return Promise.resolve('ok');
}).then(function () {
    Promise.all(tasks).then(function (results){
        results.forEach(function (result) {
                $ = cheerio.load(iconv.decode(result, "shift_jis"));
                $("table").find('tbody').find('table').eq(2).find('tr').each(function (i, elem) {
                    detaillist.push($(this).find('td').eq(0).text());
                    console.log($(this).find('td').eq(0).text());

                });
            $("table").find('tbody').find('table').eq(2).find('tr').each(function (i, elem) {
                detaillist.push($(this).find('td').eq(1).text());
                console.log($(this).find('td').eq(1).text());
            });
        });
    });
});