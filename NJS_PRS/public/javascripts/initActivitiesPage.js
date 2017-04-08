/**
 * Created by CHENLA2 on 10/26/2016.
 */
var myActivities = (function () {

    var param = {
        vm : null
    };

    var onPageInit = function(page){
        initViewModel();
        if (page.query && page.query.cid) {
            getActivities(page.query.cid);
            getIsFocus(page.query.cid);
        }
    };

    var initViewModel = function(){
        param.vm = new myActivitiesViewModel();
        ko.applyBindings(param.vm, document.getElementById('myActivities'));
    };

    var getActivities = function(clubId){
        commonFunction.loadDataWithAjax(
            interfaces.myRecreationClub.getClubActivities + clubId,
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
                param.vm.items(data);

                if(data.length > 0 && !!data[0].club){
                    var club = [data[0].club];
                    param.vm.club(club);
                    // console.log(club);
                }
                // console.log(data);
            },
            function(error){
                param.vm.items([]);
                F7.instance().alert('Can not get data', 'Ooops', function () {
                    F7.mainView().router.back();
                });
            }
        )

    }

    var getIsFocus=function(clubId){
        commonFunction.loadDataWithAjax(
            interfaces.myRecreationClub.getIsFocus + clubId,
            null,
            null,
            {
                showLoading : true,
                myApp :  F7.instance()
            },
            function(data){
                console.log(data);
                // param.vm.items(data);
            },
            function(error){
                param.vm.items([]);
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

var myActivitiesViewModel = function () {
    var self = this;
    self.items = ko.observableArray();
    self.club = ko.observableArray();
};
