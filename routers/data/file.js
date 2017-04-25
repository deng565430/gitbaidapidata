var mysql = require('mysql');
var fs = require('fs');
var path = require('path');
var request = require('request');
var http = require('http');

let create = '';
let insert = 'insert into t_building_info_address_dist set ?';
let del = '';
let select = 'select * from t_building_info_address where id>0 and id<=1000';

function inMsql() {
    var pool = mysql.createPool({
        host: 'localhost',
        user: 'developer',
        password: 'gdas.developer',
        database: 'operate_space',
        port: '8989'
    });

    var data = [];

    //查询

    this.promise = new Promise(function (resove, reject) {
        pool.getConnection(function (err, connection, flag) {
            if (err) {
                console.log('与mysql数据库建立连接失败');
                flag = false;
            } else {
                console.log('与mysql数据库建立连接成功');
                connection.query(select, function (err, rows) {
                    if (err) {
                        console.log('查询数据失败');
                        flag = false;
                    } else {
                        // console.log(rows);
                        // callback(rows)
                        data = rows;
                        resove(data)
                        pool.end();
                    }
                })
            }
        })

    })
}

inMsql()
promise.then(function (val) {
    back(val)
})


var getInitUrlList = function () {
    request.get("http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=%E5%B9%B3%E5%87%89%E8%B7%AF1157%E5%BC%8416-24%E5%8F%B7&c=289&src=0&wd2=&sug=0&l=18&b=(13505462.82,3629074.355;13506984.82,3629364.355)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520481,3645381&ie=utf-8&t=1492746383421")
        .end(function (err, res) {
            if (err) {
                console.log(err);
            } else {
              console.log(res)
            }
        });
}



