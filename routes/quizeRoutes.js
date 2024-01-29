const userAuth = require('../middlewares/userAuth');
const { createQuize, getQuize, deleteQuize, getAllQuizes, editQuize, getQuizeForAnonymous, saveQuizeResult, getAllQuizesOfUser } = require('../controllers/quizeController');
const express = require('express');
const router = express.Router();


//quize related routes
router.route('/create').post(userAuth, createQuize);
router.route('/get-one/:id').get(getQuizeForAnonymous);
router.route('/save-result').post( saveQuizeResult );
router.route('/get-all').get(userAuth, getAllQuizes);
router.route('/get-all-of-user').get(userAuth, getAllQuizesOfUser);
router.route('/:id').get(userAuth, getQuize).delete(userAuth, deleteQuize).put(userAuth, editQuize)

module.exports = router;