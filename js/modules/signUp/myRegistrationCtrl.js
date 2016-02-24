require.config(requireConfig);
define(['angular', 'signUpService', 'nestable'], function (angular, signUpService) {

    var app = angular.module("registrationApp", []);

    app.filter("genderFormat", function () {
        return function (input) {
            if (input == null) {
                return "";
            }
            var result = input.toLowerCase() === "female" ? "女" : "男";
            return result;
        }
    });

    app.controller("myRegistrationCtrl", ['$scope', '$timeout', function ($scope, $timeout) {

        //----全选或者全不选
        $scope.checkAllOrNot = function (competition) {
            for (var i = 0; i < competition.Projects.length; i++) {
                var project = competition.Projects[i];
                if (competition.checked) {
                    project.checked = true;
                } else {
                    project.checked = false;
                }
            }
        }

        //----级联修改父级选中状态与否
        $scope.cascadeChangeParent = function (copetition, project) {
            if (!project.checked) {
                copetition.checked = false;
            }
        }

        //----获取报名信息
        signUpService.getAllRegistrations().$promise.then(function (response) {
            $timeout(function () {
                $scope.competitions = response.Data;
            }, 0);
        });

        //----删除报名组合
        $scope.deleteCombination = function (competition, combination) {
            signUpService.deleteCombination(competition.CompetitionKey, combination.CombinationKey).$promise.then(function () {
                for (var i = 0; i < competition.Projects.length; i++) {
                    var project = competition.Projects[i];
                    for (var j = 0; j < project.Combinations.length; j++) {
                        var group = project.Combinations[j];
                        if (combination.CombinationKey === group.CombinationKey) {
                            project.Combinations.remove(combination);
                            competition.CombinationCount--;
                            competition.TotalCost = competition.TotalCost - project.Cost;
                            if (project.Combinations.length === 0) {
                                competition.Projects.remove(project);
                            }
                            if (competition.Projects.length === 0) {
                                $scope.competitions.remove(competition);
                            }
                        }
                    }
                }
            });
        }


        //---确认所有选中的赛事项目报名信息
        function getAllCheckCombinations() {
            var toBeSumitedItems = [];
            for (var i = 0; i < $scope.competitions.length; i++) {
                var competition = $scope.competitions[i];
                var item = {
                    CompetitionKey: competition.CompetitionKey,
                    Combinations: []
                };
                for (var j = 0; j < competition.Projects.length; j++) {
                    var project = competition.Projects[j];
                    if (project.checked) {
                        for (var k = 0; k < project.Combinations.length; k++) {
                            var group = project.Combinations[k];
                            item.Combinations.push({
                                CombinationKey: group.CombinationKey,
                                CombinationName: group.CombinationName,
                                CombinationType: group.CombinationType
                            });
                        }//end for k
                    }//end for if project.checked
                }//end for j

                if (item.Combinations.length !== 0) {
                    toBeSumitedItems.push(item);
                }
            }//end for i

            return toBeSumitedItems;
        }

        //---提交订单
        $scope.submitAll = function () {
            var toBeSubmitedModel = getAllCheckCombinations();
            console.log("toBeSubmitedModel=", toBeSubmitedModel);
            if (toBeSubmitedModel.length === 0) {
                bootbox.alert("请选择您要提交的订单！");
                return;
            }
            signUpService.submitOrders(toBeSubmitedModel).$promise.then(function (response) {
                if (response.Code === 0) {
                    var orders = response.Data;
                    var orderIds = [];
                    for (var i = 0; i < orders.length; i++) {
                        var order = orders[i];
                        orderIds.push(order.Key);
                    }
                    appConfig.goToPayPage(orderIds);

                } else {
                    response.Message = response.Message == null ? "提交订单失败" : response.Message;
                }
            });
        }

    }]);

    var element = $("#registrationApp");
    angular.bootstrap(element, ["registrationApp"]);

});