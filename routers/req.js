 var request = require('request'),
     fs = require('fs');

var ak = 'Uszxk0qk4kpamOedprWEuNDG90IRHh7C';
 var reqUrl = `http://api.map.baidu.com/?qt=s&c=289&wd=%E5%A4%9C%E6%80%BB%E4%BC%9A&rn=100&ie=utf-8&oue=33&fromproduct=jsapi&res=api&callback=BMap._rd._cbk6140`;


 request({
     uri: reqUrl
 }, function(err, response, body) {
    
    var filePath = __dirname + '/data/data.js';

     if (fs.exists(filePath)) {
         fs.unlinkSync(filePath);

         console.log('Del file ' + filePath);
     }

     fs.writeFile(filePath, body, 'utf8', function(err) {
         if (err) {
             throw err;
         }

         console.log('Save ' + filePath + ' ok~');
     });

     console.log('Fetch ' + reqUrl + ' ok~');
 });