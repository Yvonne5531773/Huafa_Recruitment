/**
 * Created by CHENLA2 on 10/27/2016.
 */

var interfaces_server = "/rc";
var host = window.location.href;

var interfaces = {
    myRecreationClub: {
        getPublishedClubs: interfaces_server + "/getPublishedClubs/",
        getClubActivities: interfaces_server + "/getClubActivities/",
        getActivityDetails: interfaces_server + "/getActivityDetails/",
        getMyFocusClubs: interfaces_server + "/getMyFocusClubs/",
        focusClub: interfaces_server + "/focusClub/",
        registerActivity: interfaces_server + "/registerActivity/",
        saveRegisterActivity: interfaces_server + "/saveRegisterActivity/",
        getPublishedActivities: interfaces_server + "/getPublishedActivities/",
        getClubDetail: interfaces_server + "/getClubDetail/",
        getIsFocus: interfaces_server + "/getIsFocus/",
    }
};
