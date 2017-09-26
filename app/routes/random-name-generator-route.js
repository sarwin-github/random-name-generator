const express   = require('express');
const csrf      = require('csurf');
const router    = express();

const randomNameGeneratorController = require('../controller/random-name-generator-controller');

const csrfProtection = csrf();
router.use(csrfProtection);

// get all random people
router.route('/').get(randomNameGeneratorController.getListOfPeople);
router.route('/list').get(randomNameGeneratorController.getListOfPeople);

// create new random people
router.route('/create').get(randomNameGeneratorController.getCreateRandomName)
					   .post(randomNameGeneratorController.postCreateRandomName);

// edit a generated random person
router.route('/edit/:id').get(randomNameGeneratorController.getEditRandomName)
						 .put(randomNameGeneratorController.putEditRandomName);

// get details of generated random person
router.route('/detail/:id').get(randomNameGeneratorController.getDetailsRandomName);


// delete a generated random person
router.route('/delete/:id').delete(randomNameGeneratorController.deleteRandomName);

module.exports = router;