/**
 * Created by ZOUDA on 7/1/2016.
 */
angular.module('maskerModule').factory('maskerService', ['$window', function ($window) {
    var masker = {};
    var maskerDiv = '<div id="fullscreen-spinner">'
        + '<div class="spinner-content">'
        + '<i class="fa fa-refresh fa-spin fa-3x"></i>'
        + '<p class="spinner-text">'
        + 'Loading...'
        + '</p></div></div>';
    masker.showMasker = function () {
        angular.element(document.querySelector('body')).append(maskerDiv);
    };
    masker.clearMasker = function () {
        angular.element(document.querySelector('#fullscreen-spinner')).remove();
    };
    return masker;
}]);

