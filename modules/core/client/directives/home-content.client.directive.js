'use strict';

angular.module('core').directive('homeContent', ['$window','$location',
	function($window,$location) {
		return {
			restrict: 'E',
			templateUrl: 'modules/core/client/views/home-content.client.view.html',
			replace: true,
			link: function postLink(scope, element, attrs) {

				scope.year = new Date().getFullYear();

				var fitContent = function() {
					element[0].style.height = $(window).height()+'px';
					element[0].style.width = $(window).width()+'px';
				};
				fitContent();
				$(window).resize(fitContent);
				
				var scrollTo = function(top) {
					$('html,body').animate({
						scrollTop: top - 100
					}, 500);
				};

				var hash  = $location.url().split('/home')[1];
				if (hash !== '') {
					scrollTo($(hash).offset().top);
				}

				angular.element($window).bind('scroll', function() {

						var updatesFacebook = document.getElementById('updates-facebook');

						var allAnimated = document.getElementsByClassName('animated');

						for (var i=0;i<allAnimated.length;i++) {
							var dataAnimation = allAnimated[i].getAttribute('data-animation');
								if (_elementInViewport(allAnimated[i]) && dataAnimation !== 'false') {
									allAnimated[i].className = allAnimated[i].className + ' ' + dataAnimation;
									allAnimated[i].setAttribute('data-animation','false');
								}
						}

				    scope.$apply();
				});

				var _elementInViewport = function (el) {
				  var top = el.offsetTop;
				  var left = el.offsetLeft;
				  var width = el.offsetWidth;
				  var height = el.offsetHeight;

				  while(el.offsetParent) {
				    el = el.offsetParent;
				    top += el.offsetTop;
				    left += el.offsetLeft;
				  }

				  return (
				    top < (window.pageYOffset + window.innerHeight) &&
				    left < (window.pageXOffset + window.innerWidth) &&
				    (top + height) > window.pageYOffset &&
				    (left + width) > window.pageXOffset
				  );
				};
				
			}
		};
	}
]);
