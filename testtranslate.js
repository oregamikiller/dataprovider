/**
 * Created by oregami on 16/2/17.
 */
var baidu_api = require('./translate');

baidu_api.translate('zh', 'en', '你好 世界', function(err, result){
    console.log(err, result);
});

baidu_api.translate('en', 'zh', 'Hello world', function(err, result){
    console.log(err, result);
});