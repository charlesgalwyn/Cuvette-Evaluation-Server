const app = require('./app');
require('dotenv').config();
const mongoCon = require('./database/mongoConnection');

//calling mongoCon function to build connection with db
mongoCon();


// Get API to check server health
app.get('/health', (req, res)=>{
    res.status(200).json({
        status: "Active",
        message: "Server is working finely"
    })
})

//Running the server if the port is given in the .env
const port = process.env.PORT || 4000;
if(port){
    app.listen(port, ()=>{
        console.log("Server started on the port ", port)
    })
}