'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    multiparty = require('multiparty'),
    path = require('path'),
    braintree = require('braintree'),
    config = require('../../../../config/env/default'),
    crypto = require('crypto'),
    request = require('request'),
    fs = require('fs'),
    gateway = braintree.connect(config.braintree),
    domain = config.apiDomain;

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index');
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

/**
   Get API Domain
*/
exports.getApiDomain = function (req,res) {
  res.status(200).send(domain);
};

/**
 * Get animations menu
 */
exports.getAnimsJson = function(req, res) {
  request.post(domain+'/anims-json?filtered=0&flat=1&tags=image,swarm',{},function(error,response,body){
    if (!error && res.statusCode === 200) {
      res.status(200).send(body);
    } else {
      res.status(res.statusCode).send(error);
    }
  });
};

/**
  Submit an order
*/
exports.sendOrder = function(req,res) {

  var remoteIp = (typeof req.headers['x-forwarded-for'] === 'object')?req.headers['x-forwarded-for'][0]:req.headers['x-forwarded-for'],
      addr = domain+'/new?'+req.body.encode.replace(/#/g,'')+'remoteIp='+remoteIp;

  request.post(addr,{},function(error,response,body){
    if (!error && response.statusCode === 200) {
      	res.status(200).send(body);
    } else {
     	res.status(response.statusCode).send(response);
    }
  });
};

/**
  Get progress of an order
*/
exports.getProgress = function(req,res) {
  request.post(domain+'/orders/'+req.body.orderNumber+'/progress',{},function(error,response,body){
    if (!error && res.statusCode === 200) {
      res.status(200).send(body);
    } else {
      res.status(res.statusCode).send(error);
    }
  });
};


/**
 * Generate Braintree token
 */
exports.generateToken = function(req, res) {
    gateway.clientToken.generate({
        //customerId: 'aasada33f3akah33222'
    }, function (err, response) {
        res.send(response);
        res.status(200);
    });

};

/**
 * Process Payments
 */
exports.processPayment = function (req,res) {

    var nonce = req.body.nonce;
    var amount = req.body.amount;

    gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: nonce
    }, function (err, result) {
        if (!err) {
            res.send(result);
            res.status(200);
        } else {
            res.send(err);
            res.status(500);
        }

    });
};

/**
 * Image uploads
 */
exports.upload = function(req, res) {
    var appDir = path.dirname(require.main.filename),
        moduleOrigin = req.get('moduleorigin'),
        dest = appDir + '/modules/coderunner/client/img/';


    var form = new multiparty.Form({uploadDir: dest});
    form.on('error',function(err) {
        console.log('Error parsing form: ' + err.stack);
    });

    form.parse(req, function (err, fields, files){
        if (!err) {
    	    var newPath = dest+'upload_'+files.file[0].originalFilename;
	        fs.rename(files.file[0].path,newPath);
            res.status(200).json({ 'filepath': '/modules' + newPath.split('/modules')[1] });
        } else {
            res.status(500).send(err);
        }
    });
};

/**
  Unlock the code
*/
exports.unlock = function(req,res) {
    if (typeof req.body.orderNumber === 'string') {
      var orderNumber = req.body.orderNumber.split('_'),
      md5 = crypto.createHash('md5').update((parseInt(orderNumber[0]) - 94005000)+'_'+orderNumber[1]).digest('hex');
      var clientIp = (typeof req.headers['x-forwarded-for'] === 'object')?req.headers['x-forwarded-for'][0]:req.headers['x-forwarded-for'];
      request.post(domain+'/orders/'+orderNumber[0]+'_'+orderNumber[1]+'/'+md5+'?ip='+clientIp,{},function(error,response,body){
        res.status(200).send(true);
      });
    } else {
      res.status(500).send('No code provided.');
    }
};

/**
  Email the finished code
*/
exports.sendEmail = function(req,res) {
  if (typeof req.body.orderNumber === 'string') {
    var orderNumber = req.body.orderNumber,
        email = req.body.email;

    request.post(domain+'/orders/'+orderNumber+'/gif?eMail='+email,function(error,response,body){
      res.status(200).send(true);
    });
  } else {
    res.status(500).send('No code provided.');
  }
};

exports.testGif = function(req,res) {
	request.get(domain+'/orders/'+req.bodyorderNumber+'/gif',function(error,response,body){
		res.status(200).send(JSON.stringify({statusCode: response.statusCode, headers: response.headers}));
	});
};
