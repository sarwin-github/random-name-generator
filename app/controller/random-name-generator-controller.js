const mongoose       = require('mongoose');
const csrf           = require('csurf');
const csrfProtection = csrf();

module.exports.getCreateRandomName = (req, res) => {
	res.status(200).json({message: 'Hello'});
};
