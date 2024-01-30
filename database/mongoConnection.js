const mongoose = require('mongoose');
const mongoURL = process.env.DB_URL;

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