 var request = require('request'),
     fs = require('fs');

 var ak = 'Uszxk0qk4kpamOedprWEuNDG90IRHh7C';
 var reqUrl = `http://api.map.baidu.com/?qt=s&c=%E4%B8%8A%E6%B5%B7&wd=%E4%BF%B1%E4%B9%90%E9%83%A8&rn=100&pn=0&ie=utf-8&oue=33&fromproduct=jsapi&ak=Uszxk0qk4kpamOedprWEuNDG90IRHh7C`;


 request({
     uri: reqUrl
 }, function(err, response, body) {

     if (!err && response.statusCode == 200) {
        

     }
 });