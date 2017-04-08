/**
 * Created by hfjylzh on 3/23/2017.
 */

angular.module('applicant').controller('ApplicantController', ['$scope', '$http', '$uibModal', 'i18nService', 'instance',
    '$q', '$log', 'PositionService', 'DictionaryService', 'ApplicantService',
    function ($scope, $http, $uibModal, i18nService, instance, $q, $log, PositionService, DictionaryService, ApplicantService) {

    var vm = $scope.vm = {};
    vm.collapsed = true;
    i18nService.setCurrentLang("zh-cn");
    $scope.applicants = [];
    $scope.myAppScopeProvider = {
        showInfo : function(row) {
            var modalInstance = $uibModal.open({
                controller: 'InfoController',
                templateUrl: 'client/maintain/applicant/views/applicant.modal.template.html',
                resolve: {
                    selectedRow: function () {
                        row.entity.resume.data = $scope.gridApi.grid.selection.lastSelectedRow.entity;
                        row.entity.resume.icon = row.entity.resume.icon ? row.entity.resume.icon : "images/applicant_default.png";
                        row.entity.resume.birthed = !_.isEmpty(row.entity.resume.birthed)?getOperationTimeWithouthour(row.entity.resume.birthed):null;
                        ApplicantService.getProgress({applicant:row.entity._id, position:row.entity.positionId}, function(err, result){
                            if(_.isEmpty(result.data))
                                ApplicantService.upsertProgress({applicant: row.entity._id,position:row.entity.positionId,
                                    viewed: new Date()}, function(err, data){});
                        })
                        return row.entity.resume;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $log.log('modal selected Row: ' + selectedItem);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    }
    $scope.getPositionForSelectShow = function(){
        PositionService.getPositions(vm.criteria, function(err, data){
            $scope.selectForShow = data.data;
        });
    };
    $scope.getPositionForSelectShow();
    $scope.selectForDegree = ['大专','本科','硕士','博士'];
    $scope.selectForExperience = ['应届毕业生','1年','2年','3年','4年','5年','6年','7年','8年','9年','10年','10年以上'];
    $scope.myData = {
        enableSorting: true,
        showGridFooter: true,
        showColumnFooter: true,
        enableColumnResizing: true,
        enableGridMenu: true,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableFullRowSelection:true,
        exporterOlderExcelCompatibility: true,
        exporterMenuPdf: false,
        enableFiltering: false,
        enableSelectAll: false,
        appScopeProvider: $scope.myAppScopeProvider,
        rowTemplate: "<div ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
    }
    $scope.myData.data = [];

    $scope.getData = function(){
        ApplicantService.getApplicants({'applied.0': {$exists: true}}, function(err, res){
            if(res.data){
                res.data.forEach(function(applicant){
                    (function(applicant){
                        ApplicantService.getResume({_id: applicant.resume._id},function(err, resume){
                            var showData = [], data;
                            applicant.resume = resume.data;
                            applicant.applied.forEach(function(apply){
                                if(!_.isEmpty(apply.position)) {
                                    data = {};
                                    data._id = applicant._id;
                                    data.resume = applicant.resume;
                                    data.positionId = apply.position._id;
                                    data.positionName = apply.position.name;
                                    data.positionCompany = apply.position.workAddr;
                                    data.positionCompanyLocation = apply.position.location;
                                    data.successMessage = apply.position.successMessage;
                                    data.jobType = apply.position.jobType;
                                    data.applytime = getOperationTime(apply.time);
                                    data.firstEducation = getFirstEducation(applicant.resume.education);
                                    data.highEducation = getHighEducation(applicant.resume.education);
                                    $scope.myData.data.push(data);
                                    $scope.applicants.push(data);
                                }
                            });
                            // $scope.myData.data = showData;
                            // $scope.applicants = $scope.myData.data;
                        });
                    })(applicant);
                });
            }
        });
    }
    function getFirstEducation(educations) {
        var sorts = [
            {degree: '大专', flag: 4},
            {degree: '本科', flag: 3},
            {degree: '硕士', flag: 2},
            {degree: '博士', flag: 1}
        ];
        var edu = _.filter(educations, function (e) {
            return e.nature === '统招'
        });
        var arr = _.intersectionBy(sorts, edu, 'degree');
        var a = _.sortBy(arr, 'flag');
        return _.head(_.filter(educations, function (e) {
            return e.degree === (a.length==0?'':a[0].degree);
        }));
    }
    function getHighEducation(educations) {
        var sorts = [
            {degree: '大专', flag: 4},
            {degree: '本科', flag: 3},
            {degree: '硕士', flag: 2},
            {degree: '博士', flag: 1}
        ];
        var edu = _.filter(educations, function (e) {
            return e.nature === '非统招'
        });
        var arr = _.intersectionBy(sorts, edu, 'degree');
        var a = _.sortBy(arr, 'flag');
        return _.head(_.filter(educations, function (e) {
            return e.degree === (a.length==0?'':a[0].degree);
        }));
    }

    $scope.myData.multiSelect = false;
    $scope.myData.modifierKeysToMultiSelect = false;
    //$scope.myData.noUnselect = true;
    $scope.myData.onRegisterApi = function( gridApi ) {
        $scope.gridApi = gridApi;
    };

    $scope.myData.columnDefs = [
        {field: 'resume.name', enableFiltering: true, allowCellFocus:false,displayName: '应聘者'},
        {field: 'firstEducation.degree', enableFiltering: true, allowCellFocus:false, displayName:'第一学历'},
        {field: 'firstEducation.school', enableFiltering: true,allowCellFocus:false, displayName:'第一学历学校'},
        {field: 'firstEducation.profession', enableFiltering: true, allowCellFocus:false, displayName:'第一学历专业'},
        {field: 'firstEducation.ended', allowCellFocus:false, displayName:'第一学历毕业时间'},
        {field: 'highEducation.degree', allowCellFocus:false, displayName:'最高学历', visible:false},
        {field: 'highEducation.school', allowCellFocus:false, displayName:'最高学历学校', visible:false},
        {field: 'highEducation.profession', allowCellFocus:false, displayName:'最高学历专业', visible:false},
        {field: 'highEducation.ended', allowCellFocus:false, displayName:'最高学历毕业时间', visible:false},
        {field: 'resume.experience', enableFiltering: true, enableFiltering: true, allowCellFocus:false,displayName: '工作经验'},
        {field: 'resume.phone', allowCellFocus:false, displayName:'联系电话'},
        {field: 'resume.email', allowCellFocus:false, displayName:'邮箱'},
        {field: 'positionName', allowCellFocus:false, displayName:'申请职位'},
        {field: 'jobType', allowCellFocus:false, displayName:'申请职位类型'},
        {field: 'positionCompany', allowCellFocus:false, displayName:'申请职位所属单位'},
        {field: 'applytime', enableFiltering: true, allowCellFocus:false, displayName:'投递时间'},
        {field: 'resume.workunit', allowCellFocus:false, displayName:'现工作单位', visible:false},
        //{field: 'aaa', displayName: 'Operation', cellTemplate:'<div class="ui-grid-cell-contents text-center"><button class="btn btn-primary btn-xs" title="Edit" ><i class="glyphicon glyphicon-pencil"></i></button> <button class="btn btn-primary btn-xs" title="Preview"><i class="glyphicon glyphicon-floppy-disk"></i></button></div>'},
    ];
    $scope.getData();

    DictionaryService.getDictionarys({category: '职位管理-职位类型'}, function(err, result){
        if(result.data) {
            instance.allPositionTypes = result.data.map(function (data) {
                return data.value;
            });
            $scope.allPositionTypes = instance.allPositionTypes;
        }
    });

    instance.refreshForCreateOrUpdate = function(seeker){
        if(seeker != null){
            $scope.myData.data.push(seeker);
        }else{
            $scope.getData();
        }
    }

    $scope.searchApplicant = function (){
        $scope.myData.data = $scope.applicants;
        if(_.isDate($scope.applyTime)){
            var applyTime = getOperationTime($scope.applyTime);
            $scope.myData.data = _.filter($scope.applicants, function(o){return applyTime > o.applytime});
        }
        if(!_.isEmpty($scope.applicantName)){
            var regx = new RegExp($scope.applicantName, 'g');
            $scope.myData.data = _.filter($scope.applicants, function(o){return regx.test(o.resume.name)});
        }
        if(!_.isEmpty($scope.experience)){
            $scope.myData.data = _.filter($scope.applicants, {experience: $scope.experience});
        }
        if(!_.isEmpty($scope.firstEducationDegree)){
            $scope.myData.data = _.filter($scope.applicants, function(o){return o.firstEducation.degree === $scope.firstEducationDegree});
        }
        if(!_.isEmpty($scope.firstEducationSchool)){
            $scope.myData.data = _.filter($scope.applicants, function(o){return o.firstEducation.school === $scope.firstEducationSchool});
        }
        if(!_.isEmpty($scope.firstEducationProfession)){
            $scope.myData.data = _.filter($scope.applicants, function(o){return o.firstEducation.profession === $scope.firstEducationProfession});
        }
        if(!_.isEmpty($scope.positionName)){
            $scope.myData.data = _.filter($scope.applicants, {positionName: $scope.positionName});
        }
        $scope.myData.data = _.isEmpty($scope.myData.data)? []:$scope.myData.data;
    };

    $scope.cancelPosition = function() {
        $scope.positionName = null;
        $scope.applicantJobType = null;
        $scope.applicantName = null;
        $scope.firstEducationDegree = null;
        $scope.firstEducationSchool = null;
        $scope.firstEducationProfession = null;
        $scope.experience = null;
        $scope.applyTime = null;
    };

    $scope.entersearch = function(e) {
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.searchApplicant();
        }
    };

    // ui.bootstrap.datepickerPopup
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };

        function getOperationTime(date) {
            var updateDate = new Date(date);
            if (!updateDate) {
                return '';
            }
            var month = updateDate.getMonth() < 10 ? '0' + updateDate.getMonth() : updateDate.getMonth();
            month ++;
            var day = updateDate.getDate() < 10 ? '0' + updateDate.getDate() : updateDate.getDate();
            var hour = updateDate.getHours() < 10 ? '0' + updateDate.getHours() : updateDate.getHours();
            var minute = updateDate.getMinutes() < 10 ? '0' + updateDate.getMinutes() : updateDate.getMinutes();
            var time = updateDate.getFullYear() + '/'
                + month + '/' + day + ' ' + hour + ':' + minute;
            return time;
        }
        function getOperationTimeWithouthour(date) {
            var updateDate = new Date(date);
            if (!updateDate) {
                return '';
            }
            var month = updateDate.getMonth() < 10 ? '0' + updateDate.getMonth() : updateDate.getMonth();
            month ++;
            var day = updateDate.getDate() < 10 ? '0' + updateDate.getDate() : updateDate.getDate();
            var hour = updateDate.getHours() < 10 ? '0' + updateDate.getHours() : updateDate.getHours();
            var minute = updateDate.getMinutes() < 10 ? '0' + updateDate.getMinutes() : updateDate.getMinutes();
            var time = updateDate.getFullYear() + '/'
                + month + '/' + day;
            return time;
        }
}]);

angular.module('applicant').controller('InfoController',
    ['instance','$scope', '$uibModal', '$uibModalInstance', '$filter', '$interval', 'selectedRow',
        function (instance,$scope, $uibModal, $uibModalInstance, $filter, $interval, selectedRow) {

            $scope.resume = selectedRow;

            $scope.ok = function () {
                $scope.selectedRow = null;
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $scope.selectedRow = null;
                $uibModalInstance.dismiss('cancel');
            };

            $scope.interview = function(){
                instance.applicantEntity = $scope.resume;
                $uibModalInstance.close();
                $uibModal.open({
                    templateUrl: 'client/maintain/applicant/views/sendInterview.html',
                    controller: 'SendInterviewController'
                })
            }
        }
    ]);

angular.module('applicant').controller('SendInterviewController', ['instance', '$scope', '$uibModal', '$uibModalInstance', 'toaster','ApplicantService',
        function (instance, $scope, $uibModal, $uibModalInstance, toaster,ApplicantService) {

            $scope.data = _.cloneDeep(instance.applicantEntity.data);
            $scope.data.topic = $scope.data.positionCompany+'：'+$scope.data.positionName+' 面试通知';
            $scope.submit = function(isValid){
                if(isValid){
                    ApplicantService.getProgress({applicant:$scope.data._id, position:$scope.data.positionId}, function(err, result){
                        if(!_.isEmpty(result.data)){
                            ApplicantService.upsertProgress({_id: result.data[0]._id, applicant: $scope.data._id,position:$scope.data.positionId,
                                accepted:new Date(),interviewTime: $scope.data.interviewTime, name:$scope.data.resume.name,
                                contact:$scope.data.contact,contactPhone:$scope.data.contactPhone,content:$scope.data.content,
                                interviewAddress:$scope.data.positionCompanyLocation}, function(err, data){
                                if(!err){
                                    $uibModalInstance.close('ok');
                                    toaster.pop('成功', '面试通知发送成功');
                                }
                            });
                        }
                    });
                }
            }

            $scope.preview = function(){
                instance.applicantEntity = $scope.data;
                $uibModalInstance.close();
                $uibModal.open({
                    templateUrl: 'client/maintain/applicant/views/sendInterviewPreview.html',
                    controller: 'SendInterviewPreviewController'
                })
            }
        }
]);

angular.module('applicant').controller('SendInterviewPreviewController', ['instance', '$scope', '$uibModal', '$uibModalInstance', 'toaster',
    function (instance, $scope, $uibModal, $uibModalInstance, toaster) {

        $scope.data = _.cloneDeep(instance.applicantEntity);

        $scope.back = function(){
            instance.applicantEntity.data = $scope.data;
            $uibModalInstance.close();
            $uibModal.open({
                templateUrl: 'client/maintain/applicant/views/sendInterview.html',
                controller: 'SendInterviewController'
            })
        }
    }
]);