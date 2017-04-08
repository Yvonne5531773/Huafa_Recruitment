/**
 * Created by SUKE3 on 12/9/2016.
 */


var clubDetails = (function () {

    var param = {
        vm : null
    };

    var onPageInit = function (page) {
        initViewModel();
        if (page.query && page.query.cid) {
            getClubDetail(page.query.cid);
        }
    };

    var initViewModel = function(){
        param.vm = new clubDetailModel();
        ko.applyBindings(param.vm, document.getElementById('myClubDetails'));

    };

    var getClubDetail = function(clubId){
        console.log('in getClubDetail')
        commonFunction.loadDataWithAjax(
            interfaces.myRecreationClub.getClubDetail + clubId,
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
                param.vm.clubDetail(data);
                console.log(data);
            },
            function(error){
                param.vm.clubDetail([]);
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

var clubDetailModel = function () {
    var self = this;
    self.clubDetail = ko.observableArray();
};
