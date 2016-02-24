define(['js/common/service'], function (service) {

    function demoServiceProxy() {

        // ----无认证，无loading
        this.backgroundCallTest = function (model) {
            return service.backgroundCall("Accounts/SendVerificationCode", model, "post");
        };

        //---无认证，带loading 
        this.callTest = function (searchModel) {
            return service.call("http://localhost/PS.API/MockUsers/PageFind", searchModel, "post");
        }

        //----需要被认证
        this.authorizeCallTest = function () {
            return service.authorizedCall("Users/Self", {}, "get");
        }
    }

    return new demoServiceProxy();
});