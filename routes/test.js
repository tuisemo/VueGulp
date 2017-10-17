var express = require('express');
var router = express.Router();
const UserModel = require('../models/lib/mongoModel').UserModel;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/api/checkName', function(req, res, next) {
    UserModel.findOne({ "name": req.body.name }).then(function(data) {
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

router.post('/api/sign', function(req, res, next) {
    var user = new UserModel(req.body);
    console.log(req.body);
    user.save().then(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                "result": true,
                "msg": "注册成功"
            });
        }
    })
    /*UserModel.create(req.body).then(function(el) {
        console.log(el);
        res.json({
            "result": true,
            "msg": "注册成功"
        });
    });*/

    /*UserModel.findOne({ "name": req.body.name }).then(function(data) {
        console.log(data);
        if (!data) {
            next();
        }
    }).then(function(el) {
        UserModel.findOne({ "mobile": req.body.mobile }).then(function(data) {
            if (!data) {
                next();
            }
        });
    }).then(function(date) {
        UserModel.create(data).then(function(el) {
            console.log(el);
            res.json({
                "result": true,
                "msg": "注册成功"
            });
        });
    });*/
});


module.exports = router;