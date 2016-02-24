require.config(requireConfig);
define(['../js/services/accountService.js', 'count'], function (accountService, vCodeTimer) {
    //placeholder兼容性解决，是ie9-可以使用placeholder
    $(function ($) {
        $("#sendVCode").attr("disabled", true);

        if (!('placeholder' in document.createElement('input'))) {
            $('input[placeholder],textarea[placeholder]').each(function () {
                var that = $(this),
                text = that.attr('placeholder');
                if (that.val() === "") {
                    that.val(text).addClass('placeholder');
                }
                that.focus(function () {
                    if (that.val() === text) {
                        that.val("").removeClass('placeholder');
                    }
                })
                .blur(function () {
                    if (that.val() === "") {
                        that.val(text).addClass('placeholder');
                    }
                })
                .closest('form').submit(function () {
                    if (that.val() === text) {
                        that.val('');
                    }
                });
            });
        }

        //手机号监听事件
        $("#CellNumber").bind('input propertychange', function () {
            var vcode = cookieHelper.getCookie("loginSecondsremained");//获取cookie值
            if (!appConfig.phoneReg.test($("#CellNumber").val()) || $("#CellNumber").val().length > 11) {
                //发送验证码按钮不可用       lcbtr_getvalidcode
                $("#sendVCode").removeClass("verificationCode");
                $("#sendVCode").addClass("verificationCode-disable");
                $("#sendVCode").attr("disabled", true);
            }
            //else if (typeof vcode == "undefined" || vcode <= 0) {
            else if (vcode == "") {
                $("#sendVCode").removeClass("verificationCode-disable");
                $("#sendVCode").addClass("verificationCode");
                $("#sendVCode").attr("disabled", false);
            }
        });

        //验证码倒计时防刷新
        var v = cookieHelper.getCookie("loginSecondsremained");//获取cookie值
        if (v > 0) {
            vCodeTimer.setTime($("#sendVCode"), "loginSecondsremained");//开始倒计时
        }


    });

    //----按钮登录
    $("#btnLogin").on('click', function () {
        if ($("#Password").val() == "" && $("#txtVcode").val() != "") {
            var user = {
                "CellNumber": $("#CellNumber").val(),
                "VerificationCode": $("#txtVcode").val(),
                "From": "web"
            };
            accountService.mobileLogin(user).$promise.then(function (response) {
                actionAfterLogin(response);
            });
        } else {
            var userModel = {
                "IdentityKey": $("#CellNumber").val(),
                "Password": $("#Password").val(),
                "VerificationCode": $("#txtVcode").val(),
                "From": "web"
            };
            accountService.userLogin(userModel).$promise.then(function (response) {
                actionAfterLogin(response);
            });
        }
    });

    //----“回车”登录
    $("body").keydown(function() {
        if (event.keyCode == "13") {
            $("#btnLogin").click();
        }
    });


    //发送验证码
    $("#sendVCode").on('click', function () {
        var smsModel = {
            CellNumber: $("#CellNumber").val(),
            Event: 1
        };
        accountService.sendVerificationCode(smsModel).$promise.then(function (response) {
            if (response.Code == 0) {
                cookieHelper.setCookie("loginSecondsremained", appConfig.vCodeVal, appConfig.vCodeExpiresSeconds);//添加登录验证码cookie记录,有效时间60s
                var v = cookieHelper.getCookie("loginSecondsremained");//获取cookie值
                if (v > 0) {
                    vCodeTimer.setTime($("#sendVCode"),"loginSecondsremained");//开始倒计时
                }
            }
        });

    });

    $("#eventby_rules").on("click", function (e) {
        $("#event_shaddow").css("display", "none");
        $("#eventby_rules").css("display", "none");
    });

    $("#eventbycvr_ctnt").on("click", function (e) {
        e.stopPropagation();
    });

    //----切换到短信验证码登录
    $("#messageLogin").on('click', function () {
        changeLoginType("Password", "none", "block", "短信快捷登录");
    });

    //----切换到密码登录
    $("#passwordLogin").on('click', function () {
        changeLoginType("txtVcode", "block", "none", "密码登录");
    });


    //----切换登录方式
    function changeLoginType(clearId, displayType1,displayType2,loginTypeText) {
        $("#"+clearId).val("");//清空密码
        $("#Pwd").css("display", displayType1);
        $("#messageLogin").css("display", displayType1);
        $("#VCode").css("display", displayType2);
        $("#passwordLogin").css("display", displayType2);
        document.getElementById("loginType").innerHTML = loginTypeText;
    }

    //登录后保存cookie和跳转
    function actionAfterLogin(response) {
        if (response.Code == 0) {
            //保存登录用户token
            if (cookieHelper.checkCookie("userToken")) {
                cookieHelper.clearCookie("userToken");
            }
            cookieHelper.setCookie("userToken", response.Data.Token, appConfig.expiresSeconds); //保存用户token
            if (cookieHelper.checkCookie("userName")) {
                cookieHelper.clearCookie("userName");
            }
            cookieHelper.setCookie("userName", $("#CellNumber").val(), appConfig.expiresSeconds);
            var gotoHref = decodeURI(utility.getQueryParameter("redirectUrl"));
            if (gotoHref == "") {
                window.location.href = baseUrl + "Home/index";
            } else {
                window.location.href = gotoHref;
            }
        } else {
            bootbox.alert(response.Message);
        }
    }

});