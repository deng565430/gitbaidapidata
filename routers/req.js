 var request = require('request'),
     fs = require('fs');

 var ak = 'Uszxk0qk4kpamOedprWEuNDG90IRHh7C';
 var reqUrl = `http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=30.33773186182905,120.3857392605737&output=json&pois=1&ak=w2jj1ik0RhVs1d5AHbOQzafvUaq0axd5`;


 request({
     uri: reqUrl
 }, function(err, response, body) {
     //console.log(response.statusCode);
     //console.log(response);

     console.log(body)
     var body = JSON.parse(body.substring(29,body.length-1))
     console.log(body)


     //如果数据量比较大，就需要对返回的数据根据日期、酒店ID进行存储，如果获取数据进行对比的时候直接读文件
   /*  var filePath = __dirname + '/data/data.json';

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

     console.log('Fetch ' + reqUrl + ' ok~');*/
 });