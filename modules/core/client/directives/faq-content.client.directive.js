'use strict';

angular.module('core').directive('faqContent', ['$location',
	function($location) {
		return {
			restrict: 'E',
			templateUrl: 'modules/core/client/views/faq-content.client.view.html',
			replace: true,
			link: function postLink(scope, element, attrs) {

				var fitContent = function() {
					element[0].style.height = $(window).height()+'px';
					element[0].style.width = $(window).width()+'px';
				};

				fitContent();
				$(window).resize(fitContent);

				$('#accordion').accordion();

				$('.page-scroll').off('click');
				$('.page-scroll').click(function(){
					var href = $(this).attr('href');
					$location.url(href);
				});

			}
		};
	}
]);
