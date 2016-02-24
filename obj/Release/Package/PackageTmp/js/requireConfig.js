var requireConfig = {
    baseUrl: baseUrl,
    paths: {
        //common js
        'jquery': 'libs/jquery/jquery-1.10.2.min',
        'bootstrap': 'libs/bootstrap-3.3.5/js/bootstrap.min',
        'bootbox': 'libs/bootbox/bootbox',
        'blockui': 'libs/jquery/jquery.blockUI',
        'cookie': 'libs/jquery/jquery.cookie',
        'uploadify': 'libs/uploadify/jquery.uploadify.min',

        'angular': 'libs/angular-v1.2.9/angular',
        'angular-route': 'libs/angular-v1.2.9/angular-route.min',
        'angular-batch': 'libs/angular-v1.2.9/angular-http-batch',

        //common js 
        'app': 'js/common/app',
        'directive': 'js/common/directive',
        'config': 'js/common/config',
        'utility': 'js/common/utility',
        'service': 'js/common/service',
        'uploadFile': 'js/common/uploadFile',
        'nestable': 'js/common/nestable',
        'formValidate': 'js/common/formValidate',
        'count': 'js/common/count',


        //service
        'fileService': 'js/services/fileService',
        'homeService': 'js/services/homeService',
        'signUpService': 'js/services/signUpService',
        'userCenterService': 'js/services/userCenterService',
        'dictionaryService': 'js/services/dictionaryService',
        'accountService': 'js/services/accountService',

        //ctrl
        'myOrderCtrl': 'js/modules/userCenter/myOrderCtrl',
        'userProfileCtrl': 'js/modules/userCenter/userProfileCtrl',
        'myEventsCtrl': 'js/modules/userCenter/myEventsCtrl',
        'myScoreCtrl': 'js/modules/userCenter/myScoreCtrl',
        'myContactCtrl': 'js/modules/userCenter/myContactCtrl',
        'updateCellNumberCtrl': 'js/modules/userCenter/updateCellNumberCtrl'
    },
    shim: {
        //不符合AMD规范的js定义以及依赖关系配置
        jquery: { deps: [] },
        bootstrap: { deps: ['jquery'] },
        bootbox: { deps: ['jquery', 'bootstrap'] },
        blockui: { deps: ['jquery'] },
        cookie: { deps: ['jquery'] },
        uploadify: { deps: ['jquery'] },
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-batch': { deps: ['angular'] }
    },
    waitSeconds: 300
};