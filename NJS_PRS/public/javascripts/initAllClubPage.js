/**
 * Created by CHENLA2 on 11/28/2016.
 */

var allClubList = (function () {

    var param = {
        vm : null
    };

    var onPageInit = function(page){
        //if(page.from == 'right')
        initViewModel();
        getClubs();
    };

    var initViewModel = function(){
        param.vm = new allClubViewModel();
        ko.applyBindings(param.vm, document.getElementById('allClubList'));

    };

    var getClubs = function(){
        commonFunction.loadDataWithAjax(
            interfaces.myRecreationClub.getPublishedClubs,
            null,
            null,
            {
                showLoading : true,
                myApp :  F7.instance()
            },
            function(data){
                if(commonFunction.callbackValidate(data, F7.instance())){
                    return F7.mainView().router.back();
                }
                param.vm.clubs(data);
                console.log(data);
            },
            function(error){
                param.vm.clubs([]);
                F7.instance().alert('Can not get data', 'Ooops', function () {
                    F7.mainView().router.back();
                });
            }
        )

    }

    return {
        onPageInit : onPageInit
    }
})();

var allClubViewModel = function () {
    var self = this;
    self.clubs = ko.observableArray();
};
