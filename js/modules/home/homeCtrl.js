require.config(requireConfig);
define(['homeService'], function (homeService) {
    var projectHtml = '';// 小于等于20条的数据
    var moreProject = '';//大于20条的数据
    var projectLen;//获取项目总数
    $(function () {
        $("#loadMore").css("display", "none");//加载更多按钮
        $("#zhangsan").css("max-height", "68px;");
        
        //加载banner
        showBanner();
        //初始化动态加载【赛事】【项目】【地点】
        homeService.getMatchProArea().$promise.then(function (response) {

            //动态添加赛事
            var matchHtml = '<div class="indMeTop_rgt_item"><div class="leftCircle_checked"></div><div class="ctent_checked">全　部</div><div class="rgtCircle_checked"></div></div>';
            var matchObj = response.Data.Games.Options;
            for (var i = 0; i < matchObj.length; i++) {
                matchHtml += '<div class="indMeTop_rgt_item"><div class="leftCircle"></div>';
                matchHtml += '<div class="ctent" id="' + matchObj[i].Code + '">' + matchObj[i].Value + '</div>';
                matchHtml += '<div class="rgtCircle"></div></div>';
            }
            $("#autoMatch").append(matchHtml);

            //动态添加项目
            var proObj = response.Data.Projects.Options;
            projectLen = proObj.length;
            for (var m = 0; m < proObj.length; m++) {
                $("#showMoreProject").css({ "display": "none" });
                projectHtml += '<li id="' + proObj[m].Code + '" title="' + proObj[m].Value + '">' + proObj[m].Value + '</li>';
            }
            $("#autoProject").append(projectHtml);

            //----项目显示更多控制(初始化隐藏大于20条的项目内容)
            hideMore20();

            //动态添加地点
            var areaObj = response.Data.Districts.Options;
            var areaHtml = '';
            for (var n = 0; n < areaObj.length; n++) {
                areaHtml += '<li id="' + areaObj[n].Code + '">' + areaObj[n].Value + '</li>';
            }
            $("#autoArea").append(areaHtml);

            bindClick();//所有绑定事件要放在该方法里面，否则click事件无效切记！
        });

        //动态加载比赛内容
        queryCompetitions(true);
    });

    /*添加绑定事件大集合*/
    function bindClick() {
        //给选择的【月份】添加高亮样式
        $(".liMonth li").on('click', function () {
            addClickedCss(this, "nochoseMonth", "choseMonth", "initMonth", "monthValue");
        });

        //【月份】不限Click
        $(".nochoseMonth li").on('click', function () {
            clickedNoChose(this, "liMonth", "choseMonth", "initMonth", "monthValue");
        });

        //给选择的【地点】添加高亮样式
        $(".liArea li").on('click', function () {
            addClickedCss(this, "nochoseArea", "choseArea", "initArea", "areaValue");
        });
        //【地点】不限Click
        $(".nochoseArea li").on('click', function () {
            clickedNoChose(this, "liArea", "choseArea", "initArea", "areaValue");
        });

        //给选择【项目】添加高亮样式
        $(".liProject li").on('click', function () {
            addClickedCss(this, "nochoseProject", "choseProject", "initProject", "projectValue");
        });
        //【项目】不限Click
        $(".nochoseProject li").on('click', function () {
            clickedNoChose(this, "liProject", "choseProject", "initProject", "projectValue");
        });

        //删除已选【赛事】
        $("#choseMatch").on('click', function () {
            $("#choseMatch").css("display", "none");
            $("#initMatch").css("display", "block");

            //已选的赛事要变成非选状态
            $(".leftCircle_checked").removeClass("leftCircle_checked").addClass("leftCircle");
            $(".ctent_checked").removeClass("ctent_checked").addClass("ctent");
            $(".rgtCircle_checked").removeClass("rgtCircle_checked").addClass("rgtCircle");

            //全部赛事选定
            $(".indMeTop_rgt_item").first().find("div").eq(0).removeClass("leftCircle").addClass("leftCircle_checked");
            $(".indMeTop_rgt_item").first().find("div").eq(1).removeClass("ctent").addClass("ctent_checked");
            $(".indMeTop_rgt_item").first().find("div").eq(2).removeClass("rgtCircle").addClass("rgtCircle_checked");

            $("#matchValue").val("");
            queryCompetitions(true);
        });

        //删除已选择"项目"
        $("#choseProject").on('click', function () {
            delectType("choseProject", "initProject", "nochoseProject", "liProject", "projectValue");
        });
        //删除已选择"地点"
        $("#choseArea").on('click', function () {
            delectType("choseArea", "initArea", "nochoseArea", "liArea", "areaValue");
        });

        //删除已选择"时间"
        $("#choseMonth").on('click', function () {
            delectType("choseMonth", "initMonth", "nochoseMonth", "liMonth", "monthValue");
        });

        //赛事选择高亮显示banner
        $(".indMeTop_rgt_item").on('click', function () {
            //还原显示
            $(".indMeTop_rgt_item").children(".leftCircle_checked").removeClass("leftCircle_checked").addClass("leftCircle");
            $(".indMeTop_rgt_item").children(".rgtCircle_checked").removeClass("rgtCircle_checked").addClass("rgtCircle");
            $(".indMeTop_rgt_item").children(".ctent_checked").removeClass("ctent_checked").addClass("ctent");
            //给选中的赛事背景白色高亮显示
            $(this).children().first().removeClass("leftCircle ").addClass("leftCircle_checked");
            $(this).children().last().removeClass("rgtCircle").addClass("rgtCircle_checked");
            $(this).children(".ctent").removeClass("ctent").addClass("ctent_checked");

            //将选择的赛事放在当前选择里
            var matchName = $(this).children(".ctent_checked").text();
            if (matchName != "全　部") {
                $("#initMatch").css({ "display": "none" });
                $("#choseMatch").css({ "display": "block" });
                document.getElementById("choseMatch").innerHTML = matchName;
                $("#matchValue").val($(this).children(".ctent_checked").attr("id"));//添加已选择赛事值
            } else {
                $("#initMatch").css({ "display": "block" });
                $("#choseMatch").css({ "display": "none" });
                $("#matchValue").val("");//清空选择赛事值
            }
            $("#currentPage").val("1");
            queryCompetitions(true);
        });

        //加载更多
        $("#loadMore").on('click', function () {
            $("#currentPage").val(Number($("#currentPage").val()) + 1);
            queryCompetitions(false);
        });

        //----显示更多项目
        $("#showMoreProject").on('click', function () {
            $("#showMoreProject").css("display", "none");
            $("#hiddenMoreProject").css("display", "block");//显示更多项按钮隐藏
            $(".liProject li").slice(19, projectLen).show();
        });

        //----隐藏更多项目
        $("#hiddenMoreProject").on('click', function () {
            hideMore20();
        });

    }

    //----隐藏大于20条的 项目
    function hideMore20() {
        $("#showMoreProject").css("display", "block");//显示更多项按钮隐藏
        $("#hiddenMoreProject").css("display", "none");
        $(".liProject li").slice(20, projectLen).hide();
    }

    //给选中的项添加高亮样式，其他项删除高亮样式
    function addClickedCss(obj, nochoseType, choseTypeId, initTypeId, hiddenTypeId) {
        $(obj).addClass('Selected').siblings().removeClass("Selected");
        $("." + nochoseType + " li").removeClass("Selected");
        document.getElementById(choseTypeId).innerHTML = $(obj).text();//标记选择的月份
        $("#" + choseTypeId).css("display", "block");
        $("#" + initTypeId).css("display", "none");
        $("#" + hiddenTypeId).val($(obj).attr("id"));
        $("#currentPage").val("1");
        queryCompetitions(true);//比赛查询
    }

    //月份、地点、项目 不限clicked事件处理公共方法
    function clickedNoChose(obj, liType, choseTypeId, initTypeId, hiddenTypeId) {
        $("." + liType + " li").removeClass("Selected");
        $(obj).addClass('Selected');
        $("#" + choseTypeId).css("display", "none");
        $("#" + initTypeId).css("display", "block");
        $("#" + hiddenTypeId).val("");
        $("#currentPage").val("1");
        queryCompetitions(true);
    }

    //删除已选择月份、地点、项目 公共方法
    function delectType(choseTypeId, initTypeId, nochoseType, liType, hiddenTypeId) {
        $("#" + choseTypeId).css("display", "none");
        $("#" + initTypeId).css("display", "block");
        $("." + nochoseType + " li").addClass("Selected");
        $("." + liType + " li").removeClass("Selected");
        $("#" + hiddenTypeId).val("");
        $("#currentPage").val("1");
        queryCompetitions(true);
    }

    //比赛查询
    function queryCompetitions(isEmpty) {
        //清空之前的查询结果
        if (isEmpty) {
            $("#competitionsList").empty();
        }

        var pageSize = 4;//每页显示条数
        var pageIndex = Number($("#currentPage").val());
        var month = Number($("#monthValue").val().substring(5)) == 0 ? null : Number($("#monthValue").val().substring(5));
        var model = {
            "GameCode": $("#matchValue").val(),
            "ProjectCode": $("#projectValue").val(),
            "DistrictCode": $("#areaValue").val(),
            "Month": month,
            "Status": "Pass",
            "PageSize": pageSize,
            "PageIndex": pageIndex,
            "OrderByAsc": "",
            "OrderByDesc": ""
        };
        homeService.queryCompetitions(model).$promise.then(function (response) {
            var resultHtml = '';
            if (response.Data.Data.length <= 0) {
                resultHtml += '<div class="row">';
                resultHtml += '<div class="col-md-12 col-sm-12 ibb_getmore">';
                resultHtml += '<div class="ibb_getmorebtn">未查询到相关数据!</div>';
                resultHtml += '</div>';
                resultHtml += '</div>';
            }
            else { //处理页面上查询到的数据
                for (var i = 0; i < response.Data.Data.length; i++) {
                    //console.log(response.Data.Data);
                    var title = response.Data.Data[i].Title;
                    var startTime = utility.formatDate(response.Data.Data[i].StartTime);
                    var endTime = utility.formatDate(response.Data.Data[i].EndTime);
                    var venue = response.Data.Data[i].Venue == null ? "" : response.Data.Data[i].Venue;
                    var imgUri = response.Data.Data[i].IconUri == null ? "" : response.Data.Data[i].IconUri;
                    var enrolledCount = response.Data.Data[i].EnrolledCount == null ? 0 : +response.Data.Data[i].EnrolledCount;
                    resultHtml += '<div class="col-md-6 col-sm-12">';
                    resultHtml += '<div class="searchresultDiv ">';
                    resultHtml += '<div class="ibbctnt_pic"><img class="homeImg" src="' + imgUri + '"/></div>';
                    resultHtml += '<div class="ibbctnt_ctnt">';
                    resultHtml += '<div class="ibbctntc_nm">' + title + '</div>';
                    resultHtml += '<div class="ibbctntc_time">' + startTime + '-' + endTime + '</div>';
                    resultHtml += '<div class="ibbctntc_time ibbctntc_adrs">' + venue + '</div>';
                    resultHtml += '<div class="ibbctntc_price">';
                    resultHtml += '<div class="ibbctntcp_prc">';
                    resultHtml += '已报名<span>' + enrolledCount + '</span>人';
                    resultHtml += '</div>';
                    resultHtml += '<div class="ibbctntcp_btn" id="' + response.Data.Data[i].CompetitionKey + '">查看详情</div>';
                    resultHtml += '</div>';
                    resultHtml += '</div>';
                    resultHtml += '</div>';
                    resultHtml += '</div>';
                }
            }
            $("#competitionsList").append(resultHtml);
            //处理加载更多现实与否
            var countResult = response.Data.RecordCount;//查询结果总记录条数
            var currentPage = $("#currentPage").val();
            (Number(pageSize) * Number(currentPage)) >= countResult ? $("#loadMore").css("display", "none") : $("#loadMore").css("display", "block");

            //立即报名
            $(".ibbctntcp_btn").on('click', function () {
                var key = $(this).attr("id");
                location.href = baseUrl + "home/matchDetail?CompetitionKey=" + key;
            });
        });
    }

    //banner动态加载
    function showBanner() {
        homeService.showBanner("web", 4).$promise.then(function (response) {
            if (response.Code == 0) {
                var bannerImgHtml = '';
                var bannerLiHtml = '';
                for (var b = 0; b < response.Data.length; b++) {
                   // bannerImgHtml += '<a href="' + response.Data[b].RedirectUrl + '" target="_blank"><img src="' + response.Data[b].Url + '" class="d1"/></a>';
                    bannerImgHtml += '<a><img src="' + response.Data[b].Url + '" class="d1"/></a>';
                    bannerLiHtml += '<li></li>';
                }
                bannerImgHtml += '<div class="d2" id="banner_id">';
                bannerImgHtml += '<ul>';
                bannerImgHtml += bannerLiHtml;
                bannerImgHtml += '</ul>';
                bannerImgHtml += '</div>';
                $("#banner").append(bannerImgHtml);
            }

            //设置Banner中ul屏幕居中
            var ulMarginLWidth = (response.Data.length * 23) / 2;
            $("#banner_id ul").css("marginLeft", -ulMarginLWidth);

            banner();
        });
    }

    //banner轮播
    function banner() {
        var bnId = 0;
        var bnId2 = 1;
        var speed33 = 5000;
        var qhjg = 1;
        var myMar33;
        $("#banner .d1").hide();
        $("#banner .d1").eq(0).fadeIn("slow");
        if ($("#banner .d1").length > 1) {
            $("#banner_id li").eq(0).addClass("nuw");
            function marquee33() {
                bnId2 = bnId + 1;
                if (bnId2 > $("#banner .d1").length - 1) {
                    bnId2 = 0;
                }
                $("#banner .d1").eq(bnId).css("z-index", "2");
                $("#banner .d1").eq(bnId2).css("z-index", "1");
                $("#banner .d1").eq(bnId2).show();
                $("#banner .d1").eq(bnId).fadeOut("slow");
                $("#banner_id li").removeClass("nuw");
                $("#banner_id li").eq(bnId2).addClass("nuw");
                bnId = bnId2;
            };

            myMar33 = setInterval(marquee33, speed33);

            $("#banner_id li").click(function () {
                var bnId3 = $("#banner_id li").index(this);
                if (bnId3 != bnId && qhjg == 1) {
                    qhjg = 0;
                    $("#banner .d1").eq(bnId).css("z-index", "2");
                    $("#banner .d1").eq(bnId3).css("z-index", "1");
                    $("#banner .d1").eq(bnId3).show();
                    $("#banner .d1").eq(bnId).fadeOut("slow", function () { qhjg = 1; });
                    $("#banner_id li").removeClass("nuw");
                    $("#banner_id li").eq(bnId3).addClass("nuw");
                    bnId = bnId3;
                }
            });
            $("#banner_id").hover(
                function () {
                    clearInterval(myMar33);
                },
                function () {
                    myMar33 = setInterval(marquee33, speed33);
                }
            );
        }
        else {
            $("#banner_id").hide();
        }
    }

});