'use strict';

angular.module('coderunner').directive('animationSelector', ['$location','$http','$compile','Api','$rootScope',
	function(location,$http,$compile,Api,$rootScope) {
		return {
			templateUrl: ('/modules/coderunner/client/views/animation-selector.client.directive.html'),
			restrict: 'E',
			replace: true,
			link: function postLink(scope, element, attrs) {

				scope.animationPath = '/';
				scope.currentAnimation = '';
				scope.categories = [];
				scope.subDomain = location.absUrl();

				Api.getAnimsJson().then(function(res){
					scope.animations = res.animations;
				});

				scope.setPath = function(animation,price){
					animation = animation || '';

					scope.currentAnimation = animation;

					if (animation !== '') {
						$rootScope.$broadcast('animation-selected',animation,price);
					} else {
						$rootScope.$broadcast('animation-selected','','');
					}
				};
			}
		};
	}
]);
