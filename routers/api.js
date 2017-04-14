const express = require('express');
const request = require('request');
var cache = require('memory-cache');
var router = express.Router();
var inMsql = require('./db');



function fetch(url, callback) {
	request.head({
		url: url,
		timeout: 10000,
		tunnel: true,
		gzip: true,
		proxy: false,
		followRedirect: false,
		headers: {
			'User-Agent': 'request'
		}
	}, callback);
}
let now = Date.now();



//统一返回格式
let responseDate;


router.use((req, res, next) => {
	//res.cache(0) //表示不缓存
	//res.cache(7*24*3600)//设置缓存时间
	responseDate = {
		code: 0,
		message: null
	};
	next();
})

router.get('/api/data', (req, res, next) => {
	//console.log(req.query);

	if (req.query.sc !== undefined) {
		var wd = `${encodeURI(req.query.wd)}%20${encodeURI(req.query.sc)}` || `${encodeURI(req.query.wd)}`;
		var c = encodeURI(req.query.c) || '289'; //城市
		var pn = req.query.pn || 0; //页数
		var reqUrl = `http://api.map.baidu.com/?qt=s&c=289&wd=${wd}&rn=100&pn=${pn}&ie=utf-8&oue=33&fromproduct=jsapi&ak=Uszxk0qk4kpamOedprWEuNDG90IRHh7C`;
		//http://api.map.baidu.com/?qt=s&c=289&wd=${wd}F&rn=100&ie=utf-8&oue=1&fromproduct=jsapi&res=api&callback=BMap._rd._cbk68860
		console.log(1)
	} else if (req.query.point !== undefined) {
		var wd = encodeURI(req.query.wd) || encodeURI('夜总会'); //搜索内容
		//var c = encodeURI(req.query.c) || '289'; //城市
		var ar = encodeURIComponent(req.query.point);
		var pn = req.query.pn || 0; //页数
		var reqUrl = `http://api.map.baidu.com/?qt=bd&c=289&wd=${wd}&ar=(${ar})&rn=100&pn=${pn}&l=18&ie=utf-8&oue=1&fromproduct=jsapi&res=api&ak=Uszxk0qk4kpamOedprWEuNDG90IRHh7C`;
		console.log(2)
			//http://api.map.baidu.com/?qt=bd&c=289&wd=${wd}&ar=(${ar})&rn=100&pn=${pn}&l=18&ie=utf-8&oue=1&fromproduct=jsapi&res=api&ak=Uszxk0qk4kpamOedprWEuNDG90IRHh7C`

	} else {
		var wd = encodeURI(req.query.wd) || encodeURI('夜总会'); //搜索内容
		var c = encodeURI(req.query.c) || '289'; //城市
		var pn = req.query.pn || 0; //页数
		var reqUrl = `http://api.map.baidu.com/?qt=s&c=${c}&wd=${wd}&rn=100&pn=${pn}&ie=utf-8&oue=33&fromproduct=jsapi&ak=Uszxk0qk4kpamOedprWEuNDG90IRHh7C`;
		console.log(3)
	}

	console.log(reqUrl)

	var flag = true;

	//console.log(reqUrl);

	//var reqUrl = `http://api.map.baidu.com/?qt=s&c=${c}&wd=${wd}&rn=100&pn=${pn}&ie=utf-8&oue=33&fromproduct=jsapi&ak=Uszxk0qk4kpamOedprWEuNDG90IRHh7C`;
	//http://api.map.baidu.com/?qt=s&c=${c}&wd=${wd}&rn=100&pn=${pn}&ie=utf-8&oue=1&fromproduct=jsapi&res=api&callback=BMap._rd._cbk8396
	//http://api.map.baidu.com/?qt=bd&c=289&wd=${wd}&ar=(13484413.45%2C3625465.56%3B13520915.62%2C3642467.49)&pn=${pn}&rn=100&l=18&ie=utf-8&oue=1&fromproduct=jsapi&ak=Uszxk0qk4kpamOedprWEuNDG90IRHh7C
	//http://api.map.baidu.com/?qt=bd&c=289&wd=${wd}&ar=${ar}&rn=100&pn=${pn}&l=18&ie=utf-8&oue=1&fromproduct=jsapi&res=api&ak=Uszxk0qk4kpamOedprWEuNDG90IRHh7C
	request({
		uri: reqUrl,
		timeout: 10000,
		tunnel: true,
		gzip: true,
		proxy: false,
		followRedirect: false,
		headers: {
			'User-Agent': 'request'
		}
	}, function(err, response, body) {
		if (err) {
			responseDate.code = 2;
			responseDate.message = '服务器错误';
			res.send(responseDate);
			return;
		}
		if (!err && response.statusCode == 200) {
			console.log(typeof body)
			

			body = JSON.parse(body);
			//console.log(body.content)
			if (body.content == undefined || body.content == null) {
				responseDate.code = 1;
				responseDate.message = '没有找到数据';
				res.send(responseDate)
				return;
			}
			//list(body.content, 0, flag);

			setTimeout(() => {
				responseDate.code = 0;
				responseDate.message = '获取成功';
				responseDate.data = body;
				//responseDate.num = `${body.conntent.length}条数据`;
				res.send(responseDate);
				return;
			}, 0)

			//res.send(responseDate);
		}
	});
});

