const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;// 全局Promise

const db = mongoose.connect('mongodb://localhost:27017/person');

db.connection.on("error", function(error) {
    console.log("数据库连接失败" + error)
});

db.connection.on("connected", function() {
    console.log("数据库连接成功")
});

db.connection.on("disconnected", function() {
    console.log("数据库断开连接")
});

const UserSchema = Schema({
    userName: {
        unique: true, // 唯一的不可重复
        type: 'String', // Schema.Type String类型
    },
    mobile: {
        unique: true, // 唯一的不可重复
        type: 'String', // Schema.Type String类型
    },
    password: {
        type: 'String',
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

exports.UserModel = mongoose.model('IDS', UserSchema);