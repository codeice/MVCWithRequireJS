require.config(requireConfig);
define(['userCenterService'], function (userCenterService) {
    //userCenterService.getmyScoreData().$promise.then(function (response) {
    //response.Data.Data;
    //console.log("response=", myScoreData);
    //});
    var myScoreData = {
        "Data": {
            "PageIndex": 1,
            "PageSize": 2,
            "RecordCount": 3,
            "PageCount": 2,
            "Data": [
              {
                  "CompetitionKey": "sample string 1",
                  "CompetitionName": "女子双排",
                  "StartTime": "2016-01-26T11:32:10.4339165+08:00",
                  "EndTime": "2016-01-26T11:32:10.4339165+08:00",
                  "ProjectNames": [
                    "接力赛跑",
                    "T台跳水"
                  ],
                  "Score": 500,
                  "PaiMing":3
              },
              {
                  "CompetitionKey": "sample string 1",
                  "CompetitionName": "男子双排",
                  "StartTime": "2016-01-30T11:32:10.4339165+08:00",
                  "EndTime": "2016-01-30T11:32:10.4339165+08:00",
                  "ProjectNames": [
                    "100米赛跑",
                    "300kg举重"
                  ],
                  "Score": 600,
                  "PaiMing": 2
              },
              {
                  "CompetitionKey": "sample string 1",
                  "CompetitionName": "男子双排",
                  "StartTime": "2016-01-30T11:32:10.4339165+08:00",
                  "EndTime": "2016-01-30T11:32:10.4339165+08:00",
                  "ProjectNames": [
                    "100米赛跑",
                    "300kg举重"
                  ],
                  "Score": 600,
                  "PaiMing": 2
              },
              {
                  "CompetitionKey": "sample string 1",
                  "CompetitionName": "男子双排",
                  "StartTime": "2016-01-30T11:32:10.4339165+08:00",
                  "EndTime": "2016-01-30T11:32:10.4339165+08:00",
                  "ProjectNames": [
                    "100米赛跑",
                    "300kg举重"
                  ],
                  "Score": 600,
                  "PaiMing": 2
              }
            ]
        },
        "Code": 0,
        "Message": "sample string 1"
    };
    var myScoreStr = ''; //我的成绩
    renderDiv();

    //绘制页面
    function renderDiv() {
        for (var i = 0; i < myScoreData.Data.Data.length; i++) {
            myScoreStr += '<div class="myEvent col-md-5">' +
                            '<ul>' +
                                '<li><b>赛事</b><label>' + myScoreData.Data.Data[i].CompetitionName + '</label></li>' +
                                '<li><b>项目</b><label>' + myScoreData.Data.Data[i].ProjectNames.join(",") + '</label></li>' +
                                '<li><b>成绩</b><label>' + myScoreData.Data.Data[i].Score + '</label><b class="TotalSeniority">总排名</b><label>' + myScoreData.Data.Data[i].PaiMing + '</label></li>' +
                            '</ul>' +
                          '</div>';
        }
        //console.log("myScoreStr=", myScoreStr);
        //$('#myScoreInfo').html(myScoreStr);
        $('#myScoreInfo').append(myScoreStr);
    }
});