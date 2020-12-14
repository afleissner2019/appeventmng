const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// dot .env.config();
 
app.get('/' , (request , response)=>{
   response.send({ msg : 'welcome to Event Manager App' })
})
app.use(express.json())
// app.use('/user' , require('./routes/user'))

// connect to mongodb 
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.MONGO_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority` , { useNewUrlParser: true , useUnifiedTopology: true })
.then(()=>{
    console.log('MonogoDB is connected 😎');
})
.catch((err)=>{
   console.log(err);
}) 



app.listen(4000 , ()=>{
    console.log('Server Started on port 4000');
})

