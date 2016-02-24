//====================验证码倒计时======================//
define(function () {
    function timerTool() {
        this.setTime = function settime(obj, cookieName) {
            var countdown = cookieHelper.getCookie(cookieName);
            if (countdown == 0 || countdown == undefined) {
                obj.removeClass("verificationCode-disable").addClass("verificationCode");
                obj.removeAttr("disabled");
                obj.val("获取验证码");
                return;
            } else {
                obj.attr("disabled", true).removeClass("verificationCode").addClass("verificationCode-disable");
                obj.val("重新发送(" + countdown + ")");
                countdown--;
                cookieHelper.setCookie(cookieName, countdown, countdown + 1);
            }
            setTimeout(function () { settime(obj, cookieName); }, 1000); //每1000毫秒执行一次
        };
    };

    return new timerTool();
});