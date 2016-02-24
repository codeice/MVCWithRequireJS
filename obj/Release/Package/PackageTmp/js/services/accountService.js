define(['js/common/service'], function (service) {

    function accountServiceProxy() {
        //获取短信验证码
        this.sendVerificationCode = function (model) {
            return service.backgroundCall("Accounts/SendVerificationCode", model, "post");
        };

        //注册新用户
        this.registerUser = function(model) {
            return service.call("Accounts/Register", model, "post");
        };

        //获取个人信息
        this.getUser = function() {
            return service.authorizedCall("Users/Self", "get");
        };

        //用户登录（密码登录)
        this.userLogin = function(model) {
            return service.call("Accounts/Login", model, "post");
        };

        //用户登录（验证码登录）
        this.mobileLogin = function(model) {
            return service.call("Accounts/MobileLogin", model, "post");
        };

        //获取用户协议
        this.getContract = function() {
            return service.call("Accounts/Contract", {},"get");
        };
        
        //注销用户
        this.logOff = function() {
            return service.authorizedCall("Accounts/Logout", {}, "post");
        };

    }

    return new accountServiceProxy();



});