define(['vue', 'jqweui'], function(Vue) {
    var com_username = {
        template: `
            <div class="weui-cell">
                <div class="weui-cell__hd">
                    <label class="weui-label">用户名</label>
                </div>
                <div class="weui-cell__bd">
                    <input class="weui-input" type="text" placeholder="以英文字母开头，3-20个字符" v-bind:value="selfValue" v-on:input="handleinput">
                </div>
                <div class="weui-cell__ft">
                    <i></i>
                </div>
            </div>
            `,
        data: function() {
            return {
                selfValue: this.value
            };
        },
        props: ['value'],
        methods: {
            // 同步数据，双向绑定
            handleinput: function(event) {
                var value = event.target.value;
                this.$emit('input', value);// 'input'后的参数就是传递给组件中v-model绑定的属性的值
            },
            //用户名唯一性检测
            checkUserName: function(obj) {
                var self = this;
                var val = self.userName.value;
                var RE = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
                var promise = new Promise(function(resolve, reject) {
                    if (!RE.test(val)) {
                        resolve(false);
                        self.$parent.commonMsg('格式错误');
                        console.log('false');
                        self.userName.result = false;
                    } else {
                        resolve(true);
                        self.userName.result = true;
                    }
                });
                return promise;
            }
        }
    };
    var app = new Vue({
        el: '.wrap',
        created: function() {
            var that = this;
        },
        data: {
            test: 'xxxxxxxxxxxxxx',
            userName: {
                value: '',
                msg: 'xxxxxxxxxxxxxuserName',
                result: false
            },
            Mobile: {
                value: '',
                result: false
            },
            Msgcode: {
                value: '',
                result: false
            },
            Password: {
                value: '',
                cvalue: '',
                result: false
            },
            sendMsgBtn: {
                time: 10,
                statue: true,
                html: '点击获取验证码'
            },
            IDnum: {
                value: '',
                result: false
            },
            trueName: {
                value: '',
                result: false
            },
            pagesinfo: {
                result: true,
                hint: '您已完成市民通行证注册，为方便提供服务，您需前往完成实名认证。'
            }
        },
        components: {
            'username': com_username
        },
        watch: {},
        methods: {
            //输入框提醒方法
            commonMsg: function(MsgNum) {
                var self = this;
                if (isNaN(MsgNum)) {
                    $.toptip(MsgNum, 'error');
                } else $.toptip(MSG[MsgNum], 'error');
            },
            //输入框复位方法
            commonReset: function(obj) {
                var self = this;
            },
            //倒计时工具
            setTimer: function() {
                var that = this;
                if (that.sendMsgBtn.time === 0) {
                    that.sendMsgBtn.time = 10;
                    that.sendMsgBtn.statue = true;
                    that.sendMsgBtn.html = '点击获取验证码';
                    return true;
                } else {
                    that.sendMsgBtn.statue = false;
                    that.sendMsgBtn.html = that.sendMsgBtn.time + '秒后再重试';
                    setTimeout(function() {
                        that.sendMsgBtn.time--;
                        that.setTimer();
                    }, 1000);
                }
            },
            //通用短信发送接口
            sendMsgFor: function(operationType, domainName, sendType) {
                var that = this;
                $.ajax({
                        url: '/api/sendMSG',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            "operationType": operationType,
                            "mobile": that.Tel.value
                        },
                    })
                    .done(function() {
                        console.log("success");
                    })
                    .fail(function() {
                        console.log("error");
                    });
            },
            //用户名唯一性检测
            /*checkUserName: function(obj) {
                var self = this;
                var val = self.userName.value;
                var RE = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
                var promise = new Promise(function(resolve, reject) {
                    if (!RE.test(val)) {
                        resolve(false);
                        self.commonMsg('格式错误');
                        self.userName.result = false;
                    } else {
                        resolve(true);
                        self.userName.result = true;
                    }
                });
                return promise;
            },*/
            //手机唯一性校验
            checkMobile: function() {
                var self = this;
                var val = self.Mobile.value;
                var RE = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[2-9])|(18[0-9]))\d{8}$/;
                var promise = new Promise(function(resolve, reject) {
                    if (!RE.test(val) || val.length != 11) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
                return promise;
            },
            //密码安全性校验
            checkPassword: function(obj) {
                var self = this;
                var val = self.Password.value;
                var RE1 = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/,
                    RE2 = /^[A-Za-z0-9`~!@#\$%\^&\*\(\)_\+-=\[\]\{\}\\\|;:'"<,>\.\?\/]{8,30}$/;
                var promise = new Promise(function(resolve, reject) {
                    if (RE.test(val) && RE.test(val)) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
                return promise;
            },
            //再次确认密码
            confirmpwd: function(obj) {
                var that = this;
                var element = obj.target;
                if (that.Password.value === that.Password.cvalue && that.Password.value !== '') {
                    that.Password.result = true;
                    that.commonMsg(element, true);
                } else {
                    that.Password.result = false;
                    that.commonMsg(element, false);
                }
            },
            //身份证号格式检测
            checkIDnumber: function(obj) {
                var that = this;
                var element = obj.target;
                var IDnum = that.IDnum.value;
                if (IDnum.length != 18) {
                    that.commonMsg(element, false, 7001);
                    return false;
                }
                if (IDnum[17] == 'x') {
                    IDnum = IDnum.replace('x', 'X');
                }
                //权重数组
                var IDweight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                //校验码数组
                var IDcheckArray = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
                var IDsum = 0;
                var IDmod;
                for (var i = 0; i <= 16; i++) {
                    IDsum += IDnum[i] * IDweight[i];
                }
                IDmod = IDsum % 11;
                if (IDnum[17] == IDcheckArray[IDmod]) {
                    return true;
                } else {
                    that.commonMsg(element, false, 7002);
                    return false;
                }
            },
            //检测账号信息唯一性
            checkUserExist: function(type, value) {
                var that = this;
            },
            //身份证唯一性校验
            IDnumExist: function(obj) {
                var that = this;
                var element = obj.target;
                if (!that.checkIDnumber(obj)) {
                    return false;
                }
                Promise.resolve({
                    then: function(resolve) {
                        $.ajax({
                            url: '/api/checkUserExist',
                            type: 'POST',
                            dataType: 'json',
                            cache: false,
                            data: {
                                'attributeName': 'creditID',
                                'attributeValue': that.IDnum.value
                            },
                            success: function(data) {
                                resolve(data);
                            }
                        });
                        //resolve(that.checkUserExist('creditID', that.IDnum.value));
                    }
                }).then(function(data) {
                    if (data.code == 200) {
                        that.IDnum.result = false;
                        that.commonMsg(element, false, 7003);
                        $.modal({
                            title: "提示",
                            text: "该身份证已在本系统注册，如非本人操作请联系客服或点击下方操作指引",
                            buttons: [{
                                    text: "取消",
                                    className: "default",
                                    onClick: function() {
                                        return false;
                                    }
                                },
                                { text: "操作指引", onClick: function() { console.log(2); } }
                            ]
                        });
                    } else {
                        that.IDnum.result = true;
                        return true;
                    }
                });
            },
            //初级认证提交
            basicRealnameSubmit: function() {
                var that = this;
                $.ajax({
                    url: '/api/basicRealnameAuth',
                    type: 'POST',
                    dataType: 'json',
                    cache: false,
                    data: {
                        'certificateName': that.trueName.value,
                        'certificateNum': that.IDnum.value
                    },
                    beforeSend: function() {
                        $.showLoading("实名认证中...");
                    },
                    success: function(data) {
                        $.hideLoading();
                    },
                    error: function() {
                        $.hideLoading();
                    }
                });
            },
            //高级实名认证提交
        }
    });
    window.app = app;
});