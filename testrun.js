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

    //request("http://d7vg.com/psngame/7028", {"encoding": null}, function (error, response, body) {
    //    body                = iconv.decode(body, "utf-8");
    //    $     = cheerio.load(body);
    //    var x = 1;
    //    $(".list").find('td').each(function (i, elem) {
    //        if (true) {
    //            x++;
    //            var url = $(this).find('.h-p').text().substr(1);
    //            var abstract = get_usefull_text($(this).find('dd').find('.intro').text()).substr(0, 80);
    //            var title    = $(this).find('p').find('a').text();
    //            var pic_url  = $(this).find('+em').eq(1).text();
    //
    //            if (url) {
    //                console.log('"'+ url+'|'+title+'|'+pic_url+'",');
    //            }
    //            //if (abstract.indexOf("$") == -1 && abstract.indexOf("http") == -1 && abstract.indexOf("下载") == -1) {
    //            //        var record            = {
    //            //            'title': title,
    //            //            'abstract': abstract,
    //            //            'pic_url': pic_url,
    //            //            'detail_url': url,
    //            //            'type': '抓取新闻',
    //            //            'mysort': 0,
    //            //            'source': "TGBUS"
    //            //        }
    //            //        log(record);
    //            //        record["update_time"] = dateFormat(true);
    //            //        record["timestamp"]   = new Date().getTime();
    //
    //                //}
    //
    //        }
    //    });
    //});


request("http://d7vg.com/node/news?title=%E7%A5%9E%E7%A7%98%E6%B5%B7%E5%9F%9F4", {"encoding": null}, function (error, response, body) {
    body                = iconv.decode(body, "utf-8");
    $     = cheerio.load(body);
    var x = 1;
    $(".list").find('li').each(function (i, elem) {
        if (true) {
            x++;
            var url = $(this).find('.title').find('a').attr("href");
            var title    = $(this).find('.title').find('a').text();
            var pic_url  = $(this).find('+em').eq(1).text();

            if (url) {
                console.log('"'+title+'|'+url+'",');
            }
            //if (abstract.indexOf("$") == -1 && abstract.indexOf("http") == -1 && abstract.indexOf("下载") == -1) {
            //        var record            = {
            //            'title': title,
            //            'abstract': abstract,
            //            'pic_url': pic_url,
            //            'detail_url': url,
            //            'type': '抓取新闻',
            //            'mysort': 0,
            //            'source': "TGBUS"
            //        }
            //        log(record);
            //        record["update_time"] = dateFormat(true);
            //        record["timestamp"]   = new Date().getTime();

                //}

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


function get_usefull_text(str) {

    str = str.replace(/本帖最后.*?编辑/m, "");
    str = str.replace(/201.*?上传$/m, "");
    str = str.replace(/下载附件.*?\)$/m, "");
    str = str.replace(/\$.*?;$/m, "");
    str = str.replace(/http:.*?$/m, "");

    return str;

}
