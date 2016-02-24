$(function () {
    var userToken = cookieHelper.getCookie("userToken");
    if (userToken != "") {
        document.getElementById("welcomeNickName").innerHTML = "欢迎您！" + cookieHelper.getCookie("userName");
        $("#alreadyLoggedIn").css("display", "block");
        $("#notLoggedIn").css("display", "none");
    } else {
        $("#alreadyLoggedIn").css("display", "none");
        $("#notLoggedIn").css("display", "block");
    }

    $("#logOff").on('click', function () {
        //console.log(cookieHelper.getCookie("userToken"));
        var logoffUrl = appConfig.apiServer + 'Accounts/Logout?token=' + cookieHelper.getCookie("userToken");
        $.ajax({
            async: false,
            type: "post",
            url: logoffUrl,
            data: {},
            dataType: "json",
            contentType: "application/json",
            success: function () {
                if (cookieHelper.checkCookie("userToken")) {
                    cookieHelper.clearCookie("userToken");
                }
                if (cookieHelper.checkCookie("userName")) {
                    cookieHelper.clearCookie("userName");
                }
                if (cookieHelper.checkCookie("loginSecondsremained")) {
                    cookieHelper.clearCookie("loginSecondsremained");
                }
                if (cookieHelper.checkCookie("secondsremained")) {
                    cookieHelper.clearCookie("secondsremained");
                }
                if (cookieHelper.checkCookie("step1VCode")) {
                    cookieHelper.clearCookie("step1VCode");
                }
                if (cookieHelper.checkCookie("step2VCode")) {
                    cookieHelper.clearCookie("step2VCode");
                }
                document.getElementById("welcomeNickName").innerHTML = "";
                $("#alreadyLoggedIn").css("display", "none");
                $("#notLoggedIn").css("display", "block");
            },
            error: function () {
                bootbox.alert("注销失败，操作异常！");
            }
        });
    });
});