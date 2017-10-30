'use strict';

angular.module('coderunner').controller('CoderunnerFinishController', ['$scope','$stateParams','Api','$timeout',
	function($scope,$stateParams,Api,$timeout) {

	if (Api.domain === null) Api.getDomain();

    $scope.showPreview = false;
    $scope.showProgressBar = true;
    $scope.orderNumber = $stateParams.orderNumber;
    $scope.email = '';

    var _getProgress = function(orderNumber) {
        return Api.getProgress(orderNumber).then(function(res){
            return res.progress;
        });
    };

    $scope.init = function() {
      var checkProgress = setInterval(function(){
        _getProgress($scope.orderNumber).then(function(progress){
          if (progress === 100 && Api.domain !== null) {
            clearInterval(checkProgress);
            $scope.previewProgress = progress;

       	    $scope.urls = {
	      	    preview: Api.domain+'/orders/'+$scope.orderNumber+'/gif'+'/'+Date.now(),
		        download: Api.domain+'/orders/'+$scope.orderNumber+'/gif-file'
	        };

            $timeout(function(){
              $scope.showPreview = true;
              $scope.showProgressBar = false;
            },1000);
          } else {
            $scope.previewProgress = progress;
            $scope.preview = '';
          }
        });
      },2000);
    };

		$scope.sendEmail = function() {
			if (_validateEmail($scope.email)) {
				$scope.disableEmail = true;
				$scope.msg = 'Sending...';
				Api.sendEmail($scope.orderNumber,$scope.email).then(function(res){
					$scope.disableEmail = false;
					$scope.msg = 'Image sent to '+$scope.email+'.';
				});
			} else {
				$scope.msg = 'Not a valid email.';
			}
		};

		function _validateEmail(email) {
		    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    return re.test(email);
		}

	}
]);
