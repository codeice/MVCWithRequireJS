define(['js/common/service'], function (service) {

    function homeServiceProxy() {
        //【首页】获取赛事配置 赛事、项目、地点
        this.getMatchProArea = function () {
            return service.call("Competitions/QueryOptions", {}, "get");
        };

        //【首页】比赛查询
        this.queryCompetitions = function (model) {
            return service.call("Competitions/QueryCompetitions", model, "get");
        };

        //【首页】banner
        this.showBanner = function (bannerType, num) {
            return service.call("Advertise/Banners?bannerType=" + bannerType + "&num=" + num, {}, "get");
        };

        //【赛事详情】获取赛事详情（根据赛事id）
        this.getMatchDetail = function (competitionKey) {
            return service.call("Competitions/" + competitionKey + "/Details", {}, "get");
        };

        //【赛事详情】获取其他赛事（4条）
        this.getOtherMatch = function (competitionKey, num) {
            return service.call("Competitions/" + competitionKey + "/Associated?num=" + num, {}, "get");
        };



    }

    return new homeServiceProxy();

});