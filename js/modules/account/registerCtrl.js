require.config(requireConfig);
define(['../js/services/accountService.js'], function (accountService) {

    $(function () {
        //加载页面禁用注册按钮、获取验证码按钮
        $("#btnSubmit").attr("disabled", true);
        $("#getPhone").attr("disabled", true);

        //验证码倒计时防刷新
        var v =cookieHelper.getCookie("secondsremained");//获取cookie值
        if (v > 0) {
            settime($("#getPhone"));//开始倒计时
        }

        //勾选已阅读协议，注册按钮可用，否则禁用
        $("#agreeRule").change(function () {
            if ($("#agreeRule").prop("checked")) { //已勾选
                $("#btnSubmit").attr("disabled", false);
                $("#btnSubmit").css("background-image", "url(../Content/images/loginbg.png)"); //添加背景图片
            } else {
                $("#btnSubmit").css("background-image", "url('')"); //移除背景图片
                $("#btnSubmit").attr("disabled", true);
            }
        });

        //手机号监听事件
        $("#CellNumber").bind('input propertychange', function () {
            var secondsremainedVal = cookieHelper.getCookie("secondsremained");//获取cookie值
            if (!appConfig.phoneReg.test($("#CellNumber").val()) || $("#CellNumber").val().length > 11) {
                //发送验证码按钮不可用
                $("#getPhone").removeClass("registeGetValidCode");
                $("#getPhone").addClass("registeGetValidCode-disable");
                $("#getPhone").attr("disabled", true);
            }
            //else if (secondsremainedVal == "undefined" || secondsremainedVal <= 0) {
            else if (secondsremainedVal == "" || secondsremainedVal <= 0) {
                $("#getPhone").removeClass("registeGetValidCode-disable");
                $("#getPhone").addClass("registeGetValidCode");
                $("#getPhone").attr("disabled", false);
            }
        });

        //查看协议
        $("#Agreement").on('click', function () {
            accountService.getContract().$promise.then(function (response) {
                if (response.Code == 0) {
                    console.log(response);
                    $("#iframepage").attr("src", response.Data);
                }
            });
        });


    });

    //发送短信验证码
    $("#getPhone").on('click', function () {
        var smsModel = {
            CellNumber: $("#CellNumber").val(),
            Event: 0
        };
        accountService.sendVerificationCode(smsModel).$promise.then(function (response) {
            if (response.Code == 0) {
                cookieHelper.setCookie("secondsremained", appConfig.vCodeVal, appConfig.vCodeExpiresSeconds);//添加cookie记录,有效时间60s
            }
        });

        var v = cookieHelper.getCookie("secondsremained");//获取cookie值
        if (v > 0) {
            settime($("#getPhone"));//开始倒计时
        }

    });

    //注册用户
    $("#btnSubmit").on('click', function () {
        //非空验证
        if (checkEmpty()) {
            var userModel = {
                "CellNumber": $("#CellNumber").val(),
                "Password": $("#registerPwd").val(),
                "VerificationCode": $("#VerificationCode").val()
            };
            accountService.registerUser(userModel).$promise.then(function (response) {
                if (response.Code == 0) {
                    bootbox.alert("恭喜您已经成功注册赛圈！");
                    if (cookieHelper.checkCookie("userToken")) {
                        cookieHelper.clearCookie("userToken");
                    }
                    cookieHelper.setCookie("userToken", response.Data.Token, appConfig.expiresSeconds); //保存用户token

                    if (cookieHelper.checkCookie("userName")) {
                        cookieHelper.clearCookie("userName");
                    }
                    cookieHelper.setCookie("userName", $("#CellNumber").val(), appConfig.expiresSeconds);

                    window.location.href = baseUrl + "Home/index";
                };
                bootbox.alert(response.Message);
            });
        }
    });

    //手机验证码按钮可用倒计时
    var countdown = 0;
    function settime(obj) {
        countdown = utility.getCookieValue("secondsremained");
        if (countdown == 0 || countdown == "") {
            obj.removeClass("registe_getValidCode_disabled").addClass("registe_getValidCode");
            obj.removeAttr("disabled");
            obj.val("获取验证码");
            return;
        } else {
            obj.attr("disabled", true).addClass("registe_getValidCode_disabled").removeClass("registe_getValidCode");
            obj.val("重新发送(" + countdown + ")");
            countdown--;
            cookieHelper.setCookie("secondsremained", countdown, countdown + 1);
        }
        setTimeout(function () { settime(obj); }, 1000); //每1000毫秒执行一次
    }

    //表单非空验证
    function checkEmpty() {
        var cellNumber = $("#CellNumber").val();
        var password = $("#registerPwd").val();
        var verificationCode = $("#VerificationCode").val();

        if (cellNumber == "") {
            bootbox.alert("手机号码不能为空！");
            return false;
        } else if (password == "") {
            bootbox.alert("密码不能为空！");
            return false;
        } else if (verificationCode == "") {
            bootbox.alert("验证码不能为空！");
            return false;
        } else if (!appConfig.phoneReg.test(cellNumber)) {
            bootbox.alert("手机号码输入有误！");
            return false;
        } else if (verificationCode.match(/~\\d{6}$/)) {
            bootbox.alert("验证码输入有误！");
            return false;
        } else if (password.length < 5) {
            bootbox.alert("密码长度不能低于6位！");
            return false;
        }
        return true;
    }
});


