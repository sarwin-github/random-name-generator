const express   = require('express');
const csrf      = require('csurf');
const router    = express();

const randomNameGeneratorController = require('../controller/random-name-generator-controller');

const csrfProtection = csrf();
router.use(csrfProtection);

router.route('/list').get(randomNameGeneratorController.getCreateRandomName);

module.exports = router;