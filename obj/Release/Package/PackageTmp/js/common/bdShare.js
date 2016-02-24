(function () {
    window._bd_share_config = {
        "common": {
            "bdSnsKey": {},
            "bdText": "",
            "bdMini": "2",
            "bdMiniList": false,
            "bdPic": "",
            "bdStyle": "0",
            "bdSize": "16"
        },
        "share": {},
        "image": {
            "viewList": ["tsina", "weixin"],
            "viewText": "分享到：",
            "viewSize": "16"
        },
        /*        "selectShare": {
                    "bdContainerClass": null,
                    "bdSelectMiniList": ["tsina", "weixin"]
                }*/
    };

    function addBdShareScripts() {
        $(function () {
            var baiduShare = document.createElement("script");
            baiduShare.type = "text/javascript";
            baiduShare.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);
            document.body.appendChild(baiduShare);
        });
    }

    //----百度分享
    window.baiduShare = {
        setShareText: function (shareText) {
            if (shareText !== "") {
                window._bd_share_config.common.bdText = shareText;
            }
            addBdShareScripts();
        }
    };

})();
