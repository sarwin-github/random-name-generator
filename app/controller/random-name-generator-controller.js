const mongoose       = require('mongoose');
const People         = require('../model/people');
const csrf           = require('csurf');
const async          = require('async');
const csrfProtection = csrf();

// random names
let arrayOfRandomPeople = ['John', 'Martha', 'Violy', 'Jose', 'George', 'Michael', 'Samantha', 'Alex', 'Wilson', 'Anna', 'Frank', 'Matt'];
let arrayOfRandomCountry = ['USA', 'Peru', 'Cuba', 'Indonesia', 'Vietnam', 'China', 'Singapore', 'Canada', 'Belgium', 'Germany'];

// shuffle array
let shuffleArray = function(sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        // J = MATH.RANDOM THEN ROUND TO LOWEST
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));
        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
};

// get list of people
module.exports.getListOfPeople = (req, res) => {
	let query = People.find({}).select({'__v': 0});

	query.exec((err, people) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!people){
			return res.status(404).json({
				sucess  : false,
				message : 'A list of people does not exist.'
			});
		}

		res.render('people/people-list.ejs',{
			success   : true, 
			message   : 'Successfully fetched the list of people.',
			messages  : req.flash('message'),
			people    : people,
			csrfToken : req.csrfToken() //anti csurf token
		});
	});
};

// get the form for creating new random name
module.exports.getCreateRandomName = (req, res) => {
	res.render('people/create-random-people.ejs', {
		randomName    : shuffleArray(arrayOfRandomPeople)[0],
		randomCountry : shuffleArray(arrayOfRandomCountry)[0],
		csrfToken     : req.csrfToken() //anti csurf token
	});
};

// http post for creating new random name
module.exports.postCreateRandomName = (req, res) => {
	let person = new People();

	person.name = req.body.name;
	person.country = req.body.country

	person.save((err) => {
		if(err){
		    return res.status(500).json({success: false, message: 'Something went wrong.'});
		}
		req.flash('message', 'Successfully added a random person.');
		res.redirect('/random/name/list');
	});
};

// get the form for editing a person
module.exports.getEditRandomName = (req, res) => {
	let query = People.findById({ _id: req.params.id }).select({'__v': 0});

	query.exec((err, person) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!person){
			return res.status(404).json({
				sucess  : false,
				message : 'The person you are looking for does not exist.'
			});
		}

		res.render('people/edit-random-people.ejs', {
			person    : person,
			csrfToken : req.csrfToken() //anti csurf token
		});
	});
};

// http put for updating a person
module.exports.putEditRandomName = (req, res) => {
	async.waterfall([
		// find person by id
	    (callback) => {
	      	let query = People.findById({ _id: req.params.id }).select({'__v': 0});

  	      	query.exec((err, person) => {
  		        if(!person){
        			return res.status(404).json({
        				sucess  : false,
        				message : 'The person you are looking for does not exist.'
        			});
        		}

  		        callback(err, person);
  	      	});
	    }, 
	    // update person
	    (person, callback) => {
	    	person.name     = req.body.name;
	    	person.country  = req.body.country;
	    	person.address  = req.body.address;
	    	person.birthday = req.body.birthday;
	    	person.age      = req.body.age;

	    	person.save(err => {
	    		callback(err, person);
	    	});
	    }], (err) => {
		    if(err) {
		    	return res.status(500).json({ 
		    		sucess  : false, 
		    		error   : err, 
		    		message : 'Server error.'
		    	});
		    }
		    req.flash('message', 'Successfully updated a person');
		    res.redirect('/random/name/list');
	});
};

// get the form for editing a person
module.exports.getDetailsRandomName = (req, res) => {
	let query = People.findById({ _id: req.params.id }).select({'__v': 0});

	query.exec((err, person) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!person){
			return res.status(404).json({
				sucess  : false,
				message : 'The person you are looking for does not exist.'
			});
		}

		res.render('people/details-random-people.ejs', {
			person : person
		});
	});
};

// delete a person
module.exports.deleteRandomName = (req, res) => {
	let query = People.findOneAndRemove({ _id: req.params.id });

	query.exec((err, person) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!person){
			return res.status(404).json({
				sucess  : false,
				message : 'The person you are looking for does not exist.'
			});
		}

		req.flash('message', 'Person has been successfully deleted.');
		res.redirect('/random/name/list');
	});
};