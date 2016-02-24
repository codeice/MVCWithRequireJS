define(['js/common/service'], function (service) {

    function userCenterServiceProxy() {
        //----个人资料
        this.getUserProfile = function () {
            return service.authorizedCall("Users/Self", {}, "get");
        };
        //----更新个人资料
        this.upUserProfile = function (model) {
            return service.authorizedCall("Users/Self", model, "post");
        };
        //----我的赛事
        this.getMyEvents = function (pageModel) {
            return service.authorizedCall("Users/Self/Competitions", pageModel, "get");
        };
        //----我的订单
        this.getMyOrders = function (model) {
            return service.authorizedCall("Users/Self/Orders", model, "get");
        };

        //---未支付订单
        this.getUnPaidOrders = function () {
            return service.authorizedCall("Users/Self/Orders/Unpaid", {}, "get");
        };

        //----取消订单
        this.cancelOrder = function (orderId) {
            return service.authorizedCall("Orders/" + orderId + "/Cancel", {}, "post");
        }


        //获取联系人
        this.getContacts = function (pageModel) {
            return service.authorizedCall("Users/Self/Contacts", pageModel, "get");
        };
        //添加联系人
        this.addContact = function (model) {
            return service.authorizedCall("Users/Self/Contacts", model, "post");
        };
        //修改联系人
        this.editContact = function (contactId, model) {
            return service.authorizedCall("Users/Self/Contacts/" + contactId, model, "post");
        };
        //删除联系人
        this.deleteContact = function (contactId) {
            return service.authorizedCall("Users/Self/Contacts/" + contactId + "/Remove", {}, "post");
        };
        //---更新用户手机号
        this.updateCell = function (userModel) {
            return service.authorizedCall("Users/Self/UpdateCell", userModel, "post");
        };

        //---获取图形验证码
        this.getGenerateVerificationImage = function () {
            return service.authorizedCall("Accounts/GenerateVerificationImage", {}, "get");
        };
        //---验证身份
        this.usersSelf = function (model) {
            return service.authorizedCall("Users/Self/Verify", model, "post");
        };

        //---我的联系人模板下载
        this.downMyContact = function (model) {
            return service.authorizedCall("Utilities/Download", model, "get");
        };
        //---我的联系人批量导入
        this.importMyContact = function (model) {
            return service.authorizedCall("Users/Self/Import/Contacts", model, "post");
        };
    }

    return new userCenterServiceProxy();
});