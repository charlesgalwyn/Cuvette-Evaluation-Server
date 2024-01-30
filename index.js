const app = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');

// Get API to check server health
app.get('/health', (req, res)=>{
    res.status(200).json({
        status: "Active",
        message: "Server is working finely"
    })
})

//Running the server if the port is given in the .env
/* const port = process.env.PORT || 4000;
if(port){
    app.listen(port, ()=>{
        console.log("Server started on the port ", port)
    })
} */

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

const port = process.env.PORT || 4000;

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(res=>{
    console.log('connected to database');
    app.listen(port, () => {
        console.log(`Quizzie Backend running at http://localhost:${port}`)
        }
    );
}
).catch(err=>{
    console.log(err);
});