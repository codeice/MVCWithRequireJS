define([], function () {
    //---验证表单
    var form = {
        isFormValid: true,
        validateForm: function (obj) {
            //错误列表ID
            errorId = obj;
            $(".control-group input[data-verify]").each(function () {
                var verifyType = $(this).attr("data-verify");
                switch (verifyType) {
                    case "required":
                        $(this).blur(function () {
                            verifyRequired($(this));
                        });
                        break;
                    case "idcard":
                        $(this).blur(function () {
                            verifyIdCardNo($(this));
                        });
                        break;
                    case "phone":
                        $(this).blur(function () {
                            verifyPhone($(this));
                        });
                        break;
                    case "email":
                        $(this).blur(function () {
                            verifyEmail($(this));
                        });
                        break;
                }
            });
        }
    }

    //---添加错误验证信息
    function addErrorMsg($this) {
        $this.parent(".control-group").addClass("has-error");
        var $helpBlock = $("#" + errorId);
        var errMsg = $this.attr("error-message");
        var $span = $('<span>' + errMsg + '<span>');
        var existSpan = false;
        $helpBlock.find("span").each(function () {
            if ($(this).text() === errMsg) {
                existSpan = true;
            }
        });
        if (!existSpan) {
            $helpBlock.append($span);
        }
        var display = $helpBlock.css("display");
        if (display == "none") {
            $helpBlock.show();
        }
    }

    //----移除错误验证信息
    function removeErrorMsg($this) {
        $this.parent(".control-group").removeClass("has-error");
        var $helpBlock = $("#" + errorId);
        var errMsg = $this.attr("error-message");
        $helpBlock.find("span").each(function () {
            if ($(this).text() === errMsg) {
                $(this).remove();
            }
        });

        if ($helpBlock.find('span').length <= 0) {
            $helpBlock.hide();
        }
    }

    //----验证必填
    function verifyRequired($this) {
        var value = $this.val();
        if (validation.isNull(value)) {
            addErrorMsg($this);
            form.isFormValid = false;
            return false;
        } else {
            removeErrorMsg($this);
            return true;

        }
    }

    //----验证身份证
    function verifyIdCardNo($this) {
        var value = $this.val();
        if (!validation.isIDCardNo(value)) {
            addErrorMsg($this);
            form.isFormValid = false;
            return false;
        } else {
            removeErrorMsg($this);
            return true;
        }
    }

    //----验证手机号
    function verifyPhone($this) {
        var value = $this.val();
        if (!validation.isMobile(value)) {
            addErrorMsg($this);
            form.isFormValid = false;
            return false;
        } else {
            removeErrorMsg($this);
            return true;
        }
    }

    //----验证邮箱
    function verifyEmail($this) {
        var value = $this.val();
        if (!validation.isEmail(value)) {
            addErrorMsg($this);
            form.isFormValid = false;
            return false;
        } else {
            removeErrorMsg($this);
            return true;
        }
    }

    return form;
});
