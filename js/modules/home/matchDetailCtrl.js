require.config(requireConfig);

define(['angular', '../js/services/homeService.js', '../js/common/utility.js'], function (angular, homeService) {


    //判断要显示的文字内容
    function setLblText(arrName, code) {
        for (var i = 0; i < arrName.length; i++) {
            if (code == null) {
                return "";
            } else if (arrName[i].Code == code) {
                return arrName[i].Value;
            }
        }
    }

    var app = angular.module("matchDetailApp", []).filter('gender', function () {
        return function (input) {
            return setLblText(constants.gendersAll, input);
        };
    }).filter('projectType', function () { //----项目类型过滤器
        return function (input) {
            return setLblText(constants.projectType, input);
        };
    }).filter('signUpType', function () { //----报名类型过滤器
        return function (input) {
            return setLblText(constants.signUpType, input);
        };
    }).filter('img', function () {
        return function (input) {
            return input == null ? "" : input;
        };
    }).filter('formatDate', function () {
        return function (input) {
            return utility.formatDate(input);
        };
    }).filter('formatNull', function () {
        return function (input) {
            return input == null ? "" : input;
        };
    }).filter('signStatus', function () {
        return function (input) {
            return setLblText(constants.signStatus, input);
        };
    });


    $(function () {
        var competitionKey = utility.getQueryParameter("CompetitionKey");
        $(".btnSignup-true").attr('disabled', "true");
        $(".btnSignup-false").attr('disabled', "false");

        app.controller("matchDetailCtrl", ['$scope', function ($scope) {
            //----获取赛事详情
            homeService.getMatchDetail(competitionKey).$promise.then(function (response) {
                if (response.Code === 0) {
                    $scope.$apply(function () {
                        $scope.objData = response.Data;
                        $scope.signUpStatus = response.Data.SignUpStatus == "SignUping" ? true : false;
                        var feeMax = response.Data.SignUpFeeMax == null ? "0" : response.Data.SignUpFeeMax;
                        var feeMin = response.Data.SignUpFeeMin == null ? "0" : response.Data.SignUpFeeMin;
                        $scope.signUpFeeHtml = feeMax == feeMin ? feeMin : feeMin + '-' + feeMax;
                        $scope.projects = response.Data.Projects;
                        var location = $scope.objData.Location == null ? "" : "　比赛地点：" + $scope.objData.Location;
                        var showText = $scope.objData.Title + "　比赛时间：" + utility.formatDate($scope.objData.StartTime) + "至"
                            + utility.formatDate($scope.objData.EndTime) + location;
                        window.baiduShare.setShareText(showText);
                    });
                }

                //----立即报名，竞赛章程里的马上报名
                $("#signUp-btn,.signUp").on('click', function () {
                    location.href = baseUrl + "signUp/Apply?CompetitionKey=" + competitionKey;
                });
                $(".btnSignup-true").on('click', function () {
                    window.location.href = baseUrl + "SignUp/Apply?CompetitionKey=" + competitionKey;
                });
            });

            //----其他赛事
            homeService.getOtherMatch(competitionKey, 4).$promise.then(function (result) {
                if (result.Code == 0 && result.Data != null) {
                    $scope.$apply(function () {
                        $scope.otherProjects = result.Data;
                    });
                }

                //【其他赛事】查看比赛详情
                $(".otherLi-btn").on('click', function () {
                    window.location.href = baseUrl + "home/matchDetail?CompetitionKey=" + $(this).attr("id");
                });
            });

        }]);

        var element = $("#matchDetailApp");
        angular.bootstrap(element, ["matchDetailApp"]);

    });

});