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
var tasks        = [];
var tasks0       = [];
var gamelist     = [];
var urls = [];
var page = process.argv[2];
var imagecovert = require('./image').convert;


    MongoClient.connect("mongodb://localhost:27017/gamepark", function (err, mdb) {
        db = mdb;
        var step =0;
        db.collection('gameTrophy').find({'deep':1}).sort({'timestamp': -1}).skip(2000).limit(50).toArray(function(err, docs) {
            docs.forEach(function(item) {
                imagecovert(item.picUrl.replace("photo.d7vg.com", "photo.psnine.com").replace("@91w.png", "").replace("@100w.png", "")).then(function(newurl) {
                    db.collection('gameTrophy').update({'_id': item._id}, {$set: {cdnPic: newurl}});
                    console.log(step++);

                });
            });
        });
        setTimeout(function() {
            console.log("done")
        }, 5 * 60 * 1000)
    });