var info = function (rows) {
    var datas = [];
    rows.forEach(function (v, i) {
        //http://api.map.baidu.com/?qt=s&c=289&wd=%E6%96%B0%E6%A1%A5%E9%95%87%E6%96%B0%E9%95%87%E8%A1%971058%E5%BC%84&rn=1000&ie=utf-8&oue=1&fromproduct=jsapi&res=api&callback=BMap._rd._cbk15662
        //http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=%E8%88%AA%E4%BA%AD%E7%8E%AF%E8%B7%AF399%E5%BC%84&c=224&src=0&wd2=&sug=0&l=11&b=(13405997.36,3686124.7;13600813.36,3729516.7)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520455,3645382&ie=utf-8&t=1492596367911
        //http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=%E4%B8%B4%E5%B9%B3%E8%BF%90%E6%BA%AA%E8%B7%AF%E4%B8%8E%E4%BA%94%E6%B4%B2%E8%B7%AF%E5%8F%A3&c=179&src=0&wd2=&sug=0&l=12&b=(13340516.03,3507009.39;13437924.03,3528705.39)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520455,3645382&ie=utf-8&t=1492599831471

        var obj = {}
        if (v.city == '上海') {
            var wd = `${encodeURI(v.address)}`;
            var reqUrl = `http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=${wd}&c=289&src=0&wd2=&sug=0&l=12&b=(13538940.835,3629723.795;13539701.835,3629868.795)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520455,3645382&ie=utf-8&t=1492746112474`;
            //http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=${wd}&c=289&src=0&wd2=&sug=0&l=19&b=(13524072.04,3640240.46;13524833.04,3640385.46)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520481,3645381&ie=utf-8&t=1492751027845
            //http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=${wd}&c=289&src=0&wd2=&sug=0&l=18&b=(13505462.82,3629074.355;13506984.82,3629364.355)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520481,3645381&ie=utf-8&t=1492746383421
            // http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=${wd}&c=289&src=0&wd2=&sug=0&l=19&b=(13538940.835,3629723.795;13539701.835,3629868.795)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520481,3645381&ie=utf-8&t=1492746112474
        } else if (v.city == '杭州') {
            var wd = `${encodeURI(v.address)}`;
            var reqUrl = `http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=${wd}&src=0&wd2=&sug=0&l=12&b=(13340516.03,3507009.39;13437924.03,3528705.39)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520455,3645382&ie=utf-8&t=1492599831471`;
        }


        new Promise((resove, reject) => {
            request({
                url: reqUrl
            }, function (err, response, body) {


                if (!err && response.statusCode == 200) {
                    /*  var sta = body.indexOf('content');

                     var end = body.indexOf('current_city');
                     if(sta == -1){
                     var da = body.substring(0,end-2);
                     } else{
                     var da = body.substring(sta+9,end-2);
                     }
                     console.log(da)*/

                    //console.log(da)

                    var sta = body.indexOf('content');
                    var end = body.indexOf('current_city');
                    if (sta != -1) {
                        var da = body.substring(sta + 9, end - 2);
                        var sta1 = da.indexOf('{');
                        var end = da.indexOf('}');
                        if (sta1 != -1) {
                            var list = da.substring(sta1, end + 1);
                            var sta2 = da.indexOf('area_name');
                            if (sta2 != -1) {
                                var d = list.split(':')
                                var addr = d[2].split(',')[0];
                                var area = list.split('area_name');
                                var areaname = (area[1].split(':')[1]).split(',')[0];
                                addr = unescape(addr.replace(/\\u/g, '%u')) //转码
                                areaname = unescape(areaname.replace(/\\u/g, '%u')) //转码
                                if (areaname && areaname.split('市')[1] != '' || areaname.split('市')[1] != null || areaname.split('市')[1] != undefined) {
                                    obj.city = v.city
                                    if (areaname.split('市')[1] != null || areaname.split('市')[1] != undefined) {
                                        obj.dist = areaname.split('市')[1].split('"')[0];
                                    }

                                    // console.log(addr.split('"'))
                                    obj.address = v.address
                                    resove(obj)
                                }

                            }

                        }

                    }


                }
                //   console.log(datas[i])
            })

        }).then(function (res) {
            // console.log(res)
            /*  datas.push(res)
             setTimeout(function () {
             console.dir(datas)
             },2000)*/
            setTimeout(function () {
                sql(res)

            }, 200)
        })
    })
}
/*var url = 'http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=%E5%B9%B3%E5%87%89%E8%B7%AF1157%E5%BC%8416-24%E5%8F%B7&c=289&src=0&wd2=&sug=0&l=18&b=(13505462.82,3629074.355;13506984.82,3629364.355)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520481,3645381&ie=utf-8&t=1492746383421'

 function httpGet(reqUrl) {
 var html;
 http.get(reqUrl,function (res) {

 res.on('data', function(data) {
 html += data;
 });
 res.on('end', function() {
 //数据获取完，执行回调函数
 console.log(html);
 });
 })
 }
 httpGet(url);*/
