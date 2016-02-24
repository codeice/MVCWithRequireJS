(function () {

    //=====================验证对象===============================//
    window.validation = {
        /*用途：检查输入字符串是否为空或者全部都是空格*/
        isNull: function (str) {
            if (str == "") {
                return true;
            }
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        },

        /*用途：检查输入的Email信箱格式是否正确*/
        isEmail: function (strEmail) {
            var emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if (emailReg.test(strEmail)) {
                return true;
            } else {
                return false;
            }
        },

        /*用途：检查输入手机号码是否正确*/
        isMobile: function (strMobile) {
            var regu = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            var re = new RegExp(regu);
            if (re.test(strMobile)) {
                return true;
            } else {
                return false;
            }
        },

        /*用途：检查输入身份证号（15或18位）是否正确*/
        isIDCardNo: function (strIdCardNo) {
            var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
            var re = new RegExp(reg);
            if (re.test(strIdCardNo)) {
                return true;
            } else {
                return false;
            }
        }
    };//end validation

    //=====================Cookie处理对象========================//
    window.cookieHelper = {
        setCookie: function (key, value, expSeconds) {
            var d = new Date();
            d.setTime(d.getTime() + (expSeconds * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = key + "=" + value + "; " + expires + ";path=/";
        },

        getCookie: function (key) {
            var name = key + "=";
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.indexOf(name) == 0)
                    return cookie.substring(name.length, cookie.length);
            }
            return "";
        },

        checkCookie: function (key) {
            if (cookieHelper.getCookie(key) == "") {
                return false;
            } else {
                return true;
            }
        },

        clearCookie: function (key) {
            cookieHelper.setCookie(key, "", -1);
        }
    };
    //end cookieHelper

    window.utility = {
        //获取URL参数值
        getQueryParameter: function (param) {
            var reg = new RegExp("(^|\\?|&)" + param + "=([^&]*)(\\s|&|$)", "i");
            if (reg.test(location.href))
                return unescape(RegExp.$2.replace(/\+/g, " "));
            return "";
        },

        //----根据身份证号获取年龄
        getAgeFromIdCardNo: function (idCardNo) {
            if (!validation.isIDCardNo(idCardNo)) {
                return 0;
            }
            var bornYear = idCardNo.substring(6, 10);
            var nowDate = new Date();
            var nowYear = nowDate.getFullYear();
            /*     var bornMonth = IdCardNo.substring(10, 12);
                 var bornDate = IdCardNo.substring(12, 14);*/
            /*var currentMonth = nowDate.getMonth() + 1;
            var currentDay = nowDate.getDate();*/
            var age = nowYear - bornYear;
            return age;
        },

        //格式化日期
        formatDate: function (strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        },

        //根据身份证号，获取性别
        parseGenderByIdCardNo: function (idCardNo) {
            if (typeof (idCardNo) !== "string") {
                return "";
            }
            var number = idCardNo.substring(14, 17);
            if (number % 2 === 0) {
                return '女';
            } else {
                return '男';
            }
        },

        //根据身份证号，获取性别
        getGenderByIdCardNo: function (idCardNo) {
            if (typeof (idCardNo) !== "string") {
                return "";
            }
            var number = idCardNo.substring(14, 17);
            if (number % 2 === 0) {
                return 'female';
            } else {
                return 'male';
            }
        },

        //根据身份证号，获取出生年月日
        getBirthday: function (idCardNo) {
            if (idCardNo != '') {
                var year = idCardNo.substring(6, 10);
                var month = idCardNo.substring(10, 12);
                var day = idCardNo.substring(12, 14);
                return year + '-' + month + '-' + day;
            }
            else {
                return '';
            }
        }

    };

    window.UIHelper = {
        alert: function () {

        }
    };



    //----扩展方法
    //---移除 数组中的某项
    Array.prototype.remove = function (item) {
        var index = this.indexOf(item);
        if (index >= 0) {
            this.splice(index, 1);
        }
    };

    //----删除数组中的特定项
    Array.prototype.removeRange = function (items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var index = this.indexOf(item);
            if (index >= 0) {
                this.splice(index, 1);
            }
        }
    };

})();
