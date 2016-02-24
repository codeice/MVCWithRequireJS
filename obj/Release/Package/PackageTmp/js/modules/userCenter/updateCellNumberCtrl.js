require.config(requireConfig);
define(['userCenterService', 'accountService', 'count'], function (userCenterService, accountService, vCodeTimer) {
    $(function () {
        //验证码倒计时防刷新
        var v = cookieHelper.getCookie("step1VCode");//获取cookie值
        if (v > 0) {
            vCodeTimer.setTime($("#sendVCode"), "step1VCode");//step1验证码倒计时
        }

        var v2 = cookieHelper.getCookie("step2VCode");//获取cookie值
        if (v2 > 0) {
            vCodeTimer.setTime($("#sendVCode2"), "step2VCode");//step2验证码倒计时
        }
        showVerificationImage("randomCodeImg1");

    });

    //---setp1刷新验证码
    $("#refreshRandomCode,#randomCodeImg1").on('click', function () {
        showVerificationImage("randomCodeImg1");
    });

    //---setp2刷新验证码
    $("#refreshRandomCode2,#randomCodeImg2").on('click', function () {
        showVerificationImage("randomCodeImg2");
    });

    //----新手机号码监听
    $("#newCellNumber").bind('input propertychange', function () {
        if (validation.isMobile($("#newCellNumber").val())) {
            $("#sendVCode2").removeClass("verificationCode-disable");
            $("#sendVCode2").addClass("verificationCode");
            $("#sendVCode2").attr("disabled", false);

        } else {
            $("#sendVCode2").removeClass("verificationCode");
            $("#sendVCode2").addClass("verificationCode-disable");
            $("#sendVCode2").attr("disabled", true);
        }
    });

    //----step1 发送完验证码后，验证码输入框可用
    $("#sendVCode").on('click', function () {
        $("#vCode").attr("disabled", false);
        //发送完验证码，禁用60秒
        var smsModel = {
            CellNumber: $.cookie("userName"),
            Event: 1 //发送验证身份验证码
        };
        accountService.sendVerificationCode(smsModel).$promise.then(function (response) {
            if (response.Code == 0) {
                cookieHelper.setCookie("step1VCode", appConfig.vCodeVal, appConfig.vCodeExpiresSeconds);//添加登录验证码cookie记录,有效时间60s
                var v = cookieHelper.getCookie("step1VCode");//获取cookie值
                if (v > 0) {
                    vCodeTimer.setTime($("#sendVCode"), "step1VCode");//手机验证码倒计时
                }
            }
        });
    });

    //----step2 绑定新手机号 发送完验证码后，验证码输入框可用
    $("#sendVCode2").on('click', function () {
        $("#vCode2").attr("disabled", false);
        //发送完验证码，禁用60秒
        var smsModel = {
            CellNumber: $("#newCellNumber").val(),
            Event: 1 //发送验证身份验证码
        };
        accountService.sendVerificationCode(smsModel).$promise.then(function (response) {
            if (response.Code == 0) {
                cookieHelper.setCookie("step2VCode", appConfig.vCodeVal, appConfig.vCodeExpiresSeconds);//添加登录验证码cookie记录,有效时间60s
                var v = cookieHelper.getCookie("step2VCode");//获取cookie值
                if (v > 0) {
                    vCodeTimer.setTime($("#sendVCode2"), "step2VCode");//手机验证码倒计时
                }
            }
        });
    });

    //----step1 【验证身份】
    $("#btn-firstNext").on('click', function () {
        var vCode1 = $("#vCode").val();
        var graphicCode1 = $("#randomCode").val();
        if (vCode1 == "") {
            bootbox.alert("请填写短信验证码！");
            return;
        }
        if (graphicCode1 == "") {
            bootbox.alert("请填写图形验证码！");
            return;
        }

        var model = {
            "CellNumber": cookieHelper.getCookie("userName"),
            "VerificationCode": vCode1,
            "GraphicCode": graphicCode1
        };
        userCenterService.usersSelf(model).$promise.then(function (response) {
            if (response.Code == "0") {
                showVerificationImage("randomCodeImg2");
                $('#step1').hide();
                $('#step2').show();
            } else {
                bootbox.alert(response.Message);
            }
        });

    });

    //----step2 【提交】
    $("#btn-submitNext").on('click', function () {
        var newCellNumber = $("#newCellNumber").val();
        var vCode2 = $("#vCode2").val();
        var radomCode2 = $("#randomCode2").val();
        if (newCellNumber == "") {
            bootbox.alert("请填新的手机号！");
            return;
        }
        if (vCode2 == "") {
            bootbox.alert("请填写短信验证码！");
            return;
        }
        if (radomCode2 == "") {
            bootbox.alert("请填写图形验证码！");
            return;
        }

        var userModel = { "CellNumber": newCellNumber, "VerificationCode": vCode2, "GraphicCode": radomCode2 };
        userCenterService.updateCell(userModel).$promise.then(function (response) {
            if (response.Code == 0) {
                document.getElementById("welcomeNickName").innerHTML = "欢迎您！" + newCellNumber;
                $('#step1').hide();
                $('#step2').hide();
                $('#step3').show();
            } else {
                bootbox.alert(response.Message);
            }
        });

    });

    //---修改手机完成后 【返回】
    $("#btn-back").on('click', function () {
        $("#updateCellNumber").hide();
        $('#ProfileInfo').show();
        $('#upProfile').show();
        $("#upCellNum").show();
        $('#UserProfileForm').hide();
        $('#step1').show();
        $('#step2').hide();
        $('#step3').hide();
    });

    //---显示验证码
    function showVerificationImage(randomCodeImgId) {
        userCenterService.getGenerateVerificationImage().$promise.then(function (response) {
            if (response.Code == "0") {
                var src = "data:image/png;base64," + response.Data;
                // $("#randomCodeImg1").attr("src", src);
                $("#" + randomCodeImgId).attr("src", src);
            }
        });
    }
});