var back = function (rows) {
    var datas = [];
    rows.forEach(function (v, i) {
        //http://api.map.baidu.com/?qt=s&c=289&wd=%E6%96%B0%E6%A1%A5%E9%95%87%E6%96%B0%E9%95%87%E8%A1%971058%E5%BC%84&rn=1000&ie=utf-8&oue=1&fromproduct=jsapi&res=api&callback=BMap._rd._cbk15662
        //http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=%E8%88%AA%E4%BA%AD%E7%8E%AF%E8%B7%AF399%E5%BC%84&c=224&src=0&wd2=&sug=0&l=11&b=(13405997.36,3686124.7;13600813.36,3729516.7)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520455,3645382&ie=utf-8&t=1492596367911
        //http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=%E4%B8%B4%E5%B9%B3%E8%BF%90%E6%BA%AA%E8%B7%AF%E4%B8%8E%E4%BA%94%E6%B4%B2%E8%B7%AF%E5%8F%A3&c=179&src=0&wd2=&sug=0&l=12&b=(13340516.03,3507009.39;13437924.03,3528705.39)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520455,3645382&ie=utf-8&t=1492599831471

        var obj = {}
        if (v.city == '上海') {
            var wd = `${encodeURI(v.address)}`;
            var reqUrl = `http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=${wd}&c=289&src=0&wd2=&sug=0&l=12&b=(13538940.835,3629723.795;13539701.835,3629868.795)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520455,3645382&ie=utf-8&t=1492746112474`;
            //http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=${wd}&c=289&src=0&wd2=&sug=0&l=19&b=(13524072.04,3640240.46;13524833.04,3640385.46)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520481,3645381&ie=utf-8&t=1492751027845
            //http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=${wd}&c=289&src=0&wd2=&sug=0&l=18&b=(13505462.82,3629074.355;13506984.82,3629364.355)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520481,3645381&ie=utf-8&t=1492746383421
            // http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=${wd}&c=289&src=0&wd2=&sug=0&l=19&b=(13538940.835,3629723.795;13539701.835,3629868.795)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520481,3645381&ie=utf-8&t=1492746112474
        } else if (v.city == '杭州') {
            var wd = `${encodeURI(v.address)}`;
            var reqUrl = `http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=s&da_src=searchBox.button&wd=${wd}&src=0&wd2=&sug=0&l=12&b=(13340516.03,3507009.39;13437924.03,3528705.39)&from=webmap&biz_forward={%22scaler%22:1,%22styles%22:%22pl%22}&sug_forward=&tn=B_NORMAL_MAP&nn=0&u_loc=13520455,3645382&ie=utf-8&t=1492599831471`;
        }


        new Promise((resove, reject) => {
            request({
                url: reqUrl
            }, function (err, response, body) {


                if (!err && response.statusCode == 200) {
                    /*  var sta = body.indexOf('content');

                     var end = body.indexOf('current_city');
                     if(sta == -1){
                     var da = body.substring(0,end-2);
                     } else{
                     var da = body.substring(sta+9,end-2);
                     }
                     console.log(da)*/

                    //console.log(da)

                    var sta = body.indexOf('content');
                    var end = body.indexOf('current_city');
                    if (sta != -1) {
                        var da = body.substring(sta + 9, end - 2);
                        var sta1 = da.indexOf('{');
                        var end = da.indexOf('}');
                        if (sta1 != -1) {
                            var list = da.substring(sta1, end + 1);
                            var sta2 = da.indexOf('area_name');
                            if (sta2 != -1) {
                                var d = list.split(':')
                                var addr = d[2].split(',')[0];
                                var area = list.split('area_name');
                                var areaname = (area[1].split(':')[1]).split(',')[0];
                                addr = unescape(addr.replace(/\\u/g, '%u')) //转码
                                areaname = unescape(areaname.replace(/\\u/g, '%u')) //转码
                                if (areaname && areaname.split('市')[1] != '' || areaname.split('市')[1] != null || areaname.split('市')[1] != undefined) {
                                    obj.city = v.city
                                    if (areaname.split('市')[1] != null || areaname.split('市')[1] != undefined) {
                                        obj.dist = areaname.split('市')[1].split('"')[0];
                                    }

                                    // console.log(addr.split('"'))
                                    obj.address = v.address
                                    resove(obj)
                                }

                            }

                        }

                    }


                }
                //   console.log(datas[i])
            })

        }).then(function (res) {
            // console.log(res)
            /*  datas.push(res)
             setTimeout(function () {
             console.dir(datas)
             },2000)*/
            setTimeout(function () {
                sql(res)

            }, 200)
        })

    })
}
//sql({city:'上海',dist:'黄浦区',address:'测试数据'});

function sql(obj) {
    var pool = mysql.createPool({
        host: 'localhost',
        user: 'developer',
        password: 'gdas.developer',
        database: 'operate_space',
        port: '8989'
    });


    //存表
    //console.log(data)
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            return
        } else {
            connection.query(insert, obj, (err, res) => {
                if (err) {
                    console.log(err)
                    return
                } else {
                    console.log('插入成功');
                    //console.log('insert id: ' + res.insertId);
                }
            });
        }
        pool.end();
    })

}

//module.exports = inMsql;