'use strict';

angular.module('coderunner').directive('fileDrop', ['$http','$rootScope',
	function($http,$rootScope) {
		return {
			restrict: 'A',
			scope: '=',
			link: function postLink(scope, element, attrs) {

                var fileInput = $('#image-select');

				element.on('dragover',function(e){
					e.preventDefault();
				});

                element.on('click',function(e){
                    fileInput.trigger('click');
                });

                fileInput.on('change',function(e){
                    console.log('file input changed',e);
                    console.log(fileInput[0].files[0]);

                    if (typeof fileInput[0].files[0] === 'undefined') return;

                    sendFile(fileInput[0].files[0]);
                });

				element.on('drop',function(e){
					e.preventDefault();
                    fileInput[0].files = e.dataTransfer.files;
//                    sendFile(e.dataTransfer.files[0]);
				});
                
                var sendFile = function (file) {
                    
					var formData = new FormData();
					formData.append('file',file);

					$.ajax({
					    url: '/coderunner/upload',
					    data: formData,
					    cache: false,
					    contentType: false,
					    processData: false,
					    type: 'POST',
					    success: function(data){
    						$rootScope.$broadcast('image-uploaded',data.filepath);
					    }
					});


                }
			}
		};
	}
]);
