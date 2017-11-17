'use strict';

angular.module('coderunner').controller('CoderunnerController', ['$scope','$rootScope','Api','$timeout','$location',
	function($scope,$rootScope,Api,$timeout,$location) {

		Api.getDomain();
		var defaultValues = {
			encodeString: '',
			resolution: '400',
			tileShape: 'square',
			bgpColor: '#FFFFFF',
			pixelColor: '#000000',
			anim: 'staticCodeOnly',
            		stencil: 0
		};

		$scope.total = 1.00;
        $scope.currentStep = 1;
        $scope.orderNumber = 0;
        $scope.canBuy = false;
        $scope.buttonPrice = '';
		$scope.encodeString = defaultValues.encodeString;
		$scope.resolution = defaultValues.resolution;
		$scope.orderParams = {
			msg: defaultValues.encodeString,
			xres: defaultValues.resolution,
			yres: defaultValues.resolution,
			tileShape: defaultValues.tileShape,
			anim: defaultValues.anim,
			bgpColor: defaultValues.bgpColor,
			pixelColor: defaultValues.pixelColor,
            stencil: defaultValues.stencil
		};
		$scope.defaultPreview = '/modules/coderunner/client/img/default.gif';
		$scope.preview = $scope.defaultPreview;
		$scope.showProgressBar = false;
		$scope.showPreview = true;
		$scope.previewProgress = 0;
        $scope.bufferTimeout = false;

		$rootScope.$on('changeCurrentStep',function(e,step){
			$scope.changeCurrentStep(step);
        });

		$scope.changeCurrentStep = function(step) {
			if (step === 3 && !$scope.canBuy) {
				return;
			} else if (step === 1) {
                $scope.orderParams.anim = defaultValues.anim;
            }
			$scope.currentStep = step;
		};

        

		var checkProgress = null;
		$scope.sendOrder = function() {
			if (checkProgress !== null) { 
				clearInterval(checkProgress);
			}

            if ($scope.currentStep === 1) {
                $scope.fbx = 0; 
            }

            $scope.showProgressBar = true;
            $scope.showPreview = false;
            $scope.previewProgress = 0;

			Api.sendOrder($scope.orderParams).then(function(res){
				
				if (typeof res === 'object') {
					$scope.showPreview = true;
					$scope.showProgressBar = false;
					$('#error-503').modal('show');
					$('#pipeline-backup').html(res.data.pipelineBackup);
					return;
				}

				$scope.orderNumber = res;

                if (typeof checkProgress !== 'undefined') clearInterval(checkProgress);

				checkProgress = setInterval(function(){
					_getProgress($scope.orderNumber).then(function(res){
						if (res.progress === 100 && res.order === $scope.orderNumber) {
							$scope.canBuy = true;
							clearInterval(checkProgress);
							$scope.previewProgress = res.progress;
							$scope.preview = Api.domain+'/orders/'+$scope.orderNumber

                            if ($scope.currentStep === 1) {
                                $scope.preview += '/frames/1';
                            } else {
						        $scope.preview += '/gif';
                            }

							$timeout(function(){
								$scope.showPreview = true;
								$scope.showProgressBar = false;
							},1000);
						} else {
							if (typeof res.progress === 'number') {
								$scope.previewProgress = res.progress;
								$scope.preview = '';
							}
						}
					});
				},2000);
			});
		};

		var initCount = 0;
		var _sendOrderBuffer = function(newVal,oldVal){
			initCount++;
			if (initCount <= myWatchList.length) return;

            if ($scope.bufferTimeout !== false) $timeout.cancel($scope.bufferTimeout);
            $scope.bufferTimeout = $timeout($scope.sendOrder,1000);
		};

		var _getProgress = function(orderNumber) {
			return Api.getProgress(orderNumber).then(function(res){
				return res;
			});
		};

		$rootScope.$on('image-uploaded',function(e,path){
		    var $full_location = $location.absUrl();
		    var $fl_parsed = $full_location.split('://');
            var $sub_doms = $fl_parsed[1].split('.');
            var $sub_dom;
            if ($sub_doms.length >= 3)
                {
                $sub_dom = $sub_doms[0] + '.';
                }
            else
                {
                $sub_dom = '';
                };
		    var $img_url = $location.protocol() + '://' +
		                   $sub_dom +
		                   'acme.codes';
			$scope.orderParams.img1 = $img_url + path;
    		if ($scope.currentStep !== 1) {
                $scope.orderParams.anim = 'uploadImageConfirmation';
	            _sendOrderBuffer();
            }
		});


		var myWatchList = [
			$scope.$watch('encodeString',function(newVal){
				$scope.orderParams.msg = newVal;
				_sendOrderBuffer();
			}),
			$scope.$watch('resolution',_sendOrderBuffer),
			$scope.$watch('orderParams.tileShape', _sendOrderBuffer),
			$scope.$watch('orderParams.anim',_sendOrderBuffer),
			$scope.$watch('orderParams.bgpColor',_sendOrderBuffer),
			$scope.$watch('orderParams.pixelColor',_sendOrderBuffer),
			$scope.$watch('orderParams.stencil',_sendOrderBuffer),
		];

		$scope.$watch('resolution',function(newVal){
			$scope.orderParams.xres = newVal;
			$scope.orderParams.yres = newVal;
		});

		$rootScope.$on('animation-selected',function(event,animation,price){
            if (typeof $scope.orderParams.frameNumber !== 'undefined'){
                delete $scope.orderParams.frameNumber;
            }
			if (animation !== '') { 
				$scope.total = price;
				$scope.orderParams.anim = animation;
				$scope.buttonPrice = '$'+parseFloat(price).toFixed(2);
			} else {
				$scope.buttonPrice = '';
				$scope.canBuy = false;
			}
		});

		$rootScope.$on('code-unlocked',function(){
			$location.url('/coderunner/finish/'+$scope.orderNumber);
		});
	}
]);
