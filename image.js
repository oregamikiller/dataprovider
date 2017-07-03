/**
 * Created by oregami on 17/7/3.
 */
var fs    = require('fs'),
    rp    = require('request-promise'),
    request = require('request');

var ImageStore = {
    save: function(filename) {
        var uploadUrl = 'http://mp.toutiao.com/tools/kuaima_upload_picture/?client_key=704446e949e06edf&access_token=9735c9c6124308069c2709e6193f5f560009',
            formData = {
                upfile: fs.createReadStream(filename)
            };

        return rp.post({url: uploadUrl, formData: formData}).then(function (body) {
            console.log(body);
            var picLargeUrl = JSON.parse(body).url,
                picOriginUrl = picLargeUrl.replace('large', 'origin');
            console.log(picOriginUrl);
            return picOriginUrl;
        }, function (e) {
            console.error(e);
            return Promise.reject(e);
        });
    },

    download: function (uri, filename, callback){
        request.head(uri, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    },


    convert: function(uri) {
        var filename = tempFileName();
        ImageStore.download(uri, filename, function(){
            ImageStore.save(filename);
        });

    }

}


var tempFileName = function() {
    return 'tempimage/' + new Date().getTime();
}



var a =ImageStore.convert("http://trophy01.np.community.playstation.net/trophy/np/NPWR10889_00_0088C62D7213D9C1DA0FBBBF5E68CCE4FBAD9111C3/0890ACF54F44EA619E5B538072FA3BDB45FD5124.PNG");

console.log(a);

module.exports = ImageStore;