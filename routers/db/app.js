function addressXY(table, num, database, resDate) {
    var _ = require('underscore'),
        fs = require("fs"),
        mysql = require('mysql'),
        dataConfig = {
            host: 'localhost',
            port: '8989',
            //host     : '10.161.168.138',
            //port     : '3306',
            user: 'developer',
            password: 'gdas.developer',
            database: database || 'operate_space',
            waitForConnections: true
        },
        //table = "dim_env",  //转换地址表
        table = table || "address_to_xy_copy", //c_x,c_y必须为null
        connection,
        filePath = "result.txt",
        http = require('http'),
        start = 0,
        amount = 100,
        num = num || 0,     
        currentLength, is302, akIndex = 0,
        akList = ['w2jj1ik0RhVs1d5AHbOQzafvUaq0axd5', 'eznhFjP1UwdytWCvRlUozrr1L8t9qxfd', 'INqNWCQRj4DedVFzGoT58MIu', 'Hxy0IfBb8rwtkrVmg4mnoo8kmtxcyiFQ', 'Vz8tRKQRAdilOHjg9oxWrSc6DIIr9bMd', 'ZGlTTVKgUvS6OfLXSDKsjDGjtNUo3vp8', 'vi1ebWt0vGKG3OPo6x78YM5akeO8UKM8', 'H507T7reF1YuTjIr9v1An5NUovyRq7UF', '3shdTOBSIUXUmEU88ASY8tsMM5UWXyUX', 'WWKDRG9FK3Ntkpy5wlSnpAAIzr1H1HU5'];
    getDBData(start, amount);

    function getDBData(_count, _amount) {
        connection = mysql.createConnection(dataConfig);
        connection.query(`SELECT distinct address FROM ${database}.${table} where  c_x is null LIMIT ?,?;`, [_count, _amount], function(err, result) {
            if (err) {
                resDate.code = 1;
                resDate.message = '数据库连接错误，请核实对应参数是否正确';
                console.log(err)
                return
            }
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
            var url = `http://api.map.baidu.com/geocoder/v2/?address=${encodeURIComponent(user.address)}&city=${encodeURIComponent('全国')}&output=json&ak=${akList[akIndex]}`;
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
                                var lat = !!axis.result && !!axis.result.location ? axis.result.location.lat : "未知坐标";
                                var lng = !!axis.result && !!axis.result.location ? axis.result.location.lng : "未知坐标";

                                //if(!axis.message) {
                                //resultList.push([user.tel, user.name,user.address,user.road,user.num,lat, lng]);
                                var conn = mysql.createConnection(dataConfig)
                                conn.query(`UPDATE ${database}.${table} SET c_x = '${lat}', c_y = '${lng}' where address = '${user.address}';`, function(err, result) {
                                        if (err) {
                                            resDate.code = 2;
                                            resDate.message = '服务器内部错误';
                                            console.log("id: " + user.id + " error.")
                                            return
                                        }
                                        console.log("address: " + user.address + " success.");
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
                            console.log(err)
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
        // timer = setInterval(function() {
        //     if( timezone === currentLength) {
        //         clearInterval(timer);
        //         var conn = mysql.createConnection(dataConfig),
        //             sql = "INSERT INTO report_display.ods_tel_address_name_plus (`tel`,`name`,`address`,`road`,`num`,`c_x`,`c_y`) VALUES ",
        //             plus = [];

        //         _.chain(resultList).map(function(v) {
        //             return _.map(v, function(val) {
        //                 return _.isNull(val) || _.isUndefined(val) ? "null" : "'" +val+ "'";
        //             });
        //         }).each(function(val) {
        //             plus.push( "(" + val.join(",") + ")" );
        //         });
        //         conn.query(sql + plus.join(","), function(err, result) {
        //             if(err) {
        //                 console.log("insert error " + err);
        //             }
        //             if(result && result.affectedRows) console.log('insert ' + result.affectedRows + ' rows');
        //             conn.end();
        //             start += 1;
        //             console.log("loop count: " + start);
        //             getDBData(start * amount, amount);
        //         });
        //     }else {
        //         console.log("baidu api is running. timezone: " + timezone);
        //     }
        // }, 500);
    }


}
module.exports = addressXY;