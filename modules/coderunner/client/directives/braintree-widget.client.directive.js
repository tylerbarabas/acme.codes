'use strict';

angular.module('coderunner').directive('braintreeWidget', ['Braintree', '$rootScope','Api',
	function(Braintree,$rootScope,Api) {
		return {
			templateUrl: '/modules/coderunner/client/views/braintree-widget.client.view.html',
			restrict: 'E',
			scope: {
				total: '=',
        			orderNumber: '=',
				encodeString: '=',
				displayTotal: '='
			},
			link: function postLink(scope, element, attrs) {

				scope.hideSubmit = false;
				scope.disableSubmit = false;
				scope.showSuccess = false;
				scope.showError = false;
				scope.errorMsg = 'test';

				scope.$watch('total',function(){
					Braintree.getToken().then(function(res){
						var iframe = document.getElementById('braintree-dropin-frame');
						if (iframe) iframe.parentNode.removeChild(iframe);

                                        	var clientToken = res.data.clientToken;
                                        	Braintree.setup(clientToken,scope.total);
                                	});
				});

				scope.changeCurrentStep = function(step) {
					$rootScope.$broadcast('changeCurrentStep',step);
				};
				scope.$on('payment-complete',function(evt,args){
					if (args.data.success) {
						scope.showSuccess = true;
						scope.showError = false;

            Api.unlock(scope.orderNumber).then(function(res){
              $rootScope.$broadcast('code-unlocked');
            });
					} else {
						scope.hideSubmit = false;
					}

					// scope.$apply();
				});

				scope.$on('payment-error',function(evt,args) {
					scope.errorMsg = args.message;
					scope.showError = true;

					scope.$apply();
				});

			}
		};
	}
]);
