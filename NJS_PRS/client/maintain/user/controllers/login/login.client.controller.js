

angular.module('backendMaintain').controller('loginCtrl', ['$scope', '$http', 'loginServ', '$window','toaster', function ($scope, $http, loginServ, $window,toaster) {
    $scope.login = function(){
        if($scope.userId!=null && $scope.password!=null){
            loginServ.login($scope.userId.toLowerCase(),$scope.password,function(data){
                if(data==='success'){
                    $window.location.href="/maintain/platform/home";
                }else{
                    var errorMessage = data;
                    if(errorMessage){
                        toaster.pop('error', '登录提醒', errorMessage.message, 3000);
                    }
                }
            });
        }
    };
}]);
