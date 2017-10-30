'use strict';

angular.module('coderunner').factory('Braintree', ['$http','$rootScope',
	function($http,$rootScope) {
		return {
			getToken: function () {
				return $http.post('/coderunner/generate-token').
					success(function (data, status, headers, config) {
						return data.clientToken;
					}).
					error(function (data, status, headers, config) {
						return 'Error.';
					});
			},

			setup: function (clientToken,total) {
				window.braintree.setup(
					clientToken,
					'dropin', {
						container: 'payment-form',
						onPaymentMethodReceived: this.processPayment.bind(this,total),
						onError: this.paymentError.bind(this)
					}
				);
			},

			processPayment: function(total,data) {
				$http.post('/coderunner/process-payment',{
					nonce: data.nonce,
					amount: total
				}).then(function(data){
					$rootScope.$broadcast('payment-complete', data);
				});
			},

			paymentError: function(e) {
				$rootScope.$broadcast('payment-error', e);
			}
		};
	}
]);
