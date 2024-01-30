const mongoose = require('mongoose');
const mongoURL = "mongodb+srv://charlesgalwyn:dani1998@quizzie.ffjsgce.mongodb.net/";

const mongoCon = () =>{
    if(mongoURL){
        mongoose.connect(mongoURL).then(()=>{
            console.log("Mongodb connected successfully");
        })
    }else {
        console.log("DB URL is not valid")
    }
}

module.exports = mongoCon;