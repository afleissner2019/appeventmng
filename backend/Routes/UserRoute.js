const express = require('express');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const authenticate = require("../middleware/authenticate")
const restrictTo = require('../middleware/restrictTo');
const User = require('../Models/UserModel');
// const User = require('../Models/UserModel');
const router = express.Router()
const nodemailer = require('nodemailer');
const sendEmail = require('../Utilities/sendEmail')

//register
router.post("/register", async(request,response)=>{
    const {userName,firstName, lastName, email, password, gender} = request.body;
    try{
        let data = await User.findOne({ email })
        if(data){
            return response.status(400).json({msg: "User already exist"})
        }
        data = new User({
            userName,firstName, lastName, email, password, gender


        })
        const salt = await bcrypt.genSalt(10)
        data.password = await bcrypt.hash(password, salt)
        await data.save();

        const payload = {
            id: data.id,
            iat:Date.now(),
            exp:Date.now() + 60000
        }
        jwt.sign(
            payload,
            process.env.SECRET,
            (error, token)=>{
                if(error) throw error;
                response.json({token})
            }
        )
    } catch (error){
        console.log(error);
        response.status(500).send({msg: "Server error"})
    }
})


// router.post("/", async (request, response)=>{
//     const {userName,firstName, lastName, email, password, gender} = request.body;
//     const newUser = new User({
//         userName, firstName, lastName, email, password, gender
        
//     })

//     await newUser.save()
//     response.send("Thank you, You are successfully registered")
   
   
// })

//login
router.post("/login", async(request,response)=>{
    const { email, password} = request.body
    let data = await User.findOne({ email })
    if(!data){
        return response.status(400).json({msg: "Invalid email or password. Kindly type in the right information."})
    } else{
         console.log('login...');
    }

    const isMatch = await bcrypt.compare(password, data.password)
    if(!isMatch){
        return response.status(400).json({msg: "Invalid email or password. Kindly type in the right information."})
    }

    // token
    const payload = {
        id: data.id,
        iat:Date.now(),
        exp:Date.now() + 600000

    }
    jwt.sign(
        payload,
        process.env.SECRET,
        (error, token)=>{
            if(error) throw error
            console.log(token);
            response.json({token})
        }
    )

    try{

    } catch(error){
        console.log(error);
        response.status(500).send("Server error")
    }

})

// Profile

router.get("/profile" ,authenticate , async(request, response)=>{
    const { userName, firstName, lastName, email, password, dateOfBirth, place, hometown, gender, language, yourInterests, others} = request.body
    console.log("this is test request.id", request.id);
    try{
        const user = await User.findById(request.id).select('-password')
        if(!user){
            return response.status(500).json({msg: 'Server error'})
        }
        response.json({msg: `Welcome Back ${user.userName}`})
    } catch(error){
        response.status(500).json({msg:'Server error'})
    }
    // const{ userName, firstName, lastName, email, password, dateOfBirth, place, hometown, gender, language, yourInterests, others} = request.body
    // const newUser = new User({
    //     userName, firstName, lastName, email, password, dateOfBirth, place, hometown, gender, language, yourInterests, others

    // })

    // await newUser.save()
    // response.send("Profile Updated")
})

// Get user/adminboard

router.get('/', authenticate, restrictTo('supervisor', 'admin'), async(request,response)=>{
    console.log('This is request.id', request.id);
    try{
        const user = await User.findById(request.id).select('-password')
        if(!user){
            return response.status(500).json({msg: 'Server error'})
        }
        response.json({msg: `Welcome back ${user.userName} You are logged in as ${request.user.role}`})
    } catch(error){
        response.status(500).json({msg: 'Server error'})
    }
})

// Forgot password/reset password

router.post('/forgotPassword', async (request, response)=>{
    const {email} = request.body
    const user = await User.findOne({email})
    if(!user){
        return response.status(400).json({msg: 'User email is not exist'})
    }
    const payload = {
        id: user.id,
        iat:Date.now()
    }
    const token = jwt.sign(
        payload,
        process.env.RESETPASSWORD_SECRET,
        {expiresIn: '60m'}
    )
    console.log(token);
    user.passwordResetToken = token 
    user.save()
    const resetUrl = `${request.protocol}://${request.get('host')}/user/resetPassword/${token}`
    const message = `Forgot your password? Click on the link and submit your new password and password confirmation to ${resetUrl} \n \n if you did not reset your password. Kindly ignore this email`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset link is valid for 60 minutes',
            text: message
        })
        response.status(200).json({msg: 'You have received email to change your password.'})
    } catch(error) {

    }
})

module.exports = router