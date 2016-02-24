//uploadify上传事件
//demo
/*$(function () {
    uploader.uploadify($('#upload-import'), uploadUrl, onUploadSuccess);
});

function onUploadSuccess(file, data) {
    console.log("file=", file);
    console.log("data=", data);
}*/
define(['uploadify'], function () {

    var uploader = {
        uploadify: function ($element, url, onSuccesCallback) {
            //初始化容器
            var id = 'random-' + Math.floor((Math.random() * 999999999) + 1);
            $element.attr('id', id);
            //为指定元素append子元素并将uplodify绑定在改element
            var uploadifyId = "#" + id + "-uploadify";
            $element.append($("<div id='" + id + "-uploadify' style='display:none;'></div>"));
            var uploaderContainer = $(uploadifyId);

            //----初始化
            var options = {
                swf: baseUrl + '/libs/uploadify/uploadify.swf',
                buttonText: "",
                uploader: url
            };
            options.onInit = function () {
                $(uploadifyId + "-queue").hide();
                $(uploadifyId + "-button").hide();
                if (!$element.css("position") || $element.css("position") == "static") {
                    $element.css("position", "relative");
                }
                $(uploadifyId).css({ "position": "absolute", "top": "0", "left": "0", "bottom": "0", "right": "0", "height": "100%", "width": "100%" });
                $(uploadifyId + " object").css({ "position": "absolute", "top": "0", "bottom": "0", "left": "0", "right": "0" })
                    .attr("height", $(uploadifyId).css("height"))
                    .attr("width", $(uploadifyId).css("width"));

            };
            options.onUploadSuccess = function (file, data, response) {
                var returnData = JSON.parse(data);
                if (onSuccesCallback != undefined) {
                    onSuccesCallback(file, returnData);
                }
            }

            try {
                uploaderContainer.uploadify('destroy');
            } catch (e) {
            }



            //----绑定uploadify
            uploaderContainer.uploadify(options);
        }
    };
    return uploader;
});


