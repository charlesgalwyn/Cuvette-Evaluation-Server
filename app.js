const app = require('./app');
require('dotenv').config();
const mongoCon = require('./database/mongoConnection');

mongoCon();

app.get('/health', (req, res)=>{
    res.status(200).json({
        status: "Active",
        message: "Server is working finely"
    })
})

const port = process.env.PORT;
if(port){
    app.listen(port, ()=>{
        console.log("Server started on the port ", port)
    })
}