define(['js/common/service'], function (service) {

    function signUpServiceProxy() {

        //----获取赛事项目信息
        this.getCompetitionProjects = function (competitionKey) {
            return service.call("Competitions/" + competitionKey + "/Projects", {}, "get");
        };

        //----获取赛事项目表单信息
        this.getProjectForm = function (competitionKey, projectCode) {
            return service.backgroundCall("Competitions/" + competitionKey + "/Projects/" + projectCode + "/form", {}, "get");
        };

        //----获取某赛事下已经保存的报名信息
        this.getRegistrationsByKey = function (competitionKey) {
            return service.authorizedCall("SignUp/" + competitionKey + "/Combinations", {}, "get");
        };

        //----获取我的所有报名信息
        this.getAllRegistrations = function () {
            return service.authorizedCall("SignUp/All", {}, "get");
        };

        //----删除已保存的报名组
        this.deleteCombination = function (competitionKey, combinationKey) {
            return service.authorizedCall("SignUp/" + competitionKey + "/Combinations/" + combinationKey + "/Remove", {}, "post");
        };

        //----获取常用联系人
        this.getFrequentContacts = function () {
            return service.authorizedCall("Users/Self/Contacts/All", {}, "get");
        };

        //----保存组合报名报名信息
        this.saveSignUp = function (competitionKey, model) {
            return service.authorizedCall("SignUp/" + competitionKey + "/Combinations", model, "post");
        };

        //----获取我创建的报名队伍
        this.getMyTeams = function (competitionKey) {
            return service.authorizedCall("Users/Self/Teams", { competitionId: competitionKey }, "get");
        }

        //----检查队伍名称是存在
        this.checkTeamNameIsExsit = function (competitionKey, teamName) {
            return service.authorizedCall("SignUp/" + competitionKey + "/Teams/" + teamName + "/Exists", {}, "post");
        }

        //----保存队伍信息
        this.saveTeam = function (competitionKey, model) {
            return service.authorizedCall("SignUp/" + competitionKey + "/Teams", model, "post");
        }

        //----提交赛事下所有报名信息
        this.submitOrders = function (model) {
            return service.authorizedCall("Orders", model, "post");
        };

        //----根据oderIds获取单列表
        this.getOrders = function (orderIds) {
            return service.authorizedCall("BatchOrders/Summary", orderIds, "post");
        };

        //----微信支付
        this.weChatPay = function (orderIds) {
            //todo 
            return service.authorizedCall("WeChatPay", orderIds, "post");
        };

        //----支付宝支付
        this.aliPay = function (orderIds) {
            //todo  等待max接口
            return service.authorizedCall("AliPay", orderIds, "post");
        };

        //----获取报名完成订单
        this.getCompleteOrders = function (orderIds) {
            return service.authorizedCall("BatchOrders/Result", orderIds, "post");
        };


    }

    return new signUpServiceProxy();
});