var express = require('express');
var router = express.Router();
const UserModel = require('../models/lib/mongoModel').UserModel;
var request = require('request'); //解决服务请求转发

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/api/checkName', function(req, res, next) {
    UserModel.findOne({ "userName": req.body.userName }).then(function(data) {
        console.log(data);
        if (data) {
            res.json({
                "result": false,
                "msg": "该数据已存在"
            });
        } else {
            res.json({
                "result": true,
                "msg": "系统无该数据"
            });
        }
    });
});

router.post('/api/checkMobile', function(req, res, next) {
    UserModel.findOne({ "mobile": req.body.mobile }).then(function(data) {
        if (data) {
            res.json({
                "result": false,
                "msg": "该数据已存在"
            });
        } else {
            res.json({
                "result": true,
                "msg": "系统无该数据"
            });
        }
    });
});
// 短信发送接口----暂未实现
router.post('/api/sendmsg', function(req, res, next) {
    UserModel.findOne({ "mobile": req.body.mobile }).then(function(data) {
        if (data) {
            res.json({
                "result": false,
                "msg": "该数据已存在"
            });
        } else {
            res.json({
                "result": true,
                "msg": "系统无该数据"
            });
        }
    });
});

router.post('/api/sign', function(req, res, next) {
    // UserModel.create(req.body);
    UserModel.findOne({ "userName": req.body.userName }).then((data) => {
        if (!data) {
            UserModel.findOne({ "mobile": req.body.mobile }).then((data) => {
                if (!data) {
                    UserModel.create(req.body).then((err) => {
                        console.log(err);
                        if (!err) {
                            res.json({
                                "result": true,
                                "msg": "注册成功"
                            });
                        }
                    });
                } else {
                    res.json({
                        "result": false,
                        "msg": "该数据已存在"
                    });
                }
            })
        } else {
            res.json({
                "result": false,
                "msg": "该数据已存在"
            });
        }
    })
});


module.exports = router;