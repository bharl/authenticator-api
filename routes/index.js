const express  = require('express');
const auth     = require('../controllers/auth');
const router   = express.Router();
const app      = express();

router.route('/auth')
	.post(auth.authenticateUser);

router.use(function(req, res, next) {
	auth.verifyAuthentication(req, res, next);
});

router.route('/dashboard')
	.get(auth.redirectToDashboard);

module.exports = router;
