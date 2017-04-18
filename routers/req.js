 var request = require('request'),
     fs = require('fs');

 var ak = 'Uszxk0qk4kpamOedprWEuNDG90IRHh7C';
 var reqUrl = `http://api.map.baidu.com/?qt=s&c=%E4%B8%8A%E6%B5%B7&wd=%E4%BF%B1%E4%B9%90%E9%83%A8&rn=100&pn=0&ie=utf-8&oue=33&fromproduct=jsapi&ak=Uszxk0qk4kpamOedprWEuNDG90IRHh7C`;


 request({
     uri: reqUrl
 }, function(err, response, body) {
     //console.log(response.statusCode);
     //console.log(response);

     //如果数据量比较大，就需要对返回的数据根据日期、酒店ID进行存储，如果获取数据进行对比的时候直接读文件
     var filePath = __dirname + '/data/data.json';

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