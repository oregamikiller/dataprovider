/**
 * Created by oregami on 16/2/3.
 */
var log         = console.log
var schedule    = require('node-schedule');
var MongoClient = require('mongodb').MongoClient;
var db          = null;
var cheerio     = require('cheerio');
var request     = require('request');
var iconv       = require('iconv-lite');
var path        = require('path');
var fs          = require('fs');

request("http://d7vg.com/psngame?ob=newest&pf=ps4&dlc=all", {"encoding": null}, function (error, response, body) {
    body                = iconv.decode(body, "utf-8");
    $     = cheerio.load(body);
    console.log(body);
    var x = 1;
    var trophyList = [];
    $(".list").find('tr').each(function (i, elem) {
            x++;
            var url = $(this).find('td').eq(1).find('p').find('a').attr("href");
            var title    = $(this).find('td').eq(1).find('p').find('a').text();
            var picUrl = $(this).find('td').eq(0).find('a').find('img').attr('src');
            if (url) {
                console.log('"'+title+'|'+url+'|' + picUrl+'",');
                trophyList.push({index:0, title:title,url:url, picUrl: picUrl});
            request(url, {"encoding": null}, function (error, response, body) {
                body                = iconv.decode(body, "utf-8");
                $     = cheerio.load(body);
                $(".list").find('tr').each(function (i, elem) {
                    var index = $(this).find('td').eq(1).find('.h-p').text().substr(1);
                    var title    = $(this).find('td').eq(1).find('p').find('a').text();
                    var url    = $(this).find('td').eq(1).find('p').find('a').attr('href');
                    var picUrl    = $(this).find('td').eq(0).find('a').find('img').attr('src');
                    var desc  = $(this).find('td').eq(1).find('+em');
                    if (desc.length>1) {
                        desc = desc.eq(1).text();
                    } else {
                        desc = desc.eq(0).text();
                    }
                    if (url) {
                        console.log('"'+ index+'|'+title+'|'+ url+'|'+desc+'|'+ picUrl+'",');
                    }
                });
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

