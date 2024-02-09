const Quize = require('../database/models/Quiz');
const mongoose = require('mongoose');

//controller function to create quize
exports.createQuize = async(req, res) =>{
    try {
        const { name, quizeType, timePerQuestion, QnAQuestions, pollQuestions} = req.body;
        
        //check if name and quize if present
        if(!name || !quizeType ){
            return res.status(400).json({error: "Quize name and Quize type is required"})
        }

        //check is questions array is not empty
        if((quizeType == 'QnA' && !QnAQuestions) || quizeType == 'poll' && !pollQuestions){
            return res.status(400).json({error: "Some Question info is missing"})
        }

        //check if time is available in quize type
        if(quizeType == 'QnA' && !timePerQuestion){
            return res.status(400).json({error: "Timer is required"})
        }

        //generating _id
        const _id = new mongoose.Types.ObjectId();

        //generating URL
        const URL = `https://charlesgalwyn-gmail-com-cuvette-final-evaluation-june.vercel.app/anonymous/${_id}`;


        //creating new quize if all data is correct
        const quize = await Quize.create({
            _id,
            creator: req.user,
            url: URL,
            ...req.body,
        });

        

        res.status(201).json({
            success: true,
            url: URL,
            message: "Quize created successfully",
            quize
        })

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//controller function to get one quize -- for anonymous
exports.getQuizeForAnonymous = async(req, res) =>{
    try {

        //checking if id is not found
        const {id} = req.params;
        if(!id){
            return res.status(400).json({error: "Id is required"});
        }

        //getting quiz with id
        let quize = await Quize.findById(id);
        if(!quize){
            return res.status(400).json({error: "Invalid id"});
        }

        quize.impressions += 1;

        //updating impressions
        const updatedQuize = await Quize.findByIdAndUpdate(id, quize);

        res.status(200).json({
            success: true,
            message: "Quize found successfully",
            time: quize.timePerQuestion,
            quizeType: quize.quizeType,
            questions: updatedQuize.quizeType == 'QnA' ? updatedQuize.QnAQuestions : updatedQuize.pollQuestions,
        })

    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}

//controller function to get all quizes
exports.getAllQuizes = async(req, res) =>{
    try {
        //getting all quiz
        const quizes = await Quize.find();
        if(!quizes){
            return res.status(400).json({error: "No quizes found"});
        }

        const totalQuizes = quizes.length;
        let totalQuestions = 0;
        let totalImpressions = 0;
        let ques = [];

        for(let i=0; i<totalQuizes; i++){
            ques = quizes[i].quizeType == 'QnA' ? quizes[i].QnAQuestions : quizes[i].pollQuestions;
            totalQuestions += ques.length;
            totalImpressions += quizes[i].impressions;
        }

        const filteredQuizes = quizes.filter((q, i)=>q.impressions > 1)

        const sortedQuizes = filteredQuizes.sort((a, b)=> b.impressions - a.impressions)

        res.status(200).json({
            success: true,
            message: "Quizes found successfully",
            quizes: sortedQuizes,
            totalQuizes,
            totalQuestions,
            totalImpressions,
        })

    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}

//controller function to get all quizes
exports.getAllQuizesOfUser = async(req, res) =>{
    try {
        //getting all quiz
        const quizes = await Quize.find({creator: req.user._id})
        if(!quizes){
            return res.status(400).json({error: "No Quize Created yet!"});
        }


        res.status(200).json({
            success: true,
            message: "Quizes found successfully",
            quizes,
        })

    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}

//controller function to get one quize -- for user
exports.getQuize = async(req, res) =>{
    try {

        //checking if id is not found
        const {id} = req.params;
        if(!id){
            return res.status(400).json({error: "Id is required"});
        }

        //getting quiz with id
        const quize = await Quize.findOne({_id: id, creator: req.user._id});
        if(!quize){
            return res.status(400).json({error: "Invalid id"});
        }

        res.status(200).json({
            success: true,
            message: "Quize found successfully",
            quize
        })

    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}

//controller function to delete one quize
exports.deleteQuize = async(req, res) =>{
    try {
        //checking if id is not found
        const {id} = req.params;
        if(!id){
            return res.status(400).json({error: "Id is required"});
        }

        //getting quiz with id and delete
        const quize = await Quize.deleteOne({_id: id, creator: req.user._id})
        if(!quize){
            return res.status(400).json({error: "Invalid id"});
        }

        res.status(200).json({
            success: true,
            message: "Quize deleted successfully",
        })
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
}

//controller function to edit a quize
exports.editQuize = async(req, res) =>{
    try {
        //checking if id is not found
        const {id} = req.params;
        if(!id){
            return res.status(400).json({error: "Id is required"});
        }

        //getting quiz with id and delete
        const quize = await Quize.findOneAndUpdate({_id: id, creator: req.user._id}, req.body);
        if(!quize){
            return res.status(400).json({error: "Invalid id"});
        }

        res.status(200).json({
            success: true,
            url: quize.url,
            message: "Quize updated successfully",
        })
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
}

//save quize result --given by an anonymous

exports.saveQuizeResult = async (req, res) =>{
    try {
        const { quizeId, choosedOptions} = req.body;

        //cehck if quizeId is not available
        if(!quizeId){
            return res.status(400).json({error: "Quize Id is required"});
        }

        //check if choosedoptions are not available
        if(!choosedOptions){
            return res.status(400).json({error: "Array of correct options is  required"});
        }

        let quize = await Quize.findById(quizeId);

        //check if quize not found with provided quizeId
        if(!quize){
            return res.status(409).json({error: "Invalid Quiz Id"})
        }

        let correctAttempts = 0;

        for (let i=0; i<choosedOptions.length; i++){
            if(quize.quizeType == 'QnA'){

                if(choosedOptions[i] == quize.QnAQuestions[i].correctOption){
                    quize.QnAQuestions[i].correctAttempts += 1;
                    correctAttempts += 1;
                }

                if(choosedOptions[i]){
                    quize.QnAQuestions[i].totalAttempts += 1;
                }

            }else {
                if(choosedOptions[i]){
                    quize.pollQuestions[i].options[Number(choosedOptions[i])-1].totalChoosed += 1;
                }
            }
        }

        const updatedQuize = await Quize.findByIdAndUpdate(quizeId, quize);

        if(updatedQuize){
            res.status(200).json({
                success: true,
                message: "Quize submitted successfully",
                correctAttempts: quize.quizeType == 'QnA' ? correctAttempts : null,
            })
        }
        else {
            return res.status(500).json({error: "Error while updating quize"})
        }
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}