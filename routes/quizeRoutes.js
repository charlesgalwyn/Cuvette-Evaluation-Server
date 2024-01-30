const userAuth = require('../middlewares/userAuth');
const { createQuize, getQuize, deleteQuize, getAllQuizes, editQuize, getQuizeForAnonymous, saveQuizeResult, getAllQuizesOfUser } = require('../controllers/quizeController');
const express = require('express');
const router = express.Router();

router.route('/create-quiz').post(userAuth, createQuize);
router.route('/take-quiz/:id').get(getQuizeForAnonymous);
router.route('/save-quiz-result').post( saveQuizeResult );
router.route('/get-quizes').get(userAuth, getAllQuizes);
router.route('/user-quizes').get(userAuth, getAllQuizesOfUser);
router.route('/:id').get(userAuth, getQuize).delete(userAuth, deleteQuize).put(userAuth, editQuize)

module.exports = router;