require.config(requireConfig);
define(['../js/services/signUpService.js', '../js/services/dictionaryService.js', 'directive'], function (signUpService, dicService) {

    var app = angular.module("myApp", ['app']);

    app.filter("genderFormat", function () {
        return function (input) {
            if (input == null) {
                return "";
            }
            var result = input === "male" ? "男" : "女";
            return result;
        }
    });

    app.controller("signUpCtrl", ['$scope', '$timeout', function ($scope, $timeout) {

        $scope.competitionKey = utility.getQueryParameter("CompetitionKey");
        //----获取赛事项目信息
        signUpService.getCompetitionProjects($scope.competitionKey).$promise.then(function (response) {
            $scope.$apply(function () {
                $scope.competition = response.Data;
                //----百度分享设置
                window.baiduShare.setShareText($scope.competition.Title + "报名进行中，小伙伴们一起参加吧~");
                if ($scope.competition != null && $scope.competition.Projects.length !== 0) {
                    $scope.currentProjectCode = $scope.competition.Projects[0].Code;
                    renderForm();
                }
            });
        });

        //----切换项目
        $scope.changeProject = function () {
            renderForm();
        }

        //----重新绘制表单页面
        function renderForm() {
            signUpService.getProjectForm($scope.competitionKey, $scope.currentProjectCode).$promise.then(function (response) {
                $scope.$apply(function () {
                    var data = response.Data;
                    $scope.project = data.Project;
                    //可报名人数
                    $scope.project.RemainingNum = $scope.project.GroupLimit - $scope.project.EnrolledCount;
                    $scope.teamForm = data.TeamForm;
                    $scope.memberForm = data.PlayerForm;
                    $scope.isGroupType = $scope.project.ProjectType === 'Group' ? true : false;
                    initPage();
                });
            });
        }

        //----页面初始化
        function initPage() {
            enableTeamOrNot();
            //队员表单
            initSignUpModel();
            initPlayerModel();
            getDictionaries();
            if ($scope.isGroupType) {
                checkMemberLimit();
            }
            //----根据项目性别限制，过滤联系人
            getProjectContacts();
        }

        //----获取表单字典值
        function getDictionaries() {
            if ($scope.memberForm.District) {
                dicService.getDicItems(constants.districtCode).$promise.then(function (response) {
                    if (response.Code === 0) {
                        $scope.$apply(function () {
                            $scope.districtList = response.Data;
                        });
                    }
                });
            }
            if ($scope.memberForm.DressSize) {
                dicService.getDicItems(constants.dressSizeCode).$promise.then(function (response) {
                    if (response.Code === 0) {
                        $scope.$apply(function () {
                            $scope.dressSizeList = response.Data;
                        });
                    }
                });
            }
            if ($scope.memberForm.ShoesSize) {
                $scope.shoesSizeList = dicService.getDicItems(constants.shoesSizeCode).$promise.then(function (response) {
                    if (response.Code === 0) {
                        $scope.$apply(function () {
                            $scope.shoesSizeList = response.Data;
                        });
                    }
                });
            }

            if ($scope.memberForm.Blood) {
                $scope.bloodList = constants.bloodList;
            }
        }

        //////////////////////////////队伍细信息表单////////////////////////////

        //----初始化队伍表单模型
        function initTeamForm() {
            $scope.team = {
                TeamKey: "",
                Name: "",
                Leader: {},
                Coach: {},
                Contact: {}
            };
            initTeamFormValidation();
        }

        //----初始化队伍表单验证
        function initTeamFormValidation() {
            $scope.teamFormIsSubmitted = false;
            $scope.isTeamNameExist = false;
            $scope.addTeamForm.$setPristine();
        }

        //----添加队伍信息时检查标志名是否重复
        $scope.checkTeamNameIsExsit = function () {
            $scope.isTeamNameExist = false;
            if (angular.isUndefined($scope.team.Name) || $scope.team.Name == null) {
                return;
            }
            signUpService.checkTeamNameIsExsit($scope.competitionKey, $scope.team.Name).$promise.then(function (response) {
                if (response.Code === 0) {
                    $scope.isTeamNameExist = response.Data;
                }
            });
        }

        //----检查表单是否通过验证
        function checkTeamForm() {
            $scope.teamFormIsSubmitted = true;
            if ($scope.addTeamForm.$invalid || $scope.formInvalid) {
                return false;
            }
            return true;
        }

        //----保存呢队伍信息
        $scope.saveTeam = function () {
            if (!checkTeamForm()) {
                return;
            }
            signUpService.saveTeam($scope.competitionKey, $scope.team).$promise.then(function (response) {
                if (response.Code === 0) {
                    var result = response.Data;
                    $scope.currentTeam = { Key: result.TeamKey, Name: result.Name };
                    $scope.myTeams.push($scope.currentTeam);
                    activeMemberTab();
                } else {
                    bootbox.alert(response.Message);
                }
            });
        }

        //---清空队伍表单
        $scope.resetTeamForm = function () {
            initTeamForm();
        }

        //-----根绝project表单配置来显示隐藏tab
        function enableTeamOrNot() {
            if ($scope.teamForm.Enable) {
                activeTeamTab();
                initTeamForm();
                getMyTeams();
            } else {
                hideTeamTab();
            }
        }

        //----队伍信息
        function getMyTeams() {
            signUpService.getMyTeams($scope.competitionKey).$promise.then(function (response) {
                if (response.Code === 0) {
                    $timeout(function () {
                        $scope.myTeams = response.Data;
                    }, 0);
                }
            });
        }

        //----选择队伍
        $scope.currentTeam = {};
        $scope.selectTeam = function (team) {
            $scope.currentTeam = angular.copy(team);
            activeMemberTab();
        }

        //----清空队伍
        $scope.clearCurrentTeam = function () {
            $scope.currentTeam = {};
            initPlayerModel();
        }

        //----更换队伍
        $scope.changeTeam = function () {
            $scope.clearCurrentTeam();
            activeTeamTab();
        }

        //----隐藏队伍信息
        function hideTeamTab() {
            $("#team-wrapper").removeClass("active").addClass("fade").hide();
            $("a[href='#team-wrapper']").parent().removeClass('active').hide();
            $("#member-wrapper").removeClass("fade").addClass("active");
            $("a[href='#member-wrapper']").parent().addClass('active');
        }

        //---激活队伍信息Tab
        function activeTeamTab() {
            $("#team-wrapper").removeClass("fade").addClass("active").show();
            $("a[href='#team-wrapper']").parent().addClass('active').show();
            $("#member-wrapper").removeClass("active").addClass("fade");
            $("a[href='#member-wrapper']").parent().removeClass('active');
        }

        //----激活队员tab
        function activeMemberTab() {
            $("#team-wrapper").removeClass("active").addClass("fade");
            $("a[href='#team-wrapper']").parent().removeClass('active');
            $("#member-wrapper").removeClass("fade").addClass("active");
            $("a[href='#member-wrapper']").parent().addClass('active');
            initPlayerModel();
        }

        ////////////////////////////////队员表单部分////////////////////////////

        //****************************队员表单联系人模块*********************//
        //----常用联系人
        signUpService.getFrequentContacts().$promise.then(function (response) {
            if (response.Code === 0) {
                $scope.contacts = response.Data;
                $scope.allContacts = angular.copy($scope.contacts);
            }
        });

        //----根据项目年龄限制，过滤联系人
        function getProjectContacts() {
            if ($scope.project.GenderRestrict.toLowerCase() === constants.projectGender.male) {
                filterContactsByGender(constants.projectGender.male);
            }
            if ($scope.project.GenderRestrict.toLowerCase() === constants.projectGender.female) {
                filterContactsByGender(constants.projectGender.female);
            } else {
                $scope.contacts = $scope.allContacts;
            }
        }

        ///---根据项目性别限制过滤联系人
        function filterContactsByGender(genderRestrict) {
            var filteredItems = [];
            for (var i = 0; i < $scope.allContacts.length; i++) {
                var contact = $scope.allContacts[i];
                if (contact.Gender === genderRestrict) {
                    filteredItems.push(contact);
                }
            }
            $timeout(function () {
                $scope.contacts = filteredItems;
            }, 0);
        }

        //----选择联系人
        $scope.selectContact = function (user) {
            $scope.player.ContactId = user.Key;
            $scope.player.Name = user.Name;
            $scope.player.IdCardNo = user.IdCardNo;
            $scope.player.Mobile = user.CellNumber;
            $scope.player.Gender = user.Gender;
            //----初始化表单验证，并验证性别
            initPlayerFormValidation();
            checkGender();
        };

        //----联系人是否展开
        $scope.isOpen = false;
        $scope.toggleShowContact = function () {
            $scope.isOpen = !$scope.isOpen;
        }

        //----将用户添加到联系人（页面级别添加）
        function addPlayerToContacts() {
            var model = {
                Name: $scope.player.Name,
                IdCardNo: $scope.player.IdCardNo,
                CellNumber: $scope.player.Mobile,
                Gender: $scope.player.Gender
            }
            var isDuplicated = false;
            for (var i = 0; i < $scope.contacts.length; i++) {
                var contact = $scope.contacts[i];
                if (contact.IdCardNo === model.IdCardNo) {
                    isDuplicated = true;
                }
            }
            if (!isDuplicated) {
                $scope.contacts.push(model);
            }
        }

        ///////////////////////////////Member Form/////////////////////////////
        //----初始化表单模型
        function initPlayerModel() {
            $scope.player = {};
            if ($scope.currentTeam.Key !== "" && $scope.currentTeam.Key !== undefined) {
                $scope.player.TeamKey = $scope.currentTeam.Key;
                $scope.player.TeamName = $scope.currentTeam.Name;
            };
            initPlayerFormValidation();
            $scope.playerForm.$setPristine();
        }

        //----初始化报名模型
        function initSignUpModel() {
            $scope.signUpModel = {
                CombiType: $scope.project.ProjectType,
                ProjectKey: $scope.project.ProjectKey,
                ProjectName: $scope.project.ProjectName,
                Members: []
            };
        }

        //----表单验证值初始化
        function initPlayerFormValidation() {
            $scope.isSubmitted = false;
            $scope.isIdCardNoUnique = true;
            $scope.isAgeInvalid = false;
            $scope.isGenderInvalid = false;
            $scope.isGenderMixedInvalid = false;
            $scope.isContactUnique = true;
        }

        //----检查身份证号的有效性
        $scope.checkIdCardNo = function () {
            $scope.isIdCardNoUnique = true;
            if ($scope.player.IdCardNo == null || $scope.player.IdCardNo == undefined || $scope.playerForm.IdCardNo.$invalid) {
                return;
            }
            checkIdCardNoUnique();
            if ($scope.isIdCardNoUnique) {
                checkGender();
                checkAge();
            }
        }

        //----检查身份证是否在members中已经使用
        function checkIdCardNoUnique() {
            for (var i = 0; i < $scope.signUpModel.Members.length; i++) {
                var member = $scope.signUpModel.Members[i];
                if (member.IdCardNo === $scope.player.IdCardNo) {
                    $scope.isIdCardNoUnique = false;
                }
            }
        }

        //----根据身份证号验证年龄是否在限制范围内
        function checkAge() {
            $scope.isAgeInvalid = false;
            var age = utility.getAgeFromIdCardNo($scope.player.IdCardNo);
            if (age < $scope.project.MinAge || age > $scope.project.MaxAge) {
                $scope.isAgeInvalid = true;
            }
        }

        //---混双项目检查性别必须为一男一女
        function checkGender() {
            $scope.isGenderInvalid = false;
            $scope.isGenderMixedInvalid = false;
            $scope.player.Gender = utility.getGenderByIdCardNo($scope.player.IdCardNo);
            $scope.project.GenderRestrict = $scope.project.GenderRestrict.toLowerCase();
            if (($scope.project.GenderRestrict === constants.projectGender.male || $scope.project.GenderRestrict === constants.projectGender.female) && $scope.project.GenderRestrict !== $scope.player.Gender) {
                $scope.isGenderInvalid = true;
            }
            if ($scope.project.GenderRestrict === constants.projectGender.mixedPair) {
                for (var i = 0; i < $scope.signUpModel.Members.length; i++) {
                    var member = $scope.signUpModel.Members[i];
                    //----如果已经添加的队员与当前队员性别相同，则无效
                    if (member.Gender === $scope.player.Gender) {
                        $scope.isGenderMixedInvalid = true;
                    }
                }
            }
        }

        //----检查报名人数上限
        function checkMemberLimit() {
            $scope.isDisabledAddBtn = false;
            $scope.isDisabledSaveBtn = true;
            var memberLen = $scope.signUpModel.Members.length;
            if (memberLen < $scope.project.MaxPlayersCount && memberLen >= $scope.project.MinPlayersCount) {
                $scope.isDisabledAddBtn = false;
                $scope.isDisabledSaveBtn = false;
            }
            if (memberLen === $scope.project.MaxPlayersCount) {
                $scope.isDisabledAddBtn = true;
                $scope.isDisabledSaveBtn = false;
            }
        }

        //----检查表单是否通过验证
        function checkMemberForm() {
            //----如果不是从联系人中选择检查身份证，否则检查cotactId
            if ($scope.player.ContactId == null) {
                checkIdCardNoUnique();
            } else {
                $scope.isContactUnique = true;
                for (var i = 0; i < $scope.signUpModel.Members.length; i++) {
                    var member = $scope.signUpModel.Members[i];
                    if (member.ContactId === $scope.player.ContactId) {
                        $scope.isContactUnique = false;
                    }
                }
            }
            checkGender();
            $scope.isSubmitted = true;
            if ($scope.playerForm.$invalid || !$scope.isIdCardNoUnique || !$scope.isContactUnique || $scope.isGenderInvalid || $scope.isGenderMixedInvalid) {
                return false;
            }
            return true;
        }

        //////////////////////////////单人项目报名/////////////////////////////////
        //----保存单人报名信息
        $scope.saveSingleSignUp = function () {
            if (!checkMemberForm()) {
                return;
            }
            addPlayerToContacts();
            $scope.signUpModel.Members.push($scope.player);
            saveSignUp();
        }

        $scope.resetMemberForm = function () {
            initPlayerModel();
        }

        //////////////////////////////多人项目报名/////////////////////////////////
        //----添加到队员列表
        $scope.addToMembers = function () {
            if (!checkMemberForm()) {
                return;
            }
            addPlayerToContacts();
            $scope.signUpModel.Members.push($scope.player);
            initPlayerModel();
            checkMemberLimit();
        };

        //----编辑成员
        $scope.editMember = function (member) {
            $scope.player = angular.copy(member);
            $scope.deleteFromMembers(member);
        }

        //----移除成员
        $scope.deleteFromMembers = function (member) {
            $scope.signUpModel.Members.remove(member);
            checkMemberLimit();
        }

        //---保存多人报名信息
        $scope.saveCombinationSignUp = function () {
            saveSignUp();
        }

        //----保存报名
        function saveSignUp() {
            signUpService.saveSignUp($scope.competitionKey, $scope.signUpModel).$promise.then(function (response) {
                if (response.Code === 0) {
                    bootbox.alert("报名成功,请在三十分钟内提交订单，否则自动取消报名信息！");
                    initPlayerModel();
                    initSignUpModel();
                    checkMemberLimit();
                    //----更新已报名信息
                    $scope.registrations = response.Data;
                    $scope.project.RemainingNum--;
                } else {
                    bootbox.alert(response.Message);
                    if (!$scope.isGroupType) {
                        initSignUpModel();
                    }
                }
                //---单人报名的项目，保存之后初始化signModel

            }, function () {
                bootbox.alert("未知错误，请联系管理员进行查看！");
            });

        }

        //----跳转至赛事报名确认页面
        $scope.goToConfirmPage = function () {
            if ($scope.registrations.Projects.length === 0) {
                bootbox.alert("该赛事下没有任何报名信息！");
                return;
            } else {
                window.location.href = baseUrl + "SignUp/Confirm?CompetitionKey=" + $scope.competitionKey;
            }
        }




        ////////////////////////////////赛事下所有报名信息//////////////////////////////
        //----获取该赛事已报名的信息
        signUpService.getRegistrationsByKey($scope.competitionKey).$promise.then(function (response) {
            if (response.Code === 0) {
                $scope.registrations = response.Data;
            } else {
                $scope.registrations = {
                    CombinationCount: 0,
                    Projects: []
                };
            }
        });

        //----删除已报名组
        $scope.deleteCombination = function (combination) {
            signUpService.deleteCombination($scope.competitionKey, combination.CombinationKey).$promise.then(function () {
                for (var i = 0; i < $scope.registrations.Projects.length; i++) {
                    var project = $scope.registrations.Projects[i];
                    for (var j = 0; j < project.Combinations.length; j++) {
                        var group = project.Combinations[j];
                        if (combination.CombinationKey === group.CombinationKey) {
                            project.Combinations.remove(combination);
                            $scope.registrations.CombinationCount--;
                        }
                        if (project.Combinations.length === 0) {
                            $scope.registrations.Projects.remove(project);
                        }

                    }
                }
            });
        };

    }]);

    var element = $("#myApp");
    angular.bootstrap(element, ["myApp"]);

});