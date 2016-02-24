define(['angular', 'userCenterService', 'nestable'], function (angular, userCenterService) {

    var app = angular.module("orderApp", []);
    app.filter('payStatusFormat', function () {
        return function (input) {
            if (input == null) {
                return "";
            }
            var result = "";
            if (input === constants.payStatus.paid) {
                result = "已支付";
            }
            if (input === constants.payStatus.upPaid) {
                result = "未支付";
            }
            if (input === constants.payStatus.canceled) {
                result = "已取消";
            }
            return result;
        };
    });

    app.controller("myOrderCtrl", ['$scope', function ($scope) {

        /////////////////////////////////待支付///////////////////////////////////
        //----未支付订单
        userCenterService.getUnPaidOrders().$promise.then(function (response) {
            if (response.Code === 0) {
                $scope.$apply(function () {
                    $scope.toBePaidOrders = response.Data;
                    $scope.getSum();
                });
            } else {
                bootbox.alert(response.Message);
            }
        });

        //----获取未支付订单总额
        $scope.getSum = function () {
            $scope.toBePaidSum = 0;
            for (var i = 0; i < $scope.toBePaidOrders.length; i++) {
                var order = $scope.toBePaidOrders[i];
                if (order.checked) {
                    $scope.toBePaidSum += order.Balance;
                }
            }
        }

        //----全选
        $scope.checkAll = function () {
            for (var i = 0; i < $scope.toBePaidOrders.length; i++) {
                var order = $scope.toBePaidOrders[i];
                if ($scope.isAllChecked) {
                    order.checked = true;
                } else {
                    order.checked = false;
                }
            }
            $scope.getSum();
        }

        //----获取选中的订单
        function getCheckedOrders() {
            var checkedOrderIds = [];
            for (var i = 0; i < $scope.toBePaidOrders.length; i++) {
                var order = $scope.toBePaidOrders[i];
                if (order.checked) {
                    checkedOrderIds.push(order.Key);
                }
            }
            return checkedOrderIds;
        }

        //----取消所选择的订单
        $scope.cancelOrder = function (orderId) {
            debugger;
            userCenterService.cancelOrder(orderId).$promise.then(function (response) {
                if (response.Code === 0) {
                    bootbox.alert("订单取消成功");
                } else {
                    bootbox.alert(response.Message);
                }
            });
        }

        //----前往支付
        $scope.goToPay = function () {
            var orderIds = getCheckedOrders();
            if (orderIds.length === 0) {
                bootbox.alert("请选择你要支付的订单！");
                return;
            } else {
                appConfig.goToPayPage(orderIds);
            }
        }

        /////////////////////////////////已支付订单////////////////////////////////
        $scope.paidSearchModel = {
            PayStatus: constants.payStatus.paid,
            PageSize: 6,
            PageIndex: 1
        };

        //----获取已支付订单
        $scope.getPaidOrders = function (pageNumber) {
            if (pageNumber != undefined) {
                $scope.paidSearchModel.PageIndex = pageNumber;
            }
            userCenterService.getMyOrders($scope.paidSearchModel).$promise.then(function (response) {
                if (response.Code === 0) {
                    $scope.$apply(function () {
                        $scope.paidOrders = response.Data.Data;
                        $scope.paidSearchModel.PageIndex = response.Data.PageIndex;
                        $scope.paidSearchModel.PageSize = response.Data.PageSize;
                        $scope.paidSearchModel.PageCount = response.Data.PageCount;
                    });
                } else {
                    bootbox.alert(response.Message);
                }
            });
        }

        //---翻页
        $scope.changePage = function (pageNumber) {
            $scope.getPaidOrders(pageNumber);
        }

        /////////////////////////////////所有订单////////////////////////////////
        $scope.allSearchModel = {
            PayStatus: "",
            PageSize: 6,
            PageIndex: 1
        };

        //----获取已支付订单
        $scope.getAllOrders = function (pageNumber) {
            if (pageNumber != undefined) {
                $scope.allSearchModel.PageIndex = pageNumber;
            }
            userCenterService.getMyOrders($scope.allSearchModel).$promise.then(function (response) {
                if (response.Code === 0) {
                    $scope.$apply(function () {
                        $scope.allOrders = response.Data.Data;
                        $scope.allSearchModel.PageIndex = response.Data.PageIndex;
                        $scope.allSearchModel.PageSize = response.Data.PageSize;
                        $scope.allSearchModel.PageCount = response.Data.PageCount;
                    });
                } else {
                    bootbox.alert(response.Message);
                }
            });
        }

        //---翻页
        $scope.changeAllOrderPage = function (pageNumber) {
            $scope.getAllOrders(pageNumber);
        }

    }]);

    var element = $("#orderApp");
    angular.bootstrap(element, ["orderApp"]);

})