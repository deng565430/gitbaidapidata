function unload(table, num, database, resDate) {
    var _ = require('underscore'),
        fs = require("fs"),
        mysql = require('mysql'),
        dataConfig = {
            host: 'localhost',
            port: '8989',
            user: 'developer',
            password: 'gdas.developer',
            database: database || 'sales_service', //更改你需要的数据库名
            waitForConnections: true
        },
        //table = "dim_env",  //转换地址表
        table = table || "adderss_ext_district", //dist必须为null  //更改你需要的表名
        connection,
        filePath = "result.txt",
        http = require('http'),
        start = 0,
        amount = 100,
        currentLength, is302, akIndex = 0,
        num = num || 0,

        akList = ['w2jj1ik0RhVs1d5AHbOQzafvUaq0axd5', 'eznhFjP1UwdytWCvRlUozrr1L8t9qxfd', 'INqNWCQRj4DedVFzGoT58MIu', 'Hxy0IfBb8rwtkrVmg4mnoo8kmtxcyiFQ', 'Vz8tRKQRAdilOHjg9oxWrSc6DIIr9bMd', 'ZGlTTVKgUvS6OfLXSDKsjDGjtNUo3vp8', 'vi1ebWt0vGKG3OPo6x78YM5akeO8UKM8', 'H507T7reF1YuTjIr9v1An5NUovyRq7UF', '3shdTOBSIUXUmEU88ASY8tsMM5UWXyUX', 'WWKDRG9FK3Ntkpy5wlSnpAAIzr1H1HU5'];
    //console.log(sql)



    getDBData(start, amount);

    function getDBData(_count, _amount) {
        connection = mysql.createConnection(dataConfig);
        connection.query(`SELECT distinct city,address FROM ${database}.${table} where district='' or district is null or district='' LIMIT ?,?;`, [_count, _amount], function(err, result) {
            if (err) {
                resDate.code = 1;
                resDate.message = '数据库连接错误，请核实对应参数是否正确';
                console.log(err)
                return
            };
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
            //console.log(user.id)
            //var url = `http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=${encodeURIComponent(user.address)}&c=179&src=0&wd2=&sug=0&l=19&b=(13368314.64,3523904;13369075.64,3524151)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520456,3645380&ie=utf-8&t=1493174034619`
            //var url = `http://api.map.baidu.com/place/v2/suggestion?query=${encodeURIComponent(user.address)}&region=${encodeURIComponent(user.city)}&city_limit=true&output=json&ak=${akList[akIndex]}`;

            //console.log(url)
            // 1、如果转化不成功 开启后面的坐标转化 前面部分注释 取消url注释
            var url = `http://api.map.baidu.com/geocoder/v2/?address=${encodeURIComponent(user.address)}&city=${encodeURIComponent(user.city)}&output=json&ak=${akList[akIndex]}`;
            console.log(url)

            http.get(url, function(res) {
                    var body = "";
                    res.on('end', function() {
                        timezone += 1;
                        var result = new Buffer(body, 'utf-8').toString();
                        try {

                            var axis = JSON.parse(result);
                            //console.log(axis)
                            console.log("now ak is ", akIndex, " ak is ", akList[akIndex])
                            if (axis.status == 302 && !changeAk) {
                                akIndex++;
                                changeAk = true;
                            } else {
                                if (changeAk) return;
                                // var lat = !!axis.result&&!!axis.result.location ? ~~(parseFloat(axis.result.location.lat) * 1000) / 1000 : "未知坐标";
                                // var lng = !!axis.result&&!!axis.result.location ? ~~(parseFloat(axis.result.location.lng) * 1000) / 1000 : "未知坐标";
                                // var lat = !!axis.result && !!axis.result.location ? axis.result.location.lat : "未知坐标";
                                //var lng = !!axis.result && !!axis.result.location ? axis.result.location.lng : "未知坐标";
                                /* if (axis.result && axis.result.length > 0) {
                                    if (axis.result[0].district != '' || axis.result[0].district != undefined) {
                                        var dist = !!axis.result && !!axis.result.length > 0 ? axis.result[0].district : "";
                                    } else if (axis.result[1].district != '' || axis.result[1].district != undefined) {
                                        var dist = !!axis.result && !!axis.result.length > 0 ? axis.result[1].district : "";
                                    } else if (axis.result[2].district != '' || axis.result[2].district != undefined) {
                                        var dist = !!axis.result && !!axis.result.length > 0 ? axis.result[2].district : "";
                                    } else {
                                        var dist = "";
                                    }
                                }

                                if(dist == undefined) {
                                    dist = ''
                                }
                                var conn = mysql.createConnection(dataConfig)

                                conn.query(`UPDATE ${database}.${table} SET district  = '${dist}' where address = '${user.address}';`, function(err, result) {
                                        if (err) throw err //console.log("id: " + user.id + " error.")
                                            //console.log("id: " + user.id + " success.");
                                        conn.end();
                                    })
                                    //}else {
                                    //    console.log('error address rows tel: ' + user.tel);
                                    //getBaiduAxis(_.rest(userList));
                                    //} 

*/

                                //2、如果转化不成功 开启后面的坐标转化 前面部分注释

                                var lat = !!axis.result && !!axis.result.location ? axis.result.location.lat : "未知坐标";
                                var lng = !!axis.result && !!axis.result.location ? axis.result.location.lng : "未知坐标";
                                if (lat != '未知坐标' || lng != '未知坐标') {
                                    //实现坐标转区域
                                    var distUrl = `http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=${lat},${lng}&output=json&pois=1&ak=${akList[akIndex]}`;
                                    http.get(distUrl, function(res) {
                                        var html = "";
                                        res.on('end', function() {
                                            var result2 = new Buffer(html, 'utf-8').toString();
                                            try {
                                                var axiss = JSON.parse(html.substring(29, html.length - 1));
                                                if (axiss.status == 302 && !changeAK) {
                                                    akIndex++;
                                                    changeAk = true;
                                                } else {
                                                    if (changeAk) return;
                                                    var dist = !!axiss.result && !!axiss.result.addressComponent && axiss.result.addressComponent.district ? axiss.result.addressComponent.district : '';
                                                    //console.log(dist)

                                                    var conn = mysql.createConnection(dataConfig)

                                                    conn.query(`UPDATE ${database}.${table} SET district  = '${dist}' where address = '${user.address}';`, function(err, result) {
                                                            if (err) {
                                                                resDate.code = 2;
                                                                resDate.message = '服务器内部错误';
                                                                return
                                                            } //console.log("id: " + user.id + " error.")
                                                            //console.log("id: " + user.id + " success.");
                                                            conn.end();
                                                        })
                                                        //}else {
                                                        //    console.log('error address rows tel: ' + user.tel);
                                                        //getBaiduAxis(_.rest(userList));
                                                        //} 
                                                }
                                            } catch (e) {
                                                resDate.code = 2;
                                                resDate.message = '服务器内部错误';
                                                return
                                            }
                                        })
                                        res.on('data', function(chunk) {
                                            html += chunk;
                                        });
                                    })

                                }



                            }

                        } catch (e) {
                            resDate.code = 2;
                            resDate.message = '服务器内部错误';
                            return
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