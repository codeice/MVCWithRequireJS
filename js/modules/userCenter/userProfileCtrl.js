require.config(requireConfig);
define(['uploadFile', 'userCenterService', 'fileService', 'formValidate'], function (uploader, userCenterService, fileService, form) {
    var headUrl = "";
    userCenterService.getUserProfile().$promise.then(function (response) {
        var myProfile = response.Data;
        if (response.Code == '0') {
            GetValue(myProfile);
            headUrl = myProfile['PortraitUri'];
        }
    });

    //显示表单
    $('#upProfile').click(function () {
        $('#ProfileInfo').hide();
        $('#upProfile').hide();
        $('#upCellNum').hide();
        $('#UserProfileForm').show();
        if ($('#g_IdCardNo').text() != '')
        {
            $('#up_IdCardNo').attr("disabled", true).addClass('input-readonly');
        }
        form.validateForm('userProfile-help-block');
    });

    //证件号失去焦点
    $('#up_IdCardNo').blur(function () {
        if ($('#up_IdCardNo').val().length == 18) {
            $('#up_Gender').val(utility.parseGenderByIdCardNo($('#up_IdCardNo').val()));
            $('#up_Birthday').val(utility.getBirthday($('#up_IdCardNo').val()));
        }
    });

    //返回
    $('#btn-backProfile').click(function () {
        hideFrom();//隐藏表单
        $('#userProfile-help-block').hide();//隐藏错误Span
    });

    //---点击修改手机号码
    $("#upCellNum").on('click', function () {
        $('#updateCellNumber').show();
        $('#ProfileInfo').hide();
        $('#upProfile').hide();
        $("#upCellNum").hide();
        $('#UserProfileForm').hide();
    });

    //----修改手机号码内的返回
    $("#btn-upCellBack").on('click', function () {
        $("#updateCellNumber").hide();
        $('#ProfileInfo').show();
        $('#upProfile').show();
        $("#upCellNum").show();
        $('#UserProfileForm').hide();
    });

    //隐藏表单
    function hideFrom() {
        $('#ProfileInfo').show();
        $('#upProfile').show();
        $('#upCellNum').show();
        $('#UserProfileForm').hide();
    }


    //保存
    $('#btn-saveProfile').click(function () {
        var formValue = {
            RealName: $('#up_RealName').val(),
            Nickname: $('#up_Nickname').val(),
            IdCardNo: $('#g_IdCardNo').text() != ''?'':$('#up_IdCardNo').val(),
            PortraitUri: headUrl,
            Country: $('#Country').val(),
            Position: $('#Position').val(),
            Gender: $('#up_Gender').val(),
            Birthday: $('#up_Birthday').val() == '' ? null : $('#up_Birthday').val(),
            Email: $('#up_Email').val(),
            Address: $('#up_Address').val()
        };
        userCenterService.upUserProfile(formValue).$promise.then(function (response) {
            if (response.Code == '0') {
                bootbox.alert('修改成功');
                if (formValue.IdCardNo != '' && formValue.IdCardNo != null) {
                    $('#g_IdCardNo').html(c.substring(0, 2) + '***********' + formValue.IdCardNo.substring(13, 17));
                }
                GetValue(formValue, '0');
                hideFrom();
            }
            else {
                bootbox.alert(response.Message);
            }
        });
    });

    var uploadUrl = fileService.getUploaderUrl();
    uploader.uploadify($('#uploadPortrait'), uploadUrl, onUploadSuccess);

    function onUploadSuccess(file, data) {
        headUrl = data.Data.FileUri;
    }
});
function GetValue(myProfile, type) {
    var sex = '';
    if (utility.parseGenderByIdCardNo(myProfile['IdCardNo']) == '男') {
        sex = '<label class="sex-boy">♂</label>';
    }
    else if (utility.parseGenderByIdCardNo(myProfile['IdCardNo']) == '女') {
        sex = '<label class="sex-girl">♀</label>';
    }
    else {
        sex = '';
    }

    $('#g_Nickname').html(GetValueStr(myProfile['Nickname']));
    $('#g_Gender').html(utility.parseGenderByIdCardNo(myProfile['IdCardNo']));
    $('#sex').append(sex);
    $('#g_Birthday').html(myProfile['Birthday'] == null ? '' : myProfile['Birthday'].substring(0,10).replace(/\//g, "-"));
    $('#g_Email').html(GetValueStr(myProfile['Email']));
    $('#g_Address').html(GetValueStr(myProfile['Address']));
    

    //修改保存不更新以下信息
    if (type != '0')
    {
        $('#g_CellNumber').html(GetValueStr(myProfile['CellNumber']));
        $('#g_IdCardNo').html(GetValueStr(myProfile['IdCardNo']));
    }
    $('#g_RealName').html(GetValueStr(myProfile['RealName']));
    $('#up_RealName').val(GetValueStr(myProfile['RealName']));
    $('#up_Nickname').val(GetValueStr(myProfile['Nickname']));
    $('#up_Gender').val(utility.parseGenderByIdCardNo(myProfile['IdCardNo']));
    $('#up_Birthday').val(myProfile['Birthday'] == null ? '' : myProfile['Birthday'].substring(0, 10).replace(/\//g, "-"));
    $('#up_IdCardNo').val(GetValueStr(myProfile['IdCardNo']));
    $('#up_Email').val(GetValueStr(myProfile['Email']));
    $('#up_Address').val(GetValueStr(myProfile['Address']));
    myProfile['PortraitUri'] == '' ? '' : $('.myHead').attr('src', myProfile['PortraitUri']);
}
function GetValueStr(obj) {
    if (obj == null || obj == '') {
        return '';
    }
    else {
        return obj;
    }
}


