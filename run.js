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

MongoClient.connect("mongodb://localhost:27017/gamepark", function (err, mdb) {
    db = mdb;
});


//测试区


var job = function () {

    //加入新的抓取

    request("https://www.jp.playstation.com/blog/", function (error, response, body) {
        $     = cheerio.load(body);
        var x = 1;
        $(".articleArea").find('.listSub').find('a').each(function (i, elem) {

            if ($(this).text().length > 5 && x <= 30) {
                x++;
                var url             = "https://www.jp.playstation.com" + $(this).attr("href");
                var default_pic_url = "https://www.jp.playstation.com" + $(this).find(".thumb").find("img").attr("src");
                var title           = $(this).find(".text").find("h3").text();
                var abstract        = $(this).find(".text").find("p").text();
                var record            = {
                    'title': title,
                    'abstract': abstract,
                    'pic_url': default_pic_url,
                    'detail_url': url,
                    'type': '国外新闻',
                    'mysort': 0,
                    'source': "PS博客"
                }
                record["update_time"] = dateFormat(true);
                record["timestamp"]   = new Date().getTime();

                db.collection("news").find({'detail_url': url}).toArray(function (err, docs) {
                    if (!err && docs.length < 1) {
                        db.collection("news").insert(record);
                    }
                });
            }
        });
    });


    request("http://www.a9vg.com/news/", function (error, response, body) {
        $                   = cheerio.load(body);
        var x               = 1;
        $("#a_list").find('.cl').each(function (i, elem) {
            if ($(this).find('dd').find('a').text().length > 5 && x <= 30) {
                x++;
                var url = $(this).find('dd').find('h4').find('a').attr("href");
                var abstract = get_usefull_text($(this).find('dd').find('.col-lg-show').text()).substr(0, 80);
                var title    = $(this).find('dd').find('a').text();
                var pic_url  = $(this).find('.img-box').find('img').attr('src');
                if (abstract.indexOf("$") == -1 && abstract.indexOf("http") == -1 && abstract.indexOf("下载") == -1) {
                    var record            = {
                        'title': title,
                        'abstract': abstract,
                        'pic_url': pic_url,
                        'detail_url': url,
                        'type': '抓取新闻',
                        'mysort': 0,
                        'source': "A9VG"
                    };
                    record["update_time"] = dateFormat(true);
                    record["timestamp"]   = new Date().getTime();
                    db.collection("news").find({'detail_url': url}).toArray(function (err, docs) {
                        if (!err && docs.length < 1) {
                            db.collection("news").insert(record);
                        }
                    });

                }
            }
        });


    });

    request("http://ps4.tgbus.com/news/", {"encoding": null}, function (error, response, body) {
        body                = iconv.decode(body, "GB2312");
        $     = cheerio.load(body);
        var x = 1;
        $("#body").find('dl').each(function (i, elem) {

            if ($(this).find('dd').find('.atitle').text().length > 5 && x <= 30) {
                x++;
                var url = $(this).find('dd').find('.atitle').eq(0).attr("href");
                var abstract = get_usefull_text($(this).find('dd').find('.intro').text()).substr(0, 80);
                var title    = $(this).find('dd').find('.atitle').text();
                var pic_url  = $(this).find('img').attr('src');
                if (abstract.indexOf("$") == -1 && abstract.indexOf("http") == -1 && abstract.indexOf("下载") == -1) {
                    var record            = {
                        'title': title,
                        'abstract': abstract,
                        'pic_url': pic_url,
                        'detail_url': url,
                        'type': '抓取新闻',
                        'mysort': 0,
                        'source': "TGBUS"
                    };
                        record["update_time"] = dateFormat(true);
                        record["timestamp"]   = new Date().getTime();
                        db.collection("news").find({'detail_url': url}).toArray(function (err, docs) {
                            if (!err && docs.length < 1) {
                                db.collection("news").insert(record);
                            }
                        });

                    }

            }
        });
    });


}


var rule    = new schedule.RecurrenceRule();
rule.minute = [5, 35];
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


function get_usefull_text(str) {

    str = str.replace(/本帖最后.*?编辑/m, "");
    str = str.replace(/201.*?上传$/m, "");
    str = str.replace(/下载附件.*?\)$/m, "");
    str = str.replace(/\$.*?;$/m, "");
    str = str.replace(/http:.*?$/m, "");

    return str;

}
