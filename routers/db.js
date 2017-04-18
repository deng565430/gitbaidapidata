var mysql = require('mysql');

let create = '';
let insert = 'insert into baidu_api_data set ?';
let del = '';
let select = 'select * from baidu_api_data';

function inMsql(list, flag) {
    var pool = mysql.createPool({
        host: 'localhost',
        user: 'developer',
        password: 'gdas.developer',
        database: 'operate_space',
        port: '8989'
    });


    //存表
    //console.log(data)
    pool.getConnection(function(err, connection) {
        if (err) {
            //console.log(err);
            flag = false;
            return
        } else {
            //console.log(pool._allConnections.length); //1 

            connection.query(insert, list, (err, res) => {
                if (err) {
                    //console.log(error.message);
                    flag = false;
                    return
                } else {
                    //console.log('插入成功');
                    //console.log('insert id: ' + res.insertId);
                }
            });

        }
        pool.end();
    })
    flag = true;
}

module.exports = inMsql;