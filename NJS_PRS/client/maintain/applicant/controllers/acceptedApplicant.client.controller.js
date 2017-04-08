/**
 * Created by hfjylzh on 3/23/2017.
 */

angular.module('applicant').controller('AcceptedApplicantController', ['$scope', '$http', '$uibModal', 'i18nService', 'instance',
    '$q', '$log', 'PositionService', 'DictionaryService', 'ApplicantService',
    function ($scope, $http, $uibModal, i18nService, instance, $q, $log, PositionService, DictionaryService, ApplicantService) {

        i18nService.setCurrentLang("zh-cn");
        $scope.data = {};
        $scope.detail = function(calEvent){
            ApplicantService.getResume({_id: calEvent.applicant.resume},function(err, resume){
                $scope.data.resume = resume.data;
                $scope.data.interviewTime = getOperationTime(calEvent.progress.interviewTime);
                $scope.data.positionCompanyLocation = calEvent.progress.interviewAddress;
                $scope.data.successMessage = calEvent.position.successMessage;
                $scope.data.contact = calEvent.progress.contact;
                $scope.data.contactPhone = calEvent.progress.contactPhone;
                $scope.data.content = calEvent.progress.content;
                $scope.data.withoutEdit = true;
                instance.applicantEntity = $scope.data;
                $uibModal.open({
                    templateUrl: 'client/maintain/applicant/views/sendInterviewPreview.html',
                    controller: 'SendInterviewPreviewController'
                })
            });
        }

        function getOperationTime(date) {
            var updateDate = new Date(date);
            if (!updateDate) {
                return '';
            }
            var month = updateDate.getMonth();
            month ++;
            var day = updateDate.getDate();
            var hour = updateDate.getHours();
            var minute = updateDate.getMinutes();
            var time = updateDate.getFullYear() + '/'
                + month + '/' + day + ' ' + hour + ':' + minute;
            return time;
        }
}]);

