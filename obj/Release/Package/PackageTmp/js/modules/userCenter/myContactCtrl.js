
define(['userCenterService', 'formValidate', 'uploadFile', 'fileService'], function (userCenterService, form, uploader,fileService) {

    //我的联系人
    var pageModel = {
        PageIndex: 1,
        PageSize: 9
    };

    //修改索引
    editIndex = 0; 

    getContactsData();

    //上一页
    $('#contacts_Prev').click(function () {
        if (pageModel.PageIndex != 1) {
            pageModel.PageIndex--;
            getContactsData();
        }
    });
    //下一页
    $('#contacts_Next').click(function () {
        if (pageModel.PageIndex < contact_pageCount) {
            pageModel.PageIndex++;
            getContactsData();
        }
    });

    //根据PageIndex和PageSize获取联系人信息
    function getContactsData() {
        userCenterService.getContacts(pageModel).$promise.then(function (response) {
            myContactData = response.Data.Data;
            contact_pageCount = response.Data.PageCount;
            if (response.Code != 20 && response.Data.Data != '') {
                $('#contacts_PageCount').html(response.Data.PageCount);
                $('#contacts_PageIndex').html(response.Data.PageIndex);
                renderTable();
            }
        });
    }

    //----绘制页面
    function renderTable() {
        var myContactCtrl = '';
        for (var i = 0; i < myContactData.length; i++) {
            myContactCtrl += getRow(myContactData[i], i);
        }
        $('#myContactInfo').html(myContactCtrl);
        //----事件绑定
        bindEditEvent();
        bindDeleteEvent();
    }

    //身份证失去焦点
    $('#IdCardNo').blur(function () {
        if ($('#IdCardNo').val().length == 18) {
            $('#Gender').val(utility.parseGenderByIdCardNo($('#IdCardNo').val()));
        }
    });

    //添加事件
    $('.btn-add').click(function () {
        showForm();
        hideError();
        $('#contact')[0].reset();
        setReadonly(['Name','IdCardNo'], 1);
        $('#addOrUpMyContacts').html('添加');
        $('#contactId').val('');
    });

    //----绑定编辑事件
    function bindEditEvent() {
        $('.icon-edit').on('click', function () {
            showForm();
            hideError();
            var index = $(this).attr('id');
            editIndex = index;
            var contactModel = myContactData[index];
            $('#contactId').val(contactModel.Key);
            $('#Name').val(contactModel.Name);
            $('#Gender').val(utility.parseGenderByIdCardNo(contactModel.IdCardNo));
            $('#CellNumber').val(contactModel.CellNumber);
            $('#IdCardNo').val(contactModel.IdCardNo);
            setReadonly(['Name', 'Gender', 'IdCardNo'],0);
        });
    }

    //---绑定删除事件
    function bindDeleteEvent() {
        $('.icon-delete').on('click', function () {
            var contactId = $(this).parent().attr('id');
            var removeStr = $(this).parent().parent();
            userCenterService.deleteContact(contactId).$promise.then(function (response) {
                if (response.Code == 0) {
                    bootbox.alert('删除成功！');
                    $(removeStr).remove();
                    backPrecedPage();
                }
                else {
                    bootbox.alert(response.Message);
                }
            });
        });
    }

    //隐藏错误信息
    function hideError() {
        //隐藏上次输入错误Span
        $('#contact-help-block').hide();
    }

    //设置class
    function setReadonly(elementIds,type) {
        for (var i = 0; i < elementIds.length; i++) {
            var elementId = elementIds[i];
            if (type == 0) {
                $("#" + elementId).attr("disabled", true).addClass('input-readonly');
            }
            else {
                $("#" + elementId).attr("disabled", false).removeClass('input-readonly');
            }
        }
    }

    //----显示联系人表单
    function showForm() {
        $('#contactFrom').show();
        $('.contact-list').hide();
        //---表单验证
        form.validateForm('contact-help-block');
    }


    //---保存添加或者修改数据
    $('#btn-save-contacts').on('click', function () {
        var contactId = $('#contactId').val();
        if (contactId == null || contactId == '') {
            //添加
            saveAdd();
        }
        else {
            //修改
            saveEdit(contactId);
        }
    });

    //添加联系人
    function saveAdd() {
        var contactInfo = {
            Name: $('#Name').val(),
            Gender: $('#Gender').val(),
            CellNumber: $('#CellNumber').val(),
            IdCardNo: $('#IdCardNo').val()
        }
        userCenterService.addContact(contactInfo).$promise.then(function (response) {
            if (response.Code == 0) {
                bootbox.alert('添加成功！');
                var contactModel = {
                    Name: $('#Name').val(),
                    CellNumber: $('#CellNumber').val(),
                    IdCardNo: $('#IdCardNo').val()
                };
                var myContactCtrl = getRow(contactModel, myContactData.length + 1);
                bindContactData();
                //$('#myContactInfo').prepend(myContactCtrl);
                //bindDeleteEvent();
                //bindEditEvent();
                //backPrecedPage();
            }
            else {
                bootbox.alert(response.Message);
            }
        });
    }

    //获取联系人信息
    function getRow(obj, i) {
        var myContactCtrl = '';
        myContactCtrl = '<tr>' +
                            '<td >' + obj.Name + '</td>' +
                            '<td>' + utility.parseGenderByIdCardNo(obj.IdCardNo) + '</td>' +
                            '<td>' + obj.CellNumber + '</td>' +
                            '<td>' + obj.IdCardNo + '</td>' +
                            '<td id="' + obj.Key + '">' +
                                '<i  class="icon-edit" id="' + i + '"></i>' +
                                '<i  class="icon-delete peration" id="' + i + '"></i>' +
                            '</td>' +
                      '</tr>';
        return myContactCtrl;
    }
    //返回事件
    $('#btn-back-contacts').on('click', function () {
        backPrecedPage();
    });

    //保存成功后返回
    function backPrecedPage() {
        $('.contact-list').show();
        $('#contactFrom').hide();
    }
    //添加成功重新绑定列表并返回
    function bindContactData()
    {
        pageModel.PageIndex = 1;
        getContactsData();
        backPrecedPage();
    }
    //修改联系人
    function saveEdit(contactId) {
        var contactInfo = {
            Key: contactId,
            Name: $('#Name').val(),
            CellNumber: $('#CellNumber').val()
        }
        userCenterService.editContact(contactId, contactInfo).$promise.then(function (response) {
            if (response.Code == 0) {
                bootbox.alert('修改成功！');
                //设置当前修改成功后的联系人手机号
                $('#myContactInfo tr').eq(editIndex).children('td').eq(2).html($('#CellNumber').val());
                backPrecedPage();
            }
            else {
                bootbox.alert(response.Message);
            }
        });
    }

    //模板下载
    $('#download').click(function () {
        var model = {
            fileName: '我的联系人导入模板.xlsx'
        };
        userCenterService.downMyContact(model).$promise.then(function (response) {
            var fileUrl = response.Data;
            location.href = fileUrl;
        });
    });

    //批量导入
    var uploadUrl = fileService.getUploaderUrl();
    uploader.uploadify($('#import'), uploadUrl, onUploadSuccess);
    function onUploadSuccess(file, data) {
        var model = {
            fileUrl: data.Data.FileUri
        };
        userCenterService.importMyContact(model).$promise.then(function (response) {
            if (response.Code == 0) {
                bootbox.alert('导入成功！');
                bindContactData();
            }
            else {
                bootbox.alert(response.Message);
            }
        });
    }
});
