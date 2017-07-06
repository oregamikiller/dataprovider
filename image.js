/**
 * Created by oregami on 17/7/3.
 */
var fs    = require('fs'),
    rp    = require('request-promise'),
    request = require('request');

var ImageStore = {
    save: function(filename) {
        var uploadUrl = 'http://mp.toutiao.com/tools/kuaima_upload_picture/?client_key=704446e949e06edf&access_token=4f04075c7c539fd5061c146aa20a79ca0011',
            formData = {
                upfile: fs.createReadStream(filename)
            };

        return rp.post({url: uploadUrl, formData: formData}).then(function (body) {
            var picLargeUrl = JSON.parse(body).url,
                picOriginUrl = picLargeUrl.replace('large', 'origin');
            return Promise.resolve(picOriginUrl);
        }, function (e) {
            console.error(e);
            return Promise.reject(e);
        });
    },

    download: function (uri, filename){
        return new Promise(function (resolve, reject) {
            request.head(uri, function(err, res, body){
                request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
            });
        });
    },


    convert: function(uri) {
        var filename = tempFileName(uri);
        return ImageStore.download(uri, filename).then(function() {
            return ImageStore.save(filename);
        });

    }

}


var tempFileName = function(uri) {
    return 'tempimage/' + uri.replace("http://photo.psnine.com/psngame/","");
}



//var a =ImageStore.convert("http://trophy01.np.community.playstation.net/trophy/np/NPWR10889_00_0088C62D7213D9C1DA0FBBBF5E68CCE4FBAD9111C3/0890ACF54F44EA619E5B538072FA3BDB45FD5124.PNG");
//
//a.then(console.log);

module.exports = ImageStore;