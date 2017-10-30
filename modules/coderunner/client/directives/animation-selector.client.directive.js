'use strict';

angular.module('coderunner').directive('animationSelector', ['$location','$http','$compile','Api','$rootScope',
	function(location,$http,$compile,Api,$rootScope) {
	    // Small hack to have xxx.acme.codes (which are http) and acme.codes (https)
	    // to use different html files to point correctly at correlating api sub domains.
	    // This needs to be removed if in future all sub domains are https.
        var $full_location = location.absUrl();
        var $fl_parsed = $full_location.split('://');
        var $sub_doms = $fl_parsed[1].split('.');
        var $sub_dom;
//        if ($sub_doms.length >= 3)
        if ($sub_doms[0] == 'www')
            {
            $sub_dom = '';
            }
        else
            {
            $sub_dom = '-' + $sub_doms[0];
            };
		return {
			templateUrl: ('/modules/coderunner/client/views/animation-selector.client.directive' +
			              $sub_dom + '.html'),
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
