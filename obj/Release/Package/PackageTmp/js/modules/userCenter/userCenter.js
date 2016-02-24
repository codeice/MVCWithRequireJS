require.config(requireConfig);
/*require([
    'userProfileCtrl',
  /*  'myOrderCtrl',
    'myEventsCtrl',
    'myScoreCtrl',
    'myContactCtrl',
    'updateCellNumberCtrl',#1#
    'formValidate',
    'utility'
], function () {

    $("a[href='#myOrder']").click(function () {
        require(['myOrderCtrl']);
    });

});*/


require.config(requireConfig);
require([
    'userProfileCtrl',
    'myOrderCtrl',
    'myEventsCtrl',
    'myScoreCtrl',
    'myContactCtrl',
    'updateCellNumberCtrl',
    'formValidate',
    'utility'
], function () {


});