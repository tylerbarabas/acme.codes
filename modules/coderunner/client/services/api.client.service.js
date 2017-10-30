'use strict';

angular.module('coderunner').factory('Api', ['$http','$location',
	function($http,$location) {
		return {
			domain: null,	
			getDomain: function() {
				$http.post('/coderunner/get-api-domain').then(function(res) {
					this.domain = res.data;
				}.bind(this), function(res){
					console.log(res);
				});
			},
			getAnimsJson: function() {
				return $http.post('/coderunner/anims-json').then(function(res){
					var animations = res.data;

					return {animations: animations};
				}, function(res) {
					console.log(res);
				});

			},

			sendOrder: function(params) {
				var encode = '';
				for (var property in params) {
					if (params.hasOwnProperty(property)) {
						encode += property+'='+params[property]+'&';
					}
				}
				return $http.post('/coderunner/send-order',{encode: encode}).then(function(res){
						return res.data.orderNumber;
					}, function(res){
						return res;
					});
			},


			unlock: function(orderNumber) {
				return $http.post('/coderunner/unlock',{orderNumber:orderNumber}).then(function(res){
					return res.data;
				}.bind(this),
			function(err) {

			});
			},

			getProgress: function(orderNumber) {
				return $http.post('/coderunner/get-progress',{orderNumber: orderNumber}).then(function(res){
					return res.data;
				});
			},

			sendEmail: function(orderNumber,email) {
				return $http.post('/coderunner/send-email',{orderNumber: orderNumber,email:email}).then(function(res){
					return res;
				});
			}
		};
	}
]);
