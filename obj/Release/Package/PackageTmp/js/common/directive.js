define(['app'], function (app) {

    //----验证身份证
    app.directive("validIdCardNo", function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                var reg = new RegExp(patterns.idCardNo);
                ngModelCtrl.$parsers.push(function (viewValue) {
                    if (reg.test(viewValue) || viewValue == undefined || viewValue === "") {
                        ngModelCtrl.$setValidity('validIdCardNo', true);
                        return viewValue;
                    } else {
                        ngModelCtrl.$setValidity('validIdCardNo', false);
                        return viewValue;
                    }
                });
            }
        };
    });

    //----验证手机号
    app.directive("validMobile", function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                var reg = new RegExp(patterns.mobile);
                ngModelCtrl.$parsers.push(function (viewValue) {
                    if (reg.test(viewValue) || viewValue == undefined || viewValue === "") {
                        ngModelCtrl.$setValidity('validMobile', true);
                        return viewValue;
                    } else {
                        ngModelCtrl.$setValidity('validMobile', false);
                        return viewValue;
                    }
                });
            }
        };
    });

    //----验证必填
    app.directive("validRequired", function () {
        return {
            restrict: 'A',
            scope: {
                isShow: '=validRequired'
            },
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$parsers.push(function (viewValue) {
                    if (scope.isShow && viewValue != undefined && viewValue !== "") {
                        ngModelCtrl.$setValidity('validRequired', true);
                        return viewValue;
                    } else {
                        ngModelCtrl.$setValidity('validRequired', false);
                        return viewValue;
                    }
                });
            }
        };
    });
});