'use strict';

var coderunner = require('../controllers/coderunner.server.controller');

module.exports = function(app) {
    app.route('/coderunner')
        .get(coderunner.renderIndex)
	app.route('/coderunner/generate-token/')
		.post(coderunner.generateToken);
	app.route('/coderunner/process-payment')
		.post(coderunner.processPayment);
	app.route('/coderunner/upload')
		.post(coderunner.upload);
	app.route('/coderunner/unlock')
		.post(coderunner.unlock);
	app.route('/coderunner/anims-json')
		.post(coderunner.getAnimsJson);
	app.route('/coderunner/send-order')
		.post(coderunner.sendOrder);
	app.route('/coderunner/get-progress')
		.post(coderunner.getProgress);
	app.route('/coderunner/send-email')
		.post(coderunner.sendEmail);
	app.route('/coderunner/test-gif')
		.post(coderunner.testGif);
	app.route('/coderunner/get-api-domain')
		.post(coderunner.getApiDomain);
    
};
