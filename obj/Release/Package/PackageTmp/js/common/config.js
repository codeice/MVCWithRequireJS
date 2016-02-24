//系统配置
var appConfig = {
    apiServer: location.protocol + "//" + location.host + '/CE.Api/',
    apiBatchServer: location.protocol + "//" + location.host + '/CE.Api/batch/',
    loginUrl: baseUrl + "Account/Login",
    niceScrollColor: '#7ec098', //滚动条颜色
    payRootUrl: "http://139.196.188.108/",
    vCodeVal: 60, //初始验证码cookie值 
    vCodeExpiresSeconds: 60, //验证码过期时间（秒）
    expiresSeconds: 3600, //token过期时间设置
    phoneReg: /^[1][3-8]+\d{9}$/,

    //----跳转至订单支付页面（orderIds 订单Id的数组）
    goToPayPage: function (orderIds) {
        window.location.href = baseUrl + "SignUp/Pay?orderIds=" + orderIds.join('|');
    },

    //----跳转至订单完成页面（orderIds 订单Id的数组）
    goToCompletePage: function (orderIds) {
        window.location.href = baseUrl + "SignUp/Complete?orderIds=" + orderIds.join('|');
    },

    //----将 以|分割的orderIds字符串转成数组 
    splitOrderIds: function (orderIds) {
        return orderIds.split('|');
    }

};

//----正则表达式
var patterns = {
    idCardNo: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[0-9Xx]$/,
    mobile: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
}

//----系统常量配置
var constants = {
    //----血型
    bloodList: ["O", "A", "B", "AB"],

    gender: {
        male: "male",
        female: "female"
    },

    //----项目性别限制
    projectGender: {
        any: "any",
        mixedPair: "mixedpair",
        male: "male",
        female: "female"
    },

    //所属区
    districtCode: "district",

    //服装尺寸字典项code
    dressSizeCode: "clothesSize",

    //鞋码尺寸字典项code
    shoesSizeCode: "shoeSize",

    //支付状态
    payStatus: {
        upPaid: "Unpaid",
        paid: "Paid",
        canceled: "Canceled"
    },

    //---支付方式
    payType: {
        aliPay: "aliPay",
        weChatPay: "weChatPay"
    },

    //报名状态
    signStatus: [{ Code: "UnStart", Value: "未开始" }, { Code: "SignUping", Value: '进行中' }, { Code: "Finish", Value: "已结束" }],

    //性别
    gendersAll: [{ Code: "Male", Value: "男" }, { Code: "Female", Value: "女" }, { Code: "Any", Value: "不限" }, { Code: "MixedPair", Value: "混双" }],

    //费用类型
    priceType: [{ Code: "Pay", Value: "付费" }, { Code: "Free", Value: "免费" }],

    //报名方式
    signUpType: [{ Code: "OffLine", Value: "线下报名" }, { Code: "OnLine", Value: "线上报名" }],

    //项目类型
    projectType: [{ Code: "Group", Value: "团体" }, { Code: "Personal", Value: "个人" }]
};
