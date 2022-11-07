const { ReturnDocument } = require('mongodb');
const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
    let sessionData = sessionFlash.getSessionData(req);
    if(!sessionData){
        sessionData={
            email:'',
            confirmEmail:'',
            password:'',
            fullname:'',
            city:'',
            address:'',
            pincode:'',
        };
    }



    res.render('customer/auth/signup',{inputData:sessionData});
}

async function signup(req, res,next) {
    console.log("Signing Up wait...");
    const enteredData = {
       email: req.body.email, 
       confirmEmail : req.body.confirmEmail,
       password: req.body.password, 
       fullname: req.body.fullname, 
        city:req.body.city, 
        address:req.body.address, 
        pincode:req.body.pincode
    }
    
    if(!validation.userDetailsAreValid(
        req.body.email, 
        req.body.password, 
        req.body.fullname, 
        req.body.city, 
        req.body.address, 
        req.body.pincode) || !validation.emailIsConfirmed(req.body.email,req.body.confirmEmail)
        ){
            
            sessionFlash.flashDataToSession(req,{
                errorMessage:'Please check your input',
               ...enteredData
            },function(){
                console.log('Invalid input')
               res.redirect('/signup'); 
            });
        
        return;
    }

   
const user = new User(req.body.email, req.body.password, req.body.fullname, req.body.city, req.body.address, req.body.pincode);

    try{
          
    const existsAlready = await user.existsAlready();


    if(existsAlready){
        sessionFlash.flashDataToSession(req,{
            errorMessage:'User exists already! Try logging in instead',
            ...enteredData,
        },function(){
            res.redirect('/signup');
        });
        
        return;
    }   


       await user.signup(); 
    } catch(error){
        next(error);
        return;

    }
    
    console.log("Signup Sucess");

    res.redirect('/login');

}

function getLogin(req, res) {
    let sessionData = sessionFlash.getSessionData(req);
    if(!sessionData){
        sessionData={
            email:'',
            password:'',
        };
    }
    res.render('customer/auth/login',{inputData: sessionData })
}

async function login(req,res,next){
    
    //const user = new User(req.body.email,req.body.password,'A','B','C','D');
    const user=new User();
    user.setEmailPass(req.body.email,req.body.password);
    
    let existingUser;
    try{
         existingUser = await user.getUserWithSameEmail();
    } catch(error){
        next(error);
        return;
    }
    
    const sessionErrorData = { 
           errorMessage:'Invalid credentials - please double check your email and password !',
            email:user.email,
            password:user.password
    }
   
    console.log('isExsisting: '+existingUser);
    if(!existingUser){
        sessionFlash.flashDataToSession(req,sessionErrorData,function(){
            console.log('Uesr Sucess');
            res.redirect('/login'); 
        });
       
        return;
    }

    const passwordIsCorrect = await user.comparePassword(existingUser.password);
    console.log('passwordIsCorrect: '+passwordIsCorrect);
    if(!passwordIsCorrect){
        sessionFlash.flashDataToSession(req,sessionErrorData,function(){
            res.redirect('/login'); 
        });
        return; 
    }

    authUtil.createUserSession(req, existingUser , function(){
      
        res.redirect('/');
    });
}

function logout(req,res){
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login:login,
    logout:logout
};