'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		$scope.authentication = Authentication;

		$scope.toggleNavbar = function($event) {
			var target = $event.target.attributes[2].value,
			    loc = $location.url();
            console.log('target', target);
                        if (document.body.offsetWidth < 750){
                                $('#navbar-toggle').click();
                        }
			if ((target === '/' || target[1] === '#') && (loc === '/' || loc[1] === '#')) {
				target = (target.length > 1) ? $(target.split('/')[1]) : $('#home');
				if (target.length) {
					scrollTo(target.offset().top);
					return false;
				}
			} else {
				$location.url(target);
			}

		};

		var scrollTo = function(top) {
			$('html,body').animate({
				scrollTop: top - 100
			}, 500);
		};

		var mainHeader = $('#main-header');

		$(window).scroll(function (event) {
			var scroll = $(window).scrollTop();
			if (scroll > 10) {
				mainHeader.addClass('scroll-down');
			} else {
				mainHeader.removeClass('scroll-down');
			}
		});
	}
]);
