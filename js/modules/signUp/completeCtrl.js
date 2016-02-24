require.config(requireConfig);
define(['../js/services/signUpService.js'], function (signUpService) {

    //获取订单Ids
    var orderIds = appConfig.splitOrderIds(utility.getQueryParameter("orderIds"));
    //----获取订单列表
    signUpService.getCompleteOrders(orderIds).$promise.then(function (response) {
        if (response.Code === 0) {
            renderPage(response.Data);
        } else {
            bootbox.alert(response.Message);
        }
    });

    //----绘制页面
    function renderPage(orders) {
        var htmlStr = "";
        for (var i = 0; i < orders.length; i++) {
            var order = orders[i];
            htmlStr += '<div class="complete-online-msg">' +
                                '<img src="/CE.Portal/Content/images/completeInfo.png" />' + order.CompetitionName + '（<label>' + order.PlayerCount + '人</label>）' +
                          '</div>';
        }
        $('.complete-online-div').html(htmlStr);
    }


});