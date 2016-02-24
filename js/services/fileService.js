define(['js/common/service'], function (service) {

    function fileServiceProxy() {

        // ----上传文件
        this.getUploaderUrl = function () {
            return appConfig.apiServer + "Utilities/Upload";
        };

        //----下载模板
        this.downloadTemplate = function (templateName) {
            service.backgroundCall("File/DownloadTemplate", { name: templateName }, "post").$promise.then(function (response) {
                if (response.data.Code == 0) {
                    var fileUrl = response.data.Result;
                    if (fileUrl.indexOf('http') < 0) {
                        fileUrl = window.location.protocol + "//" + window.location.host + fileUrl;
                    }
                    window.open(fileUrl);
                } else {
                    bootbox.alert(response.data.ErrorMessage);
                }
            }, function () {
                bootbox.alert("下载文件失败");
            });
        };

    }

    return new fileServiceProxy();
});