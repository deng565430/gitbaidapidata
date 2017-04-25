function unload(table, num, database, port) {
    var _ = require('underscore'),
        fs = require("fs"),
        mysql = require('mysql'),
        dataConfig = {
            host: 'localhost',
            port: port ||'8989',
            user: 'developer',
            password: 'gdas.developer',
            database: database || 'sales_service', //更改你需要的数据库名
            waitForConnections: true
        },
        //table = "dim_env",  //转换地址表
        table = table || "adderss_ext_district_copy", //dist必须为null  //更改你需要的表名
        connection,
        filePath = "result.txt",
        http = require('http'),
        start = 0,
        amount = 100,
        currentLength, is302, akIndex = 0,
        num = num || 0,
        akList = ['w2jj1ik0RhVs1d5AHbOQzafvUaq0axd5', 'eznhFjP1UwdytWCvRlUozrr1L8t9qxfd', 'INqNWCQRj4DedVFzGoT58MIu', 'Hxy0IfBb8rwtkrVmg4mnoo8kmtxcyiFQ', 'Vz8tRKQRAdilOHjg9oxWrSc6DIIr9bMd', 'ZGlTTVKgUvS6OfLXSDKsjDGjtNUo3vp8', 'vi1ebWt0vGKG3OPo6x78YM5akeO8UKM8', 'H507T7reF1YuTjIr9v1An5NUovyRq7UF', '3shdTOBSIUXUmEU88ASY8tsMM5UWXyUX', 'WWKDRG9FK3Ntkpy5wlSnpAAIzr1H1HU5'];
    getDBData(start, amount);

    function getDBData(_count, _amount) {
        connection = mysql.createConnection(dataConfig);
        connection.query("SELECT * FROM sales_service." + table + " where dist is null and id>="+ num +" LIMIT ?,?;", [_count, _amount], function(err, result) {
            if (err) throw err;
            //console.log(start * amount);
            if (!!result && !!result.length) {
                currentLength = result.length;
                getBaiduAxis(result);
                //getBaiduAxis(result);
            }
            connection.end();
        });
    }

    function getBaiduAxis(userList) {
        var user = _.first(userList),
            resultList = [],
            timezone = 0,
            timer, changeAk = false;
        //Hxy0IfBb8rwtkrVmg4mnoo8kmtxcyiFQ

        //, 'DRg1T6xs1oEnXTmjHFDNcMc7', 'dT9Cyku0GNdvnKj2XWG6eTEg','GAW5txDkS7GGgManH7Z3q2Lj'
        //    if(!!user) {
        _.each(userList, function(user, key, list) {
            console.log(user.id)
            var url = `http://api.map.baidu.com/place/v2/suggestion?query=${encodeURIComponent(user.address)}&region=${encodeURIComponent(user.city)}&city_limit=true&output=json&ak=${akList[akIndex]}`;
            // akIndex++;
            // akIndex > 1 ? akIndex=0 : akIndex;
            //console.log(url)
            http.get(url, function(res) {
                    var body = "";
                    res.on('end', function() {
                        timezone += 1;
                        var result = new Buffer(body, 'utf-8').toString();
                        try {

                            var axis = JSON.parse(result);
                            console.log("now ak is ", akIndex, " ak is ", akList[akIndex])
                            if (axis.status == 302 && !changeAk) {
                                akIndex++;
                                changeAk = true;
                            } else {
                                if (changeAk) return;
                                //var lat = !!axis.result&&!!axis.result.location ? ~~(parseFloat(axis.result.location.lat) * 1000) / 1000 : "未知坐标";
                                //var lng = !!axis.result&&!!axis.result.location ? ~~(parseFloat(axis.result.location.lng) * 1000) / 1000 : "未知坐标";
                                // var lat = !!axis.result&&!!axis.result.location ? axis.result.location.lat : "未知坐标";
                                //var lng = !!axis.result&&!!axis.result.location ? axis.result.location.lng : "未知坐标";
                                var dist = !!axis.result && !!axis.result.length > 0 ? axis.result[0].district : "";
                                //console.log(axis.result[0].district)
                                //if(!axis.message) {
                                //resultList.push([user.tel, user.name,user.address,user.road,user.num,lat, lng]);
                                var conn = mysql.createConnection(dataConfig)
                                conn.query("UPDATE sales_service." + table + " SET dist = '" + dist + "'where id =" + user.id + ";", function(err, result) {
                                        if (err) console.log("id: " + user.id + " error.")
                                        console.log("id: " + user.id + " success.");
                                        conn.end();
                                    })
                                    //}else {
                                    //    console.log('error address rows tel: ' + user.tel);
                                    //getBaiduAxis(_.rest(userList));
                                    //} 
                            }

                        } catch (e) {
                            console.log(e);
                        }
                    });

                    res.on('data', function(chunk) {
                        body += chunk;
                    });
                })
                .on('error', function(err) {
                    timezone += 1;
                    console.log("Got error: " + err.message);
                });
        });
        timer = setInterval(function() {
            if (akList.length <= akIndex) {
                clearInterval(timer);
            } else if (timezone === currentLength) {
                clearInterval(timer);
                start += 1;
                console.log("loop count: " + start);
                getDBData(start, amount);
            } else {
                //console.log("baidu api is running. timezone: " + timezone);
            }
        }, 100);

    }

}


module.exports = unload;