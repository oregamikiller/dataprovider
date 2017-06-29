/**
 * Created by oregami on 16/2/3.
 */
var log         = console.log;
var schedule    = require('node-schedule');
var cheerio     = require('cheerio');
var request     = require('request');
var iconv       = require('iconv-lite');
var path        = require('path');
var fs          = require('fs');
var Promise     = require('bluebird');
var rp          = require('request-promise');
var platforms   = ['ps4', 'ps3', 'psvita'];
var tasks        = [];
var urls = [];

//function acqq() {


rp.get({
    url: "http://www.newsmth.net/nForum/board/OurEstate?ajax",
    method: 'GET',
    encoding: null,
    headers: {
        ContentType: 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version'
    }
}).then(function(result) {
    result = iconv.decode(result, "GB2312");
    $            = cheerio.load(result);
    $("tbody").find("tr").each(function (i, elem){
       log($(this).find('td').eq(1).text(),$(this).find('td').find('a').attr('href'));
    });
});
//}
//
//module.exports=acqq;