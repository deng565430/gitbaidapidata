const express = require('express');
var unload = require('./db/getbaiduapidata')
var addressXY = require('./db/app')
let router = express.Router();

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
    if (table == '' || num == '' || database == '' ) {
        res.send({
            msg: '请输入完整数据',
            code: 0
        })
        return;
    }
    unload(table, num, database)
    res.send({
        msg: '正在转换',
        code: 0
    })
});

//地址转坐标
router.get('/list/address', (req, res, next) => {
    var table = req.query.table;
    var num = req.query.num;
    var database = req.query.database;
    //var port = req.query.port;
    if (table == '' || num == '' || database == '' ) {
        res.send({
            msg: '请输入完整数据',
            code: 0
        })
        return;
    }
    addressXY(table, num, database, port)
    res.send({
        msg: '正在转换',
        code: 0
    })

});



module.exports = router;