const express = require('express');
var unload = require('./db/getbaiduapidata')
var addressXY = require('./db/app')
let router = express.Router();


let resDate;


router.use((req, res, next) => {

    //res.cache(0) //
    //res.cache(7*24*3600)//
    resDate = {
        code: 0,
        message: null
    };
    next();
})



router.get('/', (req, res, next) => {
    console.log(req.userInfo)
    res.render('main/index', {
        userInfo: req.userInfo
    });
});
router.get('/data', (req, res, next) => {
    console.log(req.userInfo)
    res.render('main/test', {
        userInfo: req.userInfo
    });
});


//地址转区域
router.get('/list/data', (req, res, next) => {
    var table = req.query.table;
    var num = req.query.num;
    var database = req.query.database;
    // var port = req.query.port;
    if (table == '' || num == '' || database == '') {
        resDate.code = 1;
        resDate.message = '请输入完整数据';
        res.send(resDate)
        return;
    }
    unload(table, num, database, resDate)
    setTimeout(function() {
        resDate.code = 0;
        resDate.message = '正在转换。。。';
        res.send(resDate)
    }, 500)
});

//地址转坐标
router.get('/list/address', (req, res, next) => {
    var table = req.query.table;
    var num = req.query.num;
    var database = req.query.database;
    //var port = req.query.port;
    if (table == '' || num == '' || database == '') {
        resDate.code = 1;
        resDate.message = '请输入完整数据';
        res.send(resDate)
        return;
    }
    addressXY(table, num, database, resDate)
    setTimeout(function() {
        resDate.code = 0;
        resDate.message = '正在转换。。。';
        res.send(resDate)
    }, 500)

});



module.exports = router;