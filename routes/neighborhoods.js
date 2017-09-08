(function() {
	'use strict';
	const express = require('express');
	const router = express.Router();
	router.route('/').get(_get);
	router.route('/novo').get(_new);
	router.route('/:id').get(_edit);

	function _get(req, res) {
		res.render('neighborhoods');
	}

	function _new(req, res) {
		res.render('neighborhoods-form', { edit: false });
	}

	function _edit(req, res) {
		res.render('neighborhoods-form', { edit: true });
	}
	module.exports = router;
})();