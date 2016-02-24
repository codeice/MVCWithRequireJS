define(['jquery', 'cookie', 'blockui'], function ($) {
    var service = {
        //----无登录 无loading
        backgroundCall: function (route, param, methodType, isRequireAuthrized) {
            var result = [];
            result.$promise = null;
            var apihost = "";
            if (route.indexOf('http') >= 0) {
                apihost = route;
            } else {
                apihost = appConfig.apiServer + route;
            }

            //要求登录
            if (isRequireAuthrized) {
                apihost = apihost + "?token=" + $.cookie("userToken");
            }

            if (methodType == undefined)
                methodType = 'post';
            methodType = methodType.toLowerCase();

            if (methodType === 'post') {
                result.$promise = ajaxPost(apihost, param);
            }
            if (methodType === 'get') {
                apihost = getUrlByParams(apihost, param);
                result.$promise = $.get(apihost);
            }
            if (result.$promise != null) {
                result.$promise.then(function (response) {
                    if (response.Code === 10) {
                        window.location.href = appConfig.loginUrl;
                    } else {
                        $.extend(result, response);
                    }
                }, function (response) {
                    if (response.status == 401) {
                        window.location.href = appConfig.loginUrl;
                    }
                });
            }
            return result;
        },

        //-----带loading的call
        call: function (route, param, methodType, isRequireAuthrized) {
            var count = 0;
            var blocked = false;
            count++;
            if (!blocked) {
                blocked = true;
                $.blockUI({ message: '<h3><img src="' + baseUrl + '/Content/images/loading.gif" /> 正在加载...</h3>' });
            }
            var result = this.backgroundCall(route, param, methodType, isRequireAuthrized);
            result.$promise.always(function () {
                count--;
                if (count <= 0) {
                    setTimeout(function () {
                        if (count <= 0) {
                            blocked = false;
                            $.unblockUI();
                        }
                    }, 300);
                }
            });
            return result;
        },

        //----授权后call
        authorizedCall: function (route, param, methodType) {
            var userToken = $.cookie('userToken');
            if (userToken != null && userToken !== "") {
                return this.backgroundCall(route, param, methodType, true);
            } else {
                window.location.href = appConfig.loginUrl + "?redirectUrl=" + encodeURI(window.location.href);
            }
        },

        //----授权并带loading效果
        authorizedLoadingCall: function (route, param, methodType) {
            var userToken = $.cookie('userToken');
            if (userToken != null && userToken !== "") {
                return this.call(route, param, methodType, true);
            } else {
                window.location.href = appConfig.loginUrl + "?redirectUrl=" + encodeURI(window.location.href);
            }
        }

    };//end service


    //----将对象转化成queryString
    function getUrlByParams(apihost, param) {
        var queryParams = '?';
        if (apihost.indexOf('?') >= 0) {
            queryParams = "&";
        }
        var paramArray = [];
        for (var p in param) {
            var paramStr = p + '=' + escape(param[p]);
            paramArray.push(paramStr);
        }
        queryParams += paramArray.join('&');
        if (queryParams === '&' || queryParams === '?') {
            queryParams = '';
        }
        return apihost + queryParams;
    }

    //----ajax post
    function ajaxPost(url, param) {
        param = JSON.stringify(param);
        var promise = $.ajax({
            async: false,
            type: "post",
            url: url,
            data: param,
            dataType: "json",
            contentType: "application/json"
        });
        return promise;
    }

    return service;
});