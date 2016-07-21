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
var target     = 'http://seiya-saiga.com/game/galge.html';


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
    console.log(iconv.decode(res, "shift_jis"));
    //$            = cheerio.load(iconv.decode(res, "shift_jis"));

    //$("tbody").find('tr').each(function (i, elem) {
    //    console.log($(this).find('td').find('b').find('a').text());
    //});
});