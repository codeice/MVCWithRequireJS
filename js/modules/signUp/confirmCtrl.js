require.config(requireConfig);
define(['angular', '../js/services/signUpService.js'], function (angular, signUpService) {

    var app = angular.module("confirmApp", []).filter('gender', function () {
        return function (input) {
            return input == "Male" ? "男" : "女";
        };
    });

    $(function () {
        $(".projectMain").parent().find(".projectList").show();
        $(".projectMain").addClass("minus");

        $(".projectMain").on("click", function () {
            if ($(this).hasClass("minus")) {
                $(this).parent().find(".projectList").hide();
                $(this).removeClass("minus");
            } else {
                $(this).parent().find(".projectList").show();
                $(this).addClass("minus");
            }
        });

        //查询报名信息
        app.controller("confirmCtrl", [
            '$scope', function ($scope) {
                $scope.competitionKey = utility.getQueryParameter("CompetitionKey");
                initForm();

                //删除组合信息
                $scope.delCombinations = function (combination) {
                    bootbox.confirm("确认删除数据？", function (result) {
                        if (result) {
                            signUpService.deleteCombination($scope.competitionKey, combination.CombinationKey).$promise.then(function (response) {
                                if (response.Code == 0) {
                                    initForm();
                                } else {
                                    bootbox.alert(response.Message);
                                }
                            });
                        }
                    });
                };

                //确认订单（提交订单）
                $scope.submitOrder = function () {

                    var competitionSignUp = [
                        {
                            CompetitionKey: $scope.competitionKey,
                            CompetitionName: $scope.competitionName,
                            Combinations: []
                        }
                    ];
                    for (var i = 0; i < $scope.savedSignUpInfos.Projects.length; i++) {
                        var project = $scope.savedSignUpInfos.Projects[i];
                        for (var j = 0; j < project.Combinations.length; j++) {
                            var combination = project.Combinations[j];
                            combination.ProjectKey = project.ProjectKey;
                            combination.ProjectName = project.ProjectName;
                            competitionSignUp[0].Combinations.push(combination);
                        };
                    }

                    signUpService.submitOrders(competitionSignUp).$promise.then(function (response) {
                        if (response.Code == 0) {
                            var orderIds = [];
                            for (var i = 0; i < response.Data.length; i++) {
                                var order = response.Data[i];
                                orderIds.push(order.Key);
                            }
                            appConfig.goToPayPage(orderIds);
                        } else {
                            bootbox.alert(response.Message);
                        }
                    });
                };

                //初始化窗体信息
                function initForm() {
                    signUpService.getRegistrationsByKey($scope.competitionKey).$promise.then(function (response) {
                        $scope.$apply(function () {
                            $scope.savedSignUpInfos = response.Data;
                            $scope.projects = response.Data.Projects; //赛事项目
                            $scope.members = response.Data.Projects.Members;
                        });
                    });
                }
            }
        ]);



        var element = $("#confirmApp");
        angular.bootstrap(element, ["confirmApp"]);

    });

});