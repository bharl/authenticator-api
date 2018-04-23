const express      = require('express');
const jwt          = require('jsonwebtoken');
const db           = require('../db/database');
const app          = express();

app.set('superSecret', 'changeme');

exports.authenticateUser = (req, res) => {
	db.first().from('user').where({name: req.body.name})
		.then(data => {
			if(data == undefined) {
				return res.json({
					success: false,
					message: 'Authentication failed. User not found.' }
				);
			} else if(data.password != req.body.password) {
				return res.json({
					success: false,
					message: 'Authentication failed. Wrong password.' 
				});
			} else {

				const payload = {
      				name: data.name 
    			};

				var token = jwt.sign(payload, app.get('superSecret'));

				res.cookie('token', token);
				res.json({ success: true, message: 'Enjoy your token!', token: token});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).end();
		});
};

exports.verifyAuthentication = (req, res, next) => {
	var token = req.body.token || req.query.token || req.cookies['token'];
	if (token) {
	    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
	    	if (err) {
	        	return res.json({ success: false, message: 'Failed to authenticate token.' });    
	    	} else {
	        	req.decoded = decoded;    
	    		next();
			}
	    });
	} else {
    	return res.status(403).send({ success: false, message: 'No token provided.'});
  	}
};

exports.redirectToDashboard = (req, res) => {
	res.render('dashboard', {
		username: req.decoded.name,
		layout: false
	});
};