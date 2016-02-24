require.config(requireConfig);
define(['angular', '../js/services/signUpService.js'], function (angular, signUpService) {



    var app = angular.module("payApp", []);
    app.controller("payCtrl", ['$scope', '$sce', '$timeout', function ($scope, $sce, $timeout) {

        //----默认支付方式
        $scope.payType = constants.payType.aliPay;

        $scope.orderIds = appConfig.splitOrderIds(utility.getQueryParameter("orderIds"));
        $scope.weChatPayUrl = $sce.trustAsResourceUrl(appConfig.payRootUrl + "WxPayAPI/Pay/NativePayPage.aspx?orderIds=" + utility.getQueryParameter("orderIds"));

        //----获取订单信息
        signUpService.getOrders($scope.orderIds).$promise.then(function (response) {
            if (response.Code === 0) {
                $timeout(function () {
                    $scope.orders = response.Data;
                    $scope.startTime = utility.formatDate(response.Data.StartTime);
                    $scope.endTime = utility.formatDate(response.Data.EndTime);

                    var total = 0;
                    var boolUnPaid = false;
                    var boolRefunded = false;
                    for (var i = 0; i < $scope.orders.length; i++) {
                        total += $scope.orders[i].Balance;
                        if (response.Data[i].PayStatus == "Unpaid") {
                            boolUnPaid = true;
                        }
                        if (response.Data[i].PayStatus == "Refunded") {
                            boolRefunded = true;
                        }
                    }
                    //走正常流程
                    if (boolUnPaid) {
                        //---订单金额
                        if (total == 0) {
                            //1.隐藏支付方式2.步骤提示“确认订单”3.确认订单按钮显示
                            $("#total0").hide();
                            $("#total0Confirm").show();
                            $("#total0Text").text("确认订单");
                        } else {
                            $("#total0").show();
                            $("#total0Confirm").hide();
                            $("#total0Text").text("支付报名费");
                        }
                    } else if (boolRefunded) {
                        $("#total0").hide();
                        $("#total0Confirm").hide();
                        bootbox.alert("订单中包含已退款订单，不能继续下面的操作！");
                        return;
                    } else {
                        //直接跳转到支付完成页面
                        appConfig.goToCompletePage($scope.orderIds);
                    }
                }, 0);
            }
        });

        //----微信支付
        $scope.weChatPay = function () {
            appConfig.goToCompletePage($scope.orderIds);
        };

        //----ali支付
        $scope.aliPay = function () {
            var payUrl = appConfig.payRootUrl + "PayCenter/PayPage/Pay/AliPayCreateDirectPayByUserSubmit?orderIds=" + $scope.orderIds.join('|');
            window.open(payUrl);

            //appConfig.goToCompletePage($scope.orderIds);
        };

        //--确认订单
        $scope.confirmOrder = function () {
            appConfig.goToCompletePage($scope.orderIds);
        };

        //---支付遇到问题
        $scope.payError = function () {
            orderPay();
        };

        //---支付完成
        $scope.payFinish = function () {
            orderPay();
        };

        //---订单支付
        function orderPay() {
            signUpService.getOrders($scope.orderIds).$promise.then(function (response) {
                if (response.Code == 0) {
                    var boolPayStatus = true;
                    for (var i = 0; i < $scope.orders.length; i++) {
                        if (response.Data[i].PayStatus == "Unpaid") {
                            boolPayStatus = false;
                        }
                    }
                    if (boolPayStatus) {
                        appConfig.goToCompletePage($scope.orderIds);//支付完成
                    } else {
                        bootbox.confirm("支付出现异常，请在未支付订单中重新支付。", function (result) {
                            if (result) {
                                window.location.href = baseUrl + "UserCenter#myOrder";
                            }
                        });

                    }
                }
            });
        }

    }]);

    var element = $("#payApp");
    angular.bootstrap(element, ["payApp"]);
});
