/**
 * Created by CHENLA2 on 10/26/2016.
 */

$(document).ready(function () {
    F7.init();
});

var F7 = (function(){
    var param = {
        app : null,
        mainView : null
    };
    var init = function(){
        // new F7
        param.app = new Framework7({
            tapHold: true,
            pushState: true,
            swipePanel: 'left',
            init: false
        });
        // Add view
        param.mainView = param.app.addView('.view-main', {
            dynamicNavbar: true
        });
        // bind event
        initPageEvent();
        // init F7
        param.app.init();
    };
    var instance = function(){
        return param.app;
    };
    var mainView = function(){
        return param.mainView;
    };
    var initPageEvent = function(){
        param.app.onPageInit('myClubList', function (page) {
            myClubList.onPageInit(page);
            $('#tab2').on('show', function () {
                $(this).find('.swiper-container')[0].swiper.update();
            });
            $('#tab1').on('show', function () {
                $(this).find('.swiper-container')[0].swiper.update();
            });
        });
        param.app.onPageInit('myActivities', function (page) {
            myActivities.onPageInit(page);
        });
        param.app.onPageInit('myActivityDetails', function (page) {
            myActivityDetails.onPageInit(page);
        });
        param.app.onPageInit('allClubList', function (page) {
            allClubList.onPageInit(page);
        });
        param.app.onPageInit('myFastRegister', function (page) {
            myFastRegister.onPageInit(page);
        });
        param.app.onPageInit('myClubDetails', function (page) {
            clubDetails.onPageInit(page);
        });
    };

    return {
        instance : instance,
        mainView : mainView,
        init : init
    };
})();
