define(['vue', 'jqweui'], function(Vue) {
    // 用户名输入框组件
    var com_username = {
        template: `
            <div class="weui-cell">
                <div class="weui-cell__hd">
                    <label class="weui-label">用户名</label>
                </div>
                <div class="weui-cell__bd">
                    <input class="weui-input" type="text" placeholder="以英文字母开头，3-20个字符" v-bind:value="selfValue" v-on:input="handleinput" v-on:blur="checkUserName">
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
                this.$emit('input', value); // 'input'后的参数就是传递给组件中v-model绑定的属性的值
            },
            //用户名唯一性检测
            checkUserName: function(obj) {
                var self = this,
                    Sparent = self.$parent;
                var val = self.value;
                var RE = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
                var promise = new Promise(function(resolve, reject) {
                    if (!RE.test(val)) {
                        resolve(false);
                        self.$parent.commonMsg('格式错误');
                        console.log('false');
                        Sparent.checkResult.userName = false;
                    } else {
                        $.ajax({
                                url: '/api/checkName',
                                type: 'POST',
                                dataType: 'json',
                                data: { "userName": self.value },
                            })
                            .done(function(data) {
                                if (data.result) {
                                    resolve(true);
                                    Sparent.checkResult.userName = true;
                                } else {
                                    resolve(false);
                                    self.$parent.commonMsg('已被占用');
                                }
                            })
                            .fail(function() {
                                console.log("error");
                            });

                    }
                });
                return promise;
            }
        }
    };
    // 手机输入框组件
    var com_mobile = {
        template: `
            <div class="weui-cell">
                <div class="weui-cell__hd">
                    <label class="weui-label">手&nbsp;&nbsp;&nbsp;机</label>
                </div>
                <div class="weui-cell__bd">
                    <input class="weui-input" type="tel" placeholder="推荐使用福建省内手机号" v-bind:value="selfValue" v-on:input="handleinput" v-on:blur="checkMobile">
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
                this.$emit('input', value); // 'input'后的参数就是传递给组件中v-model绑定的属性的值
            },
            // 手机格式检验
            checkMobile: function() {
                var self = this,
                    Sparent = self.$parent;
                var val = self.value;
                var RE = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[2-9])|(18[0-9]))\d{8}$/;
                var promise = new Promise(function(resolve, reject) {
                    if (!RE.test(val) || val.length != 11) {
                        self.$parent.commonMsg('格式错误');
                        resolve(false);
                        Sparent.checkResult.Mobile = false;
                    } else {
                        $.ajax({
                                url: '/api/checkMobile',
                                type: 'POST',
                                dataType: 'json',
                                data: { "mobile": self.value },
                            })
                            .done(function(data) {
                                if (data.result) {
                                    resolve(true);
                                    Sparent.checkResult.Mobile = true;
                                } else {
                                    resolve(false);
                                    self.$parent.commonMsg('已被占用');
                                }
                            })
                            .fail(function() {
                                console.log("error");
                            });
                    }
                });
                return promise;
            }
        }
    };
    // 验证码输入框组件
    var com_sendmsg = {
        template: `
            <div class="weui-cell weui-cell_vcode">
                <div class="weui-cell__hd">
                    <label class="weui-label">验证码</label>
                </div>
                <div class="weui-cell__bd">
                    <input class="weui-input" type="number" placeholder="短信验证码" v-model="selfValue" v-on:input="handleinput">
                </div>
                <div class="weui-cell__ft">
                    <i></i>
                    <button class="weui-vcode-btn" v-html="html" v-on:click="sendMsgFor">获取验证码</button>
                </div>
            </div>
            `,
        data: function() {
            return {
                selfValue: this.value,
                time: 10,
                status: true,
                html: '点击获取验证码'
            };
        },
        props: ['value', 'mobile', 'num', 'domainname'],
        methods: {
            // 同步数据，双向绑定
            handleinput: function(event) {
                var value = event.target.value;
                this.$emit('input', value); // 'input'后的参数就是传递给组件中v-model绑定的属性的值
            },
            //倒计时工具
            setTimer: function() {
                var self = this;
                if (self.time === 0) {
                    self.time = 10;
                    self.status = true;
                    self.html = '点击获取验证码';
                    return true;
                } else {
                    self.status = false;
                    self.html = self.time + '秒后再重试';
                    setTimeout(function() {
                        self.time--;
                        self.setTimer();
                    }, 1000);
                }
            },
            sendMsgFor: function() {
                var self = this;
                console.log(self.num);
                console.log(self.domainname);
                console.log(self.mobile);
                console.log(app.Msgcode.value);
                if (self.status) {
                    $.ajax({
                            url: '/api/sendMSG',
                            type: 'post',
                            dataType: 'json',
                            data: {
                                "operationType": self.num,
                                "domainname": self.domainname,
                                "mobile": self.mobile
                            },
                        })
                        .done(function() {
                            self.setTimer();
                            console.log("success");
                        })
                        .fail(function() {
                            self.setTimer();
                            console.log("error");
                        });
                }
            }
        }
    };
    // 密码输入框组件
    var com_password = {
        // 这里需注意一个问题，组件只允许template中存在一个根对象，所以当存在多个同级dom时，需使用一个父级容器将其包裹
        template: `
            <div>
                <div class="weui-cell">
                    <div class="weui-cell__hd">
                        <label class="weui-label">密&nbsp;&nbsp;&nbsp;码</label>
                    </div>
                    <div class="weui-cell__bd">
                        <input class="weui-input" type="password" placeholder="8-30位字符包含数字和英文字符" v-model="selfValue"  v-on:input="handleinput" v-on:blur="checkPassword">
                    </div>
                    <div class="weui-cell__ft">
                        <i></i>
                    </div>
                </div>
                <div class="weui-cell">
                    <div class="weui-cell__hd">
                        <label class="weui-label">确认密码</label>
                    </div>
                    <div class="weui-cell__bd">
                        <input class="weui-input" type="password" placeholder="请再次确认密码" v-model="confirm_pwd" v-on:blur="confirmpwd">
                    </div>
                    <div class="weui-cell__ft">
                        <i></i>
                    </div>
                </div>
            </div>
            `,
        data: function() {
            return {
                selfValue: this.value,
                confirm_pwd: ''
            };
        },
        props: ['value'],
        methods: {
            // 同步数据，双向绑定
            handleinput: function(event) {
                var value = event.target.value;
                this.$emit('input', value); // 'input'后的参数就是传递给组件中v-model绑定的属性的值
            },
            // 密码格式检验
            checkPassword: function(obj) {
                var self = this,
                    Sparent = self.$parent;
                var val = self.value;
                var RE1 = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/,
                    RE2 = /^[A-Za-z0-9`~!@#\$%\^&\*\(\)_\+-=\[\]\{\}\\\|;:'"<,>\.\?\/]{8,30}$/;
                var promise = new Promise(function(resolve, reject) {
                    if (RE1.test(val) && RE2.test(val)) {
                        resolve(true);
                        Sparent.checkResult.Password = true;
                    } else {
                        Sparent.commonMsg('密码格式错误');
                        resolve(false);
                        Sparent.checkResult.Password = true;
                    }
                });
                return promise;
            },
            //再次确认密码
            confirmpwd: function(obj) {
                var self = this,
                    Sparent = self.$parent;
                self.checkPassword().then(function(data) { // 使用Promise实现密码确认时先检测密码是否符合格式要求，再检测两次密码一致性
                    if (data) {
                        var element = obj.target;
                        if (self.value === element.value && self.value !== '') {
                            Sparent.checkResult.Password = true;
                        } else {
                            self.$parent.commonMsg('两次密码不一致');
                            Sparent.checkResult.Password = false;
                        }
                    }
                });
            }
        }
    };
    // 应用实例
    var app = new Vue({
        el: '.wrap',
        created: function() {
            var that = this;
        },
        data: {
            userName: '',
            Mobile: '',
            Msgcode: '',
            Password: '',
            iCheck: true,
            checkResult: {
                userName: false,
                Mobile: false,
                Password: false
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
            'username': com_username,
            'mobile': com_mobile,
            'sendmsg': com_sendmsg,
            'password': com_password
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
            loginSubmit: function() {
                var self = this;
                var isSubmit = true;
                for (var el in self.checkResult) {
                    isSubmit = self.checkResult[el] && isSubmit;
                }
                if (!self.iCheck) {
                    self.commonMsg('请勾选通行证协议');
                } else if (!isSubmit) {
                    self.commonMsg('数据校验不通过');
                } else {
                    $.ajax({
                            url: '/api/sign',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                "userName": self.userName,
                                "mobile": self.Mobile,
                                "msgcode": self.Msgcode,
                                "password": self.Password
                            },
                        })
                        .done(function(data) {
                            if (!data.result) {
                                self.commonMsg('注册失败');
                            }
                        })
                        .fail(function() {
                            console.log("error");
                        });
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