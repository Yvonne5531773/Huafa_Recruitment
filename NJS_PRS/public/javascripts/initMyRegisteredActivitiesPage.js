/**
 * Created by CHENLA2 on 12/19/2016.
 */
var myRegisteredActivities = (function () {

    var param = {
        vm : null
    };

    var onPageInit = function (page) {
        initViewModel();
        getMyRegisteredActivities();
    };

    var initViewModel = function(){
        param.vm = new myRegisteredActivitiesViewModel();
        ko.applyBindings(param.vm, document.getElementById('myRegisteredActivities'));
    };

    var getMyRegisteredActivities = function(){
        commonFunction.loadDataWithAjax(
            interfaces.myRecreationClub.getMyActivities,
            null,
            null,
            {
                showLoading : true,
                myApp :  F7.instance()
            },
            function(data){
                param.vm.items(data);
            },
            function(error){
                param.vm.items([]);
                F7.instance().alert('Can not get data', 'Ooops', function () {
                    F7.mainView().router.back();
                });
            }
        )

    };

    return {
        onPageInit : onPageInit
    }
})();

var myRegisteredActivitiesViewModel = function () {
    var self = this;
    self.items = ko.observableArray();
};
