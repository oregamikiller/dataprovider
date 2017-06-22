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


MongoClient.connect("mongodb://localhost:27017/userservice", function (err, mdb) {
    db = mdb;
    db.collection("tasks").find({}).toArray(function (err, docs) {
        if (!err && docs.length > 0) {
            console.dir(docs);
            if (docs[0] && docs[0].id == "test") {
                task_func = require("./acqq.js");
                console.dir(task_func)
                task_func.call(null,docs[0].param);
            }
        }
    });
});

