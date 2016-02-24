
define(['userCenterService'], function (userCenterService) {
    var pageModel = {
        PageIndex: 1,
        PageSize: 6
    };

    getContactsData();

    //上一页
    $('#Events_Prev').click(function () {
        if (pageModel.PageIndex != 1) {
            pageModel.PageIndex--;
            getContactsData();
        }
    });
    //下一页
    $('#Events_Next').click(function () {
        if (pageModel.PageIndex < event_pageCount) {
            pageModel.PageIndex++;
            getContactsData();
        }
    });

    //根据PageIndex和PageSize获取联系人信息
    function getContactsData() {
        userCenterService.getMyEvents(pageModel).$promise.then(function (response) {
            myEventsInfo = response.Data.Data;
            event_pageCount = response.Data.PageCount;
            if (response.Code != 20 && response.Data.Data != '') {
                renderDiv();
                $('#Events_PageCount').html(response.Data.PageCount);
                $('#Events_PageIndex').html(response.Data.PageIndex);
            }
        });
    }
        
    var EventStatusStr = ''; //赛事状态
    //绘制页面
    function renderDiv() {
        var myEventData = '';
        var startTime = '';
        for (var i = 0; i < myEventsInfo.length; i++) {
            if (new Date(myEventsInfo[i].EndTime).toLocaleDateString() < new Date().toLocaleDateString()) {
                EventStatusStr = '<div class="eventStatus eventClose">已结束</div>';
            }
            else {
                EventStatusStr = '<div class="eventStatus eventOpen" onclick="window.open(\'home/matchDetail?CompetitionKey=' + myEventsInfo[i].CompetitionKey + '\');">详情</div>';
            }
            startTime = myEventsInfo[i].StartTime == null ? '' : myEventsInfo[i].StartTime.substring(0, 10);
            myEventData += '<div class="myEvent col-md-5">' +
                            '<ul>' +
                            '<li><b>赛事名称</b><label>' + myEventsInfo[i].CompetitionName + '</label></li>' +
                            '<li><b>项目名称</b><label>' + myEventsInfo[i].ProjectNames.join(",") + '</label></li>' +
                            '<li><b>开始时间</b><label>' + startTime + '</label>' + EventStatusStr + '</li>' +
                            '</ul>' +
                          '</div>';
        }
        $('#event-wrapper').html(myEventData);
    }
});