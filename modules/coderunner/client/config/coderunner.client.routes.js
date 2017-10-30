'use strict';

//Setting up route
angular.module('coderunner').config(['$stateProvider',
	function($stateProvider) {
		// Coderunner state routing
		$stateProvider.
		state('coderunner', {
			url: '/',
			templateUrl: '/modules/coderunner/client/views/coderunner.client.view.html'
		}).
		state('coderunner-finish', {
			url: '/coderunner/finish/:orderNumber',
			templateUrl: '/modules/coderunner/client/views/coderunner-finish.client.view.html'
		});
	}
]);
