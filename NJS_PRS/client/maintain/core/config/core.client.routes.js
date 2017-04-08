'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    //$urlRouterProvider.otherwise(function ($injector, $location) {
    //  $injector.get('$state').transitionTo('not-found', null, {
    //    location: false
    //  });
    //});

    // Home state routing
    $stateProvider
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'client/maintain/core/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'client/maintain/core/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })

    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'client/maintain/core/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);