//存入数据库
router.post('/api/data/add', (req, res, next) => {
	var data = JSON.parse(req.body.data);
	var flag = true;
	//console.log(JSON.parse(req.body.data));

	if (!data) {
		responseDate.code = 1;
		responseDate.message = ' 没有找到数据';
		res.send(responseDate)
		return;
	}
	list(data, 0, flag);
	setTimeout(() => {
		responseDate.code = 0;
		responseDate.message = ' 1 ';
		responseDate.data = data;
		responseDate.num = `${num} `;

		res.send(responseDate);
		return;
	}, 0)
})

//接受数据
router.post('/user/data', (req, res, next) => {


	var data = req.body.data;
	//console.log(data);
	var num = 0,
		flag = true;
	if (data) {

		data.forEach(function(v, i) {
			var list = {
					uid: v.uid ? v.uid : "",
					address: v.address ? v.address : "",
					city: v.city ? v.city : "",
					isAccurate: v.isAccurate ? v.isAccurate : "",
					phoneNumber: v.phoneNumber ? v.phoneNumber : "",
					lat: v.point ? v.point.lat : "",
					lng: v.point ? v.point.lng : "",
					postcode: v.postcode ? v.postcode : "",
					province: v.province ? v.province : "",
					title: v.title ? v.title : "",
					tags0: v.tags ? v.tags[0] : "",
					tags1: v.tags ? v.tags[1] : "",
					tags2: v.tags ? v.tags[2] : "",
					type: v.type || "",
					url: v.url || ""
				}
				//存入数据库
			inMsql(list, flag)
			if (flag) {
				num++;
			}
		})

		//有数据
		setTimeout(() => {
			responseDate.message = '数据传输成功';
			responseDate.num = `插入${num}条数据`;
			res.json(responseDate);
			return;
		}, 0)

	}

})

//单条数据
router.post('/user/onedata', (req, res, next) => {
	var data = req.body.data;
	//console.log(data);
	var num = 0,
		flag = true;
	if (data) {
		var list = {
			uid: data.uid ? data.uid : "",
			address: data.address ? data.address : "",
			city: data.city ? data.city : "",
			isAccurate: data.isAccurate ? data.isAccurate : "",
			phoneNumber: data.phoneNumber ? data.phoneNumber : "",
			lat: data.point ? data.point.lat : "",
			lng: data.point ? data.point.lng : "",
			postcode: data.postcode ? data.postcode : "",
			province: data.province ? data.province : "",
			title: data.title ? data.title : "",
			tags0: data.tags ? data.tags[0] : "",
			tags1: data.tags ? data.tags[1] : "",
			tags2: data.tags ? data.tags[2] : "",
			type: data.type || "",
			url: data.url || ""
		}

		inMsql(list, flag)
		if (flag) {
			num++;
		}


		//有数据
		setTimeout(() => {
			responseDate.message = '数据传输成功';
			responseDate.num = `插入${num}条数据`;
			res.json(responseDate);
			return;
		}, 0)

	}

})

//退出
router.get('/user/logout', (req, res) => {
	req.cookies.set('userInfo', null);
	res.json(responseDate);
});



function list(data, num, flag) {
	this.num = num
	data.forEach(function(v, i) {
		/*if(!v.ext || !v.ext.detail_info){
			return;
		}*/
		var list = {
				uid: v.uid ? v.uid : "",
				address: v.addr ? v.addr : "",
				city: v.area_name ? v.area_name : "",
				isAccurate: v.isAccurate ? v.isAccurate : "",
				phoneNumber: v.tel ? v.tel : "",
				lat: v.y ? v.y : "",
				lng: v.x ? v.x : "",
				postcode: v.postcode ? v.postcode : "",
				province: v.aoi ? v.aoi : "",
				title: v.name ? v.name : "",
				tags0: v.tag ? v.tag : "",
				tags1: v.std_tag ? v.std_tag : "",
				tags2: v.tags ? v.tags[2] : "",
				type: v.type || "",
				url: v.url || "",
				aoi: v.aoi || v.aoi,
				alias0: v.alias ? String(v.alias) : "",
				alias1: v.alias ? v.alias[1] : "" //,
					/*image: v.ext.detail_info.image ? v.ext.detail_info.image : "",
					phone: v.ext.detail_info.phone ? v.ext.detail_info.phone : "",*/
					//dipointx: v.ext.detail_info.point ? v.ext.detail_info.point.x : "",
					//dipointy: v.ext.detail_info.point ? v.ext.detail_info.point.y : ""
			}
			//存入数据库
		inMsql(list, flag)
		if (flag) {
			this.num++;
		}
	})
	return this.num
}



module.exports = router;