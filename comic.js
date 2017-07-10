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
var urls = [];

function main() {


rp.get({
    url: "http://manhua.fzdm.com/2/Vol_001/",
    method: 'GET',
    encoding: 'utf-8',
    headers: {
        ContentType: 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version'
    }
}).then(function(result) {
    $            = cheerio.load(result);
    log(result);
});
}

module.exports=main;

if (require.main === module) {
    main();
}
