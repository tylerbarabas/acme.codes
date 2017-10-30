'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Coderunner Schema
 */
var CoderunnerSchema = new Schema({
	encodeString: {
		type: String,
		default: 'http://www.pure-mirage.com'
	}
});

mongoose.model('Coderunner', CoderunnerSchema);
