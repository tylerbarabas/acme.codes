'use strict';

angular.module('coderunner').directive('previewImg', ['$http',
	function($http) {
		return {
			template: '<img></img>',
			restrict: 'E',
			replace: true,
			scope: '=',
			link: function postLink(scope, element, attrs) {
				
				scope.$watch('preview',function(newVal,oldVal){
					_checkForImg(newVal);
				});
				
				var _tryCount = 0;
				var _checkForImg = function(url) {
					$http.head(url).then(function(res){
						if (res.status !== 200) {
							_tryAgain(url);
						} else {
							element[0].src = url;
						}
                                        },function(res){
						setTimeout(function(){
							_tryAgain(url);
						},1000);
					});
				}

				var loader = 'modules/core/client/img/loaders/loading-icon-trans.gif';
				var _tryAgain = function(url) {
					_tryCount++;
					if (_tryCount <= 120) {
						if (element[0].src !== loader) element[0].src = loader;
                                        	_checkForImg(url);
                                        } else {
                                        	element[0].src = scope.defaultPreview;
                                        }
				}
			}

		};
	}
]);